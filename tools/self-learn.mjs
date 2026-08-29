#!/usr/bin/env node
/**
 * 自主学习分析器：读取 yihe-host.json → 学习洞察 + 经验沉淀建议
 * ---------------------------------------------------------------
 * 用法：
 *   node self-learn.mjs                       # 文本报告（stdout）
 *   node self-learn.mjs --json                # 结构化洞察 JSON
 *   node self-learn.mjs --out learn.json      # 写入报告 JSON
 *   node self-learn.mjs --state <path>        # 指定状态文件（默认 ~/.dsh/yihe-host.json）
 *   node self-learn.mjs --min-conf 0.7        # 沉淀建议的置信度阈值（默认 0.7）
 *
 * 洞察维度：
 *   1) 决策统计：总数 / 命名空间分布 / 置信度分布 / decided vs cooling
 *   2) 反馈闭环：adopted/rejected/neutral 计数 → 学习方向（强化 vs 纠偏）
 *   3) 奖惩队列：pendingAdjustments → 待应用权重变化
 *   4) 沉淀建议：高置信 + 已采纳 的决策路径 → 建议脚本化（含期望意象）
 *   5) 经验库热度：rfbLibrary usage → 高频库（值得继续维护）vs 冷库（可考虑合并）
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

function statePath() {
  const i = process.argv.indexOf('--state')
  return i >= 0 && process.argv[i + 1] ? path.resolve(process.argv[i + 1]) : path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'yihe-host.json')
}

function main() {
  const args = process.argv.slice(2)
  const minConf = (() => { const i = args.indexOf('--min-conf'); return i >= 0 ? Number(args[i + 1]) || 0.7 : 0.7 })()
  const f = statePath()
  if (!fs.existsSync(f)) { console.error('状态文件不存在: ' + f); process.exit(1) }
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  const decisions = j.decisions || []
  const feedbacks = j.feedbackLog || j.feedback || []
  const pending = j.pendingAdjustments || []
  const libs = j.rfbLibrary || []
  const usage = j.usage || {}
  const packs = j.packs || {}

  // ---- 1) 决策统计 ----
  const byNs = {}
  for (const d of decisions) { const k = (d.trace && d.trace.namespace) || '未知'; byNs[k] = (byNs[k] || 0) + 1 }
  const decided = decisions.filter(d => d.status === 'decided')
  const confs = decided.map(d => d.confidence || 0)
  const avgConf = confs.length ? confs.reduce((s, x) => s + x, 0) / confs.length : 0
  const highConf = decided.filter(d => (d.confidence || 0) >= minConf)

  // ---- 2) 反馈闭环 ----
  const fb = { adopted: 0, rejected: 0, neutral: 0 }
  for (const x of feedbacks) { const o = x.outcome || x.feedback || ''; if (fb[o] != null) fb[o]++ }
  // pendingAdjustments 结构可能多样，兼容取 delta 汇总
  const pendDeltas = pending.map(p => Number(p.delta) || 0)
  const pendSum = pendDeltas.reduce((s, x) => s + x, 0)

  // ---- 3) 沉淀建议：高置信决策 → 建议脚本 ----
  const suggestions = highConf.slice(-20).map(d => ({
    decision_id: d.id, verdict: d.verdict, confidence: d.confidence,
    namespace: (d.trace && d.trace.namespace) || '',
    rationale: (d.rationale && d.rationale[0]) ? String(d.rationale[0]).slice(0, 60) : '',
    suggest_script: true, expect: d.verdict ? [d.verdict.replace(/采用「(.+?)」/, '$1')] : [],
  }))

  // ---- 4) 经验库热度 ----
  const libHeat = libs.map(l => ({ name: l.name, usage: l.usage || 0, instr: l.binary ? l.binary.length / 32 : 0 })).sort((a, b) => b.usage - a.usage)
  const hot = libHeat.filter(l => l.usage >= 2)
  const cold = libHeat.filter(l => l.usage === 0)

  // ---- 5) 包使用热度 ----
  const packUsage = Object.entries(packs).map(([id, m]) => ({ id, name: m.name, ns: m.namespace, status: m.status }))

  const report = {
    generated_at: new Date().toISOString(),
    state_file: f,
    decisions: { total: decisions.length, decided: decided.length, by_ns: byNs, avg_confidence: Number(avgConf.toFixed(3)), high_conf_ge: minConf, high_conf_count: highConf.length },
    feedback: { ...fb, pending_adjustments: pending.length, pending_delta_sum: Number(pendSum.toFixed(3)) },
    learn_direction: fb.adopted > fb.rejected ? '正向强化为主（采纳路径应脚本化沉淀）' : (fb.rejected > fb.adopted ? '纠偏为主（拒绝路径应记反例）' : '反馈不足（建议增加反馈采集）'),
    suggestions: suggestions,
    lib_heat: { hot_count: hot.length, cold_count: cold.length, hot: hot.slice(0, 10), cold: cold.slice(0, 8) },
    packs: packUsage,
  }

  const outIdx = args.indexOf('--out')
  if (args.includes('--json') || outIdx >= 0) {
    if (outIdx >= 0 && args[outIdx + 1]) { fs.writeFileSync(path.resolve(args[outIdx + 1]), JSON.stringify(report, null, 2), 'utf8'); console.log(`[✓] 学习报告 → ${args[outIdx + 1]}`); return }
    console.log(JSON.stringify(report, null, 2))
    return
  }

  // 文本报告
  console.log('# 自主学习洞察报告')
  console.log(`\n## 决策统计`)
  console.log(`总决策 ${decisions.length}（decided ${decided.length}）· 平均置信 ${avgConf.toFixed(3)} · 高置信(≥${minConf}) ${highConf.length}`)
  console.log(`按命名空间: ${Object.entries(byNs).map(([k, v]) => `${k}=${v}`).join('、')}`)
  console.log(`\n## 反馈闭环`)
  console.log(`采纳 ${fb.adopted} / 拒绝 ${fb.rejected} / 中立 ${fb.neutral} · 奖惩队列 ${pending.length} 条（Δ 合计 ${pendSum.toFixed(3)}）`)
  console.log(`学习方向: ${report.learn_direction}`)
  console.log(`\n## 经验沉淀建议（高置信决策 → 脚本化）`)
  for (const s of suggestions.slice(0, 8)) console.log(`  [${s.namespace}] ${s.verdict}（${s.confidence}）→ 建议脚本化，期望意象 [${s.expect.join('/')}]`)
  if (!suggestions.length) console.log('  （暂无高置信决策样本）')
  console.log(`\n## 经验库热度`)
  console.log(`热库(usage≥2) ${hot.length} 个 / 冷库(usage=0) ${cold.length} 个`)
  for (const h of hot.slice(0, 8)) console.log(`  🔥 ${h.name}（usage ${h.usage}，${h.instr} 指令）`)
  console.log(`\n## 包清单（${packUsage.length}）`)
  console.log(packUsage.map(p => `  ${p.status === 'active' ? '★' : ' '} ${p.id} [${p.ns}]`).join('\n'))
}

main()
