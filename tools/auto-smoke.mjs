#!/usr/bin/env node
/**
 * 自动冒烟执行器：读取全部 pkg-dev*.json → 生成冒烟用例清单 → 输出报告
 * ---------------------------------------------------------------
 * 用法：
 *   node auto-smoke.mjs --gen                  # 从包内脚本场景自动生成用例清单 JSON（stdout）
 *   node auto-smoke.mjs --gen --out cases.json # 写入文件
 *   node auto-smoke.mjs --selfcheck            # 静态校验全部包 + 生成用例后自检通过
 *   node auto-smoke.mjs --merge-results in.json out.md  # 把宿主实测结果汇总成 markdown 报告
 *
 * 设计要点：
 *   - 用例自动派生：每包取 imagos 中带 relation 的核心节点 + scripts 场景，
 *     生成「场景 → 期望意象」测试问题（与 smoke-test.mjs 的手工清单互补）
 *   - 宿主（agent）逐个执行 yihe_reason 后，把 {case_id, verdict, confidence}
 *     追加到结果 JSON，再 --merge-results 生成报告
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.dirname(process.argv[1])

function loadAll() {
  const files = fs.readdirSync(DIR).filter(f => f.startsWith('pkg-dev') && f.endsWith('.json') && !f.endsWith('compact.json'))
  return files.map(f => ({ file: f, pkg: JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8').replace(/^\uFEFF/, '')) }))
}

// 从 relations 统计节点入度/出度，选"枢纽意象"作为探测点
function hubImagos(pkg, top = 5) {
  const deg = {}
  for (const r of pkg.relations) {
    deg[r.from] = (deg[r.from] || 0) + 1
    deg[r.to] = (deg[r.to] || 0) + 1
  }
  return Object.entries(deg).sort((a, b) => b[1] - a[1]).slice(0, top).map(([n]) => n)
}

function genCases() {
  const all = loadAll()
  const cases = []
  for (const { file, pkg } of all) {
    const ns = pkg.namespace || file.replace('.json', '')
    const hubs = hubImagos(pkg)
    const scenes = (pkg.scripts || []).map(s => s.scenario).filter(Boolean).slice(0, 4)
    // 场景探测：问「<场景>怎么做/怎么选」
    for (const sc of scenes) {
      const expect = (pkg.scripts || []).find(s => s.scenario === sc)?.tags || hubs.slice(0, 3)
      cases.push({
        case_id: `${pkg.id}:${sc}`,
        pack: pkg.id, ns, question: `${sc}怎么做`,
        expect: expect.length ? expect : hubs.slice(0, 3),
        kind: 'script',
      })
    }
    // 枢纽意象探测：问「<意象> 是什么 / 关键点」
    for (const h of hubs.slice(0, 3)) {
      cases.push({
        case_id: `${pkg.id}:hub:${h}`,
        pack: pkg.id, ns, question: `${h}的关键是什么`,
        expect: pkg.relations.filter(r => r.from === h).map(r => r.to).slice(0, 3),
        kind: 'hub',
      })
    }
  }
  return cases
}

function selfcheck() {
  let fail = 0
  const all = loadAll()
  if (!all.length) { console.error('未找到 pkg-dev*.json'); process.exit(1) }
  for (const { file, pkg } of all) {
    const ids = new Set(pkg.imagos.map(i => i.content))
    let bad = 0
    for (const r of pkg.relations) if (!ids.has(r.from) || !ids.has(r.to)) { console.error(`[✗] ${file}: 悬挂关系 ${r.from}->${r.to}`); bad++ }
    const dup = pkg.imagos.map(i => i.content).filter((c, i, a) => a.indexOf(c) !== i)
    if (dup.length) { console.error(`[✗] ${file}: 重复意象 ${dup.join(',')}`); bad++ }
    const dupSc = (pkg.scripts || []).map(s => s.scenario).filter((s, i, a) => s && a.indexOf(s) !== i)
    if (dupSc.length) { console.error(`[✗] ${file}: 重复场景 ${dupSc.join(',')}`); bad++ }
    if (!bad) console.log(`[✓] ${file}（${pkg.imagos.length} 意象 / ${pkg.relations.length} 关系 / ${pkg.scripts.length} 脚本）`)
    else fail++
  }
  const cases = genCases()
  console.log(fail ? `\n自检失败：${fail}/${all.length}` : `\n自检全部通过 ✓（${all.length} 包，自动派生 ${cases.length} 条用例）`)
  process.exit(fail ? 1 : 0)
}

function mergeResults(inFile, outFile) {
  const data = JSON.parse(fs.readFileSync(inFile, 'utf8'))
  const cases = data.cases || [], results = data.results || {}
  let pass = 0, pending = 0, failCase = 0
  const rows = []
  for (const c of cases) {
    const r = results[c.case_id]
    let status = '⏳ 未执行'
    if (r) {
      const ok = r.verdict === 'decided' && (r.confidence || 0) >= 0.6
      status = ok ? '✅ 通过' : '❌ 未达标'
      if (ok) pass++; else failCase++
      rows.push(`| ${c.case_id} | ${c.question} | ${r.verdict} | ${r.confidence != null ? r.confidence.toFixed(3) : '-'} | ${status} |`)
    } else { pending++ }
  }
  const md = `# 自动冒烟报告
- 包数：${new Set(cases.map(c => c.pack)).size}
- 用例：${cases.length}（通过 ${pass} / 未达标 ${failCase} / 未执行 ${pending}）
- 通过率：${cases.length ? ((pass / cases.length) * 100).toFixed(1) : 0}%

| 用例 | 问题 | 裁决 | 置信度 | 状态 |
|---|---|---|---|---|
${rows.join('\n')}
`
  if (outFile) { fs.writeFileSync(outFile, md, 'utf8'); console.log(`[✓] 报告已生成：${outFile}（通过 ${pass}/${cases.length}）`) }
  else console.log(md)
}

function main() {
  const args = process.argv.slice(2)
  if (args[0] === '--gen') {
    const cases = genCases()
    const out = { generated_at: new Date().toISOString(), cases }
    const oi = args.indexOf('--out')
    if (oi >= 0 && args[oi + 1]) { fs.writeFileSync(args[oi + 1], JSON.stringify(out, null, 2), 'utf8'); console.log(`[✓] ${cases.length} 条用例 → ${args[oi + 1]}`) }
    else console.log(JSON.stringify(out, null, 2))
    return
  }
  if (args[0] === '--selfcheck') { selfcheck(); return }
  if (args[0] === '--merge-results') {
    if (!args[1]) { console.error('--merge-results 需要结果 JSON'); process.exit(1) }
    mergeResults(args[1], args[2])
    return
  }
  console.error('用法: node auto-smoke.mjs --gen [--out cases.json] | --selfcheck | --merge-results in.json [out.md]')
  process.exit(1)
}

main()
