#!/usr/bin/env node
/**
 * Token 消耗审计器：量化「本地优先」策略能省多少 LLM token
 * ---------------------------------------------------------------
 * 用法：
 *   node token-save.mjs                        # 文本报告（stdout）
 *   node token-save.mjs --json                 # 结构化 JSON
 *   node token-save.mjs --out token.json       # 写入报告
 *   node token-save.mjs --state <path>         # 指定状态文件
 *   node token-save.mjs --assume-llm-tokens 1200  # 每次 reason 的 LLM token 估算（默认 1200）
 *
 * 模型：
 *   - reason 调用 = 完整 LLM 推演（计费、耗 token）
 *   - RFB lib.vm / yihe_rfb exec = 本地字节码执行（0 token）
 *   - script match = 本地匹配（0 token）
 *   - 决策缓存命中 = 免重复推演（0 token）
 *   节省 = (reason 次数 − 可本地化次数) × 每次 token；可本地化 = 存在 RFB 库或脚本命中
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const TOKENS_PER_REASON = 1200 // 默认估算：一次完整推演 ≈ 1200 token（可按 --assume-llm-tokens 覆盖）

function statePath() {
  const i = process.argv.indexOf('--state')
  return i >= 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'yihe-host.json')
}

function main() {
  const args = process.argv.slice(2)
  const tpr = (() => { const i = args.indexOf('--assume-llm-tokens'); return i >= 0 ? Number(args[i + 1]) || TOKENS_PER_REASON : TOKENS_PER_REASON })()
  const f = statePath()
  if (!fs.existsSync(f)) { console.error('状态文件不存在: ' + f); process.exit(1) }
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  const usage = j.usage || {}
  const libs = j.rfbLibrary || []
  const scripts = []
  for (const [k, ns] of Object.entries(j.namespaces || {})) for (const s of ns.scripts || []) scripts.push({ ns: k, scenario: s.scenario, usage: s.usage || 0 })
  const decisions = j.decisions || []
  const executions = j.executions || []

  // 各渠道计数
  let reasonTotal = 0, rfbTotal = 0, scriptTotal = 0, execTotal = 0
  for (const [k, v] of Object.entries(usage)) {
    reasonTotal += Number(v.reason) || 0
    rfbTotal += Number(v.rfb) || 0
    scriptTotal += Number(v.script) || 0
  }
  execTotal = executions.length
  const libUsage = libs.reduce((s, l) => s + (l.usage || 0), 0)
  const scriptUsage = scripts.reduce((s, x) => s + x.usage, 0)

  // 可本地化判定：每个命名空间有 RFB 库或脚本 → 该空间决策可先走本地
  const nsWithLib = new Set(libs.map(l => l.name.split('-').slice(0, -1).join('-')).filter(Boolean))
  const nsWithScript = new Set(scripts.filter(s => s.usage > 0).map(s => s.ns))
  const byNs = {}
  for (const d of decisions) { const k = (d.trace && d.trace.namespace) || '未知'; byNs[k] = (byNs[k] || 0) + 1 }
  let localizable = 0
  for (const [ns, cnt] of Object.entries(byNs)) {
    if (nsWithScript.has(ns)) localizable += cnt
  }
  const cacheHits = decisions.length - (decisions.filter(d => d.status === 'decided' && !d.reused).length) // 保守：无 reused 标记时按 0
  const saved = Math.max(0, localizable) * tpr
  const totalCost = reasonTotal * tpr
  const ratio = reasonTotal ? Math.min(1, localizable / reasonTotal) : 0

  const report = {
    generated_at: new Date().toISOString(),
    assume_tokens_per_reason: tpr,
    channels: { reason_total: reasonTotal, rfb_lib_exec: libUsage, rfb_tool_calls: rfbTotal, script_match: scriptUsage, exec_actions: execTotal, decisions: decisions.length },
    localizable: { decisions_in_script_ns: localizable, ns_with_script: nsWithScript.size, cache_hits_est: cacheHits },
    cost: { total_llm_tokens_est: totalCost, local_savings_est: saved, savings_ratio: Number(ratio.toFixed(3)) },
    top_script_hits: scripts.filter(s => s.usage > 0).sort((a, b) => b.usage - a.usage).slice(0, 10),
  }

  const outIdx = args.indexOf('--out')
  if (args.includes('--json') || outIdx >= 0) {
    if (outIdx >= 0 && args[outIdx + 1]) { fs.writeFileSync(path.resolve(args[outIdx + 1]), JSON.stringify(report, null, 2), 'utf8'); console.log(`[✓] Token 审计 → ${args[outIdx + 1]}`); return }
    console.log(JSON.stringify(report, null, 2))
    return
  }

  console.log('# Token 消耗审计（本地优先策略）')
  console.log(`\n## 渠道分布（估算：每次 reason ≈ ${tpr} token）`)
  console.log(`LLM reason 调用 ${reasonTotal} 次（估算 ${totalCost} token）`)
  console.log(`RFB 经验库执行 ${libUsage} 次（0 token，本地字节码）· RFB 工具调用 ${rfbTotal} 次`)
  console.log(`脚本预匹配命中 ${scriptUsage} 次（0 token）· 执行动作 ${execTotal} 条 · 决策 ${decisions.length} 条`)
  console.log(`\n## 可本地化分析`)
  console.log(`脚本覆盖的命名空间 ${nsWithScript.size} 个 · 其中决策 ${localizable} 条`)
  console.log(`→ 若这些决策改走「脚本预匹配 + RFB 本地执行」：节省 ≈ ${saved} token（${(ratio * 100).toFixed(1)}% 的 reason 可本地化）`)
  console.log(`\n## 高频脚本（沉淀价值高，预匹配命中率↑）`)
  for (const s of report.top_script_hits) console.log(`  [${s.ns}] ${s.scenario}（usage ${s.usage}）`)
  if (!report.top_script_hits.length) console.log('  （暂无脚本命中记录）')
  console.log(`\n## 优化建议`)
  console.log(`1. 决策缓存：相同 question 二次命中直接复用结论（当前估算可省 ${cacheHits} 次）`)
  console.log(`2. 本地优先顺序：缓存 → RFB lib.vm → 脚本 match → 兜底 reason`)
  console.log(`3. 高频脚本化：usage≥2 的场景固化为脚本模板，提升预匹配命中率`)
  console.log(`4. 冷库合并：usage=0 的经验库可合并降维（见 auto-expand / pack-merge）`)
}

main()
