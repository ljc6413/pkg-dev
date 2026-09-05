#!/usr/bin/env node
/**
 * 运营增长快照聚合器（cron 每 10 分钟跑一次，root/sudo 读 nginx 日志）
 * 输出 /opt/yihe-server/data/ops-snapshot.json，供 /api/ops 仪表盘读取。
 *
 * 数据源：
 *   - nginx access.log（sudo cat）→ 访问/下载/API 次数 + 30 天趋势
 *   - data/keys.json      → 密钥/试用（临期/过期）
 *   - data/orders.json    → 订单/支付金额
 *   - data/usage.json     → API 用量/营收
 *   - data/telemetry/*.json → 安装回传（渠道分布 + 趋势）
 *   - GitHub API          → 仓库星标 / PR #334 状态 / Discussion 5018 / Release 下载
 */
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const DIR = '/opt/yihe-server'
const DATA = path.join(DIR, 'data')
const OUT = path.join(DATA, 'ops-snapshot.json')
const GH_TOKEN = process.env.GH_TOKEN || '' // 环境变量注入；未配置时跳过 GitHub 段

const MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
const readJ = (f, def) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')) } catch { return def } }

// ---------- nginx 日志 ----------
function nginxLines() {
  try { return execSync('sudo cat /var/log/nginx/access.log 2>/dev/null', { encoding: 'utf8', timeout: 20000 }).split('\n') } catch { return [] }
}
function parseLog() {
  const re = /^(\S+).*?\[(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}).*?"(GET|POST) (\S+?) HTTP/
  const out = { visits: 0, home: 0, downloads: { pkg: 0, preset: 0, npm: 0 }, api: { reason: 0, validate: 0, activate: 0, pay: 0 }, byDay: {}, lastSeen: null }
  const today = new Date()
  const todayKey = fmtDay(today)
  let lastTs = 0
  for (const line of nginxLines()) {
    const m = line.match(re)
    if (!m) continue
    const day = `${m[4]}-${MONTHS[m[3]]}-${m[2]}`
    out.visits++
    out.byDay[day] = (out.byDay[day] || 0) + 1
    const ts = Date.UTC(+m[4], +MONTHS[m[3]] - 1, +m[2], +m[5], +m[6], +m[7])
    if (ts > lastTs) { lastTs = ts }
    const p = m[9]
    if (p === '/') out.home++
    else if (p === '/download') out.downloads.pkg++
    else if (p === '/download-preset') out.downloads.preset++
    else if (p === '/npm-package') out.downloads.npm++
    else if (p === '/v1/reason') out.api.reason++
    else if (p === '/api/validate') out.api.validate++
    else if (p === '/api/activate') out.api.activate++
    else if (p.startsWith('/api/pay')) out.api.pay++
  }
  out.today = out.byDay[todayKey] || 0
  out.downloads.total = out.downloads.pkg + out.downloads.preset + out.downloads.npm
  out.lastSeen = lastTs ? new Date(lastTs).toISOString() : null
  return out
}
function fmtDay(d) { const p = n => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }
function lastDays(n, byDay) {
  const out = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const k = fmtDay(d)
    out.push({ date: k, count: byDay[k] || 0 })
  }
  return out
}

// ---------- 业务数据 ----------
function biz() {
  const keys = readJ(path.join(DATA, 'keys.json'), { keys: [] }).keys || []
  const orders = readJ(path.join(DATA, 'orders.json'), { orders: [] }).orders || []
  const usage = readJ(path.join(DATA, 'usage.json'), { consumers: {} }).consumers || {}
  const now = Date.now()
  const trials = keys.filter(x => x.is_trial && x.trial_until > now)
  const expiring = trials.filter(x => x.trial_until - now <= 7 * 86400000)
    .map(x => ({ key: maskKey(x.key), buyer: x.buyer, days_left: Math.max(0, Math.ceil((x.trial_until - now) / 86400000)), activated: !!x.activated_at }))
    .sort((a, b) => a.days_left - b.days_left)
  const expired = keys.filter(x => x.is_trial && x.trial_until <= now && x.status === 'active')
  const paid = orders.filter(x => x.status === 'paid')
  const pending = orders.filter(x => x.status === 'created')
  const reason = Object.values(usage).reduce((s, v) => s + (v.reason || 0), 0)
  const cost = Object.values(usage).reduce((s, v) => s + (v.cost || 0), 0)
  return {
    keys: { total: keys.length, active: keys.filter(x => x.status === 'active').length, trials: trials.length, expiring_7d: expiring.length, expired: expired.length, expiring_list: expiring.slice(0, 10) },
    orders: { total: orders.length, paid: paid.length, pending: pending.length, amount_paid: Number(paid.reduce((s, o) => s + (o.amount || 0), 0).toFixed(2)) },
    usage: { consumers: Object.keys(usage).length, reason_calls: reason, revenue: Number(cost.toFixed(2)) },
  }
}
function maskKey(k) { return String(k || '').replace(/^(.{4}).*(.{4})$/, '$1…$2') }

