#!/usr/bin/env node
/**
 * 埋点导出器：导出匿名使用统计 → 可回传 JSON（驱动跨实例进化）
 * ---------------------------------------------------------------
 * 用法：
 *   node telemetry-export.mjs                    # 导出到 ./telemetry-<instance>.json
 *   node telemetry-export.mjs --out path.json    # 指定输出
 *   node telemetry-export.mjs --state <path>     # 指定 yihe-host.json
 *   node telemetry-export.mjs --json             # stdout 输出
 *
 * 隐私原则：
 *   - 只导出**匿名聚合统计**（计数/命中率/拦截数/领域热度）
 *   - **不含**问题原文、决策内容、脚本模板、意象文本
 *   - 含实例匿名 id（hash8 盐化），用于去重合并
 *
 * 数据内容：
 *   instance（匿名）/ version / counts（reason/rfb/script/exec）
 *   decisions（总数/decided/平均置信/script_hit 数）
 *   domains（命名空间决策热度 TOP）
 *   script_pool（规模/命中数/命中率）
 *   security（攻击记录/拦截审计数/资产拦截数）
 *   savings（脚本短路节省 token 估算）
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'

const VERSION = '1.0.0'

function statePath() {
  const i = process.argv.indexOf('--state')
  return i >= 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'yihe-host.json')
}

function hash8(t) { let h = 0; const s = String(t || ''); for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return (h % 251).toString(16).padStart(2, '0') }

function main() {
  const args = process.argv.slice(2)
  const f = statePath()
  if (!fs.existsSync(f)) { console.error('状态文件不存在: ' + f); process.exit(1) }
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  const usage = j.usage || {}
  const decisions = j.decisions || []
  const libs = j.rfbLibrary || []
  const audit = j.audit || []
  const attacks = j.secAttacks || []

  // 匿名实例 id：从 stateFile 路径 + 系统信息盐化
  const salt = process.env.DSH_SESSION_ID || os.hostname() || 'host'
  const instance = 'inst-' + hash8(f + salt) + hash8(String(Date.now() % 100000))

  // 计量
  let reason = 0, rfb = 0, script = 0
  for (const e of Object.values(usage)) { reason += e.reason || 0; rfb += e.rfb || 0; script += e.script || 0 }

  // 决策
  const decided = decisions.filter(d => d.status === 'decided')
  const scriptHit = decisions.filter(d => d.meta && d.meta.gateway === 'script_hit')
  const avgConf = decided.length ? (decided.reduce((s, d) => s + (d.confidence || 0), 0) / decided.length) : 0

  // 领域热度（命名空间决策数 TOP）
  const byNs = {}
  for (const d of decisions) { const k = (d.trace && d.trace.namespace) || 'unknown'; byNs[k] = (byNs[k] || 0) + 1 }
  const domains = Object.entries(byNs).map(([ns, c]) => ({ ns, count: c })).sort((a, b) => b.count - a.count).slice(0, 10)

  // 脚本池
  let scriptPool = 0, scriptUsed = 0
  for (const ns of Object.values(j.namespaces || {})) { scriptPool += (ns.scripts || []).length; for (const s of ns.scripts || []) if (s.usage) scriptUsed++ }

  // 安全
  const secAudit = audit.filter(a => String(a.op || '').includes('sec'))
  const assetBlocks = secAudit.filter(a => a.op === 'sec.asset_block' || a.op === 'sec.agent_block' || a.op === 'sec.agent_guard')

  // 省钱
  const savingsToken = scriptHit.length * 1200

  const tel = {
    schema: 'yihe-telemetry-v1',
    instance,
    version: VERSION,
    generated_at: Date.now(),
    counts: { reason, rfb, script, executions: (j.executions || []).length },
    decisions: { total: decisions.length, decided: decided.length, avg_confidence: Number(avgConf.toFixed(3)), script_hit: scriptHit.length, need_more: decisions.length - decided.length },
    domains,
    script_pool: { total: scriptPool, hit: scriptUsed, hit_rate: scriptPool ? Number((scriptUsed / scriptPool).toFixed(3)) : 0 },
    security: { attack_fingerprints: attacks.length, sec_audit_events: secAudit.length, asset_blocks: assetBlocks.length },
    savings: { script_hit_token_est: savingsToken, reason_calls: reason },
    env: { node: process.version, platform: process.platform },
  }

  const outIdx = args.indexOf('--out')
  if (args.includes('--json')) { console.log(JSON.stringify(tel, null, 2)); return }
  const outFile = outIdx >= 0 && args[outIdx + 1] ? path.resolve(args[outIdx + 1]) : path.join(process.cwd(), `telemetry-${instance}.json`)
  fs.writeFileSync(outFile, JSON.stringify(tel, null, 2), 'utf8')
  console.log(`[✓] 埋点已导出 → ${outFile}`)
  console.log(`    实例 ${instance} · reason ${reason} · script_hit ${scriptHit.length}（省 ${savingsToken} token）· 安全拦截 ${assetBlocks.length} 次`)
  console.log(`    隐私：仅匿名聚合统计，不含问题/决策/脚本内容`)
}

main()
