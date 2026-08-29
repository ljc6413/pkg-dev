#!/usr/bin/env node
/**
 * 试用到期 / 配额用尽提醒器（本地工具，免网络可用）
 * ---------------------------------------------------------------
 * 读取 DSH 运行时状态（$DSH_HOME/yihe-host.json）→ 计算当前套餐配额余量
 * → 配额临尽/用尽时提示购买；可选 --key 查询服务器端试用密钥剩余天数。
 *
 * 用法：
 *   node trial-remind.mjs                    # 读默认状态 (~/.dsh/yihe-host.json)
 *   node trial-remind.mjs --state <path>     # 指定状态文件
 *   node trial-remind.mjs --key PRO-XXXX-... # 额外查询服务器端试用状态
 *   node trial-remind.mjs --json             # 机器可读输出
 *
 * 退出码：0 = 正常 | 2 = 配额临尽/试用临期（提醒） | 3 = 配额用尽/试用过期（锁定）
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const PROMO = 'https://www.zhiyiwei.cn/promo'
// 配额表（与内核 PLANS 一致；<0 表示不限量）
const QUOTAS = { free: 500, pro: 10000, team: 50000, enterprise: -1 }
const NAMES = { free: '免费版', pro: '个人版', team: '团队版', enterprise: '企业版' }
// 提醒阈值：剩余 ≤10% 或 ≤50 次即提示
const WARN_RATIO = 0.1
const WARN_ABS = 50

function statePath() {
  const i = process.argv.indexOf('--state')
  return i >= 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'yihe-host.json')
}

function tierOf(licenses) {
  let tier = 'free'
  for (const lic of Object.values(licenses || {})) {
    if (lic.tier === 'enterprise') return 'enterprise'
    if (lic.tier === 'team' && tier !== 'team') tier = 'team'
    if (lic.tier === 'pro' && tier === 'free') tier = 'pro'
  }
  return tier
}

async function main() {
  const args = process.argv.slice(2)
  const jsonOut = args.includes('--json')
  const f = statePath()
  const report = { ok: true, code: 0, messages: [] }

  if (!fs.existsSync(f)) {
    report.ok = false
    report.code = 3
    report.messages.push(`状态文件不存在：${f}（尚未使用 YiHe 内核？先跑一次 yihe_reason 生成状态）`)
    if (jsonOut) { console.log(JSON.stringify(report)); return }
    console.error(`[✗] ${report.messages[0]}`)
    process.exit(report.code)
  }

  let j
  try { j = JSON.parse(fs.readFileSync(f, 'utf8')) } catch { j = {} }
  const tier = tierOf(j.licenses)
  const quota = QUOTAS[tier] ?? 500
  const usage = j.usage || {}
  let total = 0
  for (const e of Object.values(usage)) total += e.reason || 0

  const plan = NAMES[tier] || tier
  if (quota < 0) {
    report.messages.push(`当前：${plan}（不限量），无需提醒`)
  } else {
    const remain = quota - total
    const warnAt = Math.min(Math.floor(quota * WARN_RATIO), WARN_ABS)
    if (remain <= 0) {
      report.code = 3
      report.messages.push(`当前：${plan}（配额 ${quota} 次/月）——已用尽（${total} 次），思考已锁定。`)
      report.messages.push(`购买正式版解锁：${PROMO}（个人版 ¥99/月 首月 5 折 ¥49.5；团队版 ¥299/月 可 14 天试用）`)
    } else if (remain <= warnAt) {
      report.code = 2
      report.messages.push(`当前：${plan}（配额 ${quota} 次/月）——配额即将用尽，本月还剩 ${remain} 次。`)
      report.messages.push(`升级避免中断：${PROMO}（个人版 ¥99/月；超额也可按次 ¥0.05/次）`)
    } else {
      report.messages.push(`当前：${plan}（配额 ${quota} 次/月）——本月已用 ${total} 次，剩余 ${remain} 次，健康。`)
    }
    report.quota = { tier, quota, used: total, remain }
  }

  // 可选：查询服务器端试用密钥剩余天数
  const keyIdx = args.indexOf('--key')
  if (keyIdx >= 0 && args[keyIdx + 1]) {
    const key = args[keyIdx + 1]
    try {
      const resp = await fetch('https://www.zhiyiwei.cn/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      const res = await resp.json()
      const t = res.trial
      if (res.trial_expired || (t && t.days_left <= 0)) {
        report.code = Math.max(report.code, 3)
        report.messages.push(`密钥 ${key.slice(0, 8)}… 试用已到期，功能锁定。立即购买：${PROMO}`)
      } else if (t && t.days_left <= 3) {
        report.code = Math.max(report.code, 2)
        report.messages.push(`密钥 ${key.slice(0, 8)}… 试用期还剩 ${t.days_left} 天，到期后功能将锁定。现在购买享首月优惠：${PROMO}`)
      } else if (t) {
        report.messages.push(`密钥 ${key.slice(0, 8)}… 试用期还剩 ${t.days_left} 天`)
      }
    } catch { report.messages.push('（服务器查询不可达，跳过试用检查）') }
  }

  report.ok = report.code === 0
  if (jsonOut) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    for (const m of report.messages) console.log(report.code === 0 ? `[✓] ${m}` : `[!] ${m}`)
    if (report.code === 2) console.log('提示：可执行 yihe_admin op=config 或联系客服获取优惠')
    if (report.code === 3) console.log('锁定：请尽快购买恢复使用 → ' + PROMO)
  }
  process.exit(report.code)
}

main()