// ---------- telemetry ----------
function telemetry() {
  const files = fs.existsSync(path.join(DATA, 'telemetry')) ? fs.readdirSync(path.join(DATA, 'telemetry')).filter(f => f.endsWith('.json')) : []
  const byChannel = {}
  const byDay = {}
  const items = []
  for (const f of files) {
    const t = readJ(path.join(DATA, 'telemetry', f), null)
    if (!t) continue
    const ch = t.channel || 'unknown'
    byChannel[ch] = (byChannel[ch] || 0) + 1
    const d = t.time ? new Date(t.time * 1000) : new Date(fs.statSync(path.join(DATA, 'telemetry', f)).mtimeMs)
    const k = fmtDay(d)
    byDay[k] = (byDay[k] || 0) + 1
    items.push({ channel: ch, event: t.event || 'install', time: t.time || null, os: t.os || null })
  }
  items.sort((a, b) => (b.time || 0) - (a.time || 0))
  return { total: files.length, by_channel: byChannel, by_day: byDay, recent: items.slice(0, 10) }
}

// ---------- GitHub ----------
async function gh(path, token) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const r = await fetch(`https://api.github.com${path}`, {
      headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'yihe-ops' },
      signal: ctrl.signal,
    })
    clearTimeout(t)
    if (!r.ok) return null
    return await r.json()
  } catch { clearTimeout(t); return null }
}
async function github() {
  if (!GH_TOKEN) return { ok: false, note: 'GH_TOKEN 未配置，跳过 GitHub 统计' }
  const g = { ok: false }
  const [repo, pr, rels] = await Promise.all([
    gh('/repos/ljc6413/pkg-dev', GH_TOKEN),
    gh('/repos/Dominic789654/awesome-deepseek-harness/pulls/334', GH_TOKEN),
    gh('/repos/ljc6413/pkg-dev/releases', GH_TOKEN),
  ])
  if (repo) {
    g.ok = true
    g.repo = { stars: repo.stargazers_count ?? 0, forks: repo.forks_count ?? 0, watch: repo.subscribers_count ?? 0, open_issues: repo.open_issues_count ?? 0 }
  }
  if (pr) {
    g.ok = true
    g.pr334 = { state: pr.state, merged: !!pr.merged_at, comments: pr.comments ?? 0, html: pr.html_url }
  }
  if (rels && rels.length) {
    g.ok = true
    g.releases = rels.map(r => ({ tag: r.tag_name, downloads: (r.assets || []).reduce((s, a) => s + (a.download_count || 0), 0) }))
  }
  // Discussion 5018 评论数（GraphQL）
  const q = JSON.stringify({ query: `query { repository(owner:"deepseek-ai", name:"deepseek-harness") { discussion(number: 5018) { title comments { totalCount } } } }` })
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const r = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `token ${GH_TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': 'yihe-ops' },
      body: q, signal: ctrl.signal,
    })
    clearTimeout(t)
    const d = await r.json()
    if (d.data && d.data.repository && d.data.repository.discussion) {
      g.ok = true
      g.discussion5018 = { title: d.data.repository.discussion.title, comments: d.data.repository.discussion.comments.totalCount }
    }
  } catch { clearTimeout(t) }
  return g
}

// ---------- 主流程 ----------
async function main() {
  const log = parseLog()
  const b = biz()
  const tel = telemetry()
  const ghData = await github()
  const snap = {
    schema: 'yihe-ops-snapshot-v1',
    generated_at: Date.now(),
    log_span: { days: Object.keys(log.byDay).length, last_seen: log.lastSeen },
    visits: { today: log.today, total_log: log.visits, home: log.home, days30: lastDays(30, log.byDay), days7: lastDays(7, log.byDay) },
    downloads: log.downloads,
    api_calls: log.api,
    telemetry: tel,
    keys: b.keys,
    orders: b.orders,
    usage: b.usage,
    github: ghData,
    funnel: { visits: log.visits, downloads: log.downloads.total, telemetry: tel.total, activated: b.keys.active, paid: b.orders.paid },
  }
  fs.writeFileSync(OUT, JSON.stringify(snap, null, 2), 'utf8')
  console.log(`[ops-snapshot] ${new Date().toISOString()} visits=${log.visits} dl=${log.downloads.total} tel=${tel.total} keys=${b.keys.total} orders=${b.orders.total} gh=${ghData.ok ? 'ok' : 'fail'}`)
}

main().catch(e => { console.error('[ops-snapshot] error:', e.message); process.exit(1) })
