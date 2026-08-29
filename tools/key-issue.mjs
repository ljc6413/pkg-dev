#!/usr/bin/env node
/**
 * 密钥签发器：生成正式商业密钥 + 台账记录（配套收款交付）
 * ---------------------------------------------------------------
 * 用法：
 *   node key-issue.mjs --tier pro --pack pkg-dev --buyer 张三
 *   node key-issue.mjs --tier team --pack pkg-dev-git --buyer "李四团队" --note 企业微信付款
 *   node key-issue.mjs --tier ent --pack pkg-dev --buyer 某企业
 *   node key-issue.mjs --list                 # 查看台账
 *   node key-issue.mjs --tier pro --validate PRO-XXXX-...  # 校验密钥格式
 *
 * 密钥格式：<PREFIX>-<16位随机大写字母数字>（8 组，与 activateLicense 校验兼容）
 *   PRO- → pro（个人版） / TEAM- → team（团队版） / ENT- → enterprise（企业版）
 *
 * 台账：keys.json（同目录），记录买主/档位/包/签发时间/状态——收款对账依据。
 * 交付流程：用户付款 → 本工具签发 → 发密钥 → 用户 yihe_license op=activate
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const LEDGER = path.join(path.dirname(process.argv[1]), 'keys.json')
const PREFIX = { pro: 'PRO', team: 'TEAM', ent: 'ENT' }

function genKey(tier) {
  const p = PREFIX[tier] || 'PRO'
  const rand = crypto.randomBytes(16).toString('hex').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const body = (rand + crypto.randomBytes(8).toString('hex').toUpperCase()).slice(0, 16)
  const chunks = body.match(/.{1,4}/g).join('-')
  return `${p}-${chunks}`
}

function loadLedger() {
  if (!fs.existsSync(LEDGER)) return { keys: [] }
  try { return JSON.parse(fs.readFileSync(LEDGER, 'utf8')) } catch { return { keys: [] } }
}

function saveLedger(l) { fs.writeFileSync(LEDGER, JSON.stringify(l, null, 2), 'utf8') }

function validateKey(key) {
  const m = String(key || '').match(/^(PRO|TEAM|ENT)-([A-Z0-9]{4}-){3}[A-Z0-9]{4}$/)
  return m ? { ok: true, tier: m[1] === 'PRO' ? 'pro' : m[1] === 'TEAM' ? 'team' : 'enterprise' } : { ok: false }
}

function main() {
  const args = process.argv.slice(2)
  const tierOf = (a) => { const i = a.indexOf('--tier'); return i >= 0 ? a[i + 1] : null }
  const valOf = (a, k) => { const i = a.indexOf(k); return i >= 0 && a[i + 1] ? a[i + 1] : null }

  // --list 台账
  if (args.includes('--list')) {
    const l = loadLedger()
    console.log(`密钥台账：${l.keys.length} 条`)
    for (const k of l.keys) console.log(`  ${k.key} | ${k.tier} | ${k.pack} | ${k.buyer || '-'} | ${k.status} | ${new Date(k.issued_at).toLocaleString()}`)
    return
  }

  // --validate 校验
  const vi = args.indexOf('--validate')
  if (vi >= 0 && args[vi + 1]) {
    const r = validateKey(args[vi + 1])
    console.log(r.ok ? `✓ 有效密钥（${r.tier} 版）` : '✗ 无效密钥格式（应 PRO-/TEAM-/ENT- + 16 位大写字母数字分 4 组）')
    return
  }

  // 签发
  const tier = tierOf(args)
  if (!tier || !PREFIX[tier]) { console.error('用法: node key-issue.mjs --tier pro|team|ent --pack <包id> --buyer <买主> [--note <备注>]'); process.exit(1) }
  const pack = valOf(args, '--pack') || 'pkg-dev'
  const buyer = valOf(args, '--buyer') || 'anonymous'
  const note = valOf(args, '--note') || ''

  const key = genKey(tier)
  const ledger = loadLedger()
  const rec = { key, tier, pack, buyer, note, issued_at: Date.now(), status: 'active', activated_at: null }
  ledger.keys.push(rec)
  saveLedger(ledger)

  console.log('=== 商业密钥已签发 ===')
  console.log(`密钥: ${key}`)
  console.log(`档位: ${tier}（${PREFIX[tier]}- 前缀）`)
  console.log(`包:   ${pack}`)
  console.log(`买主: ${buyer}${note ? '（' + note + '）' : ''}`)
  console.log(`\n交付给用户后，用户执行：`)
  console.log(`yihe_license op=activate pack_id=${pack} key=${key}`)
  console.log(`\n台账已记录 → ${LEDGER}`)
}

main()
