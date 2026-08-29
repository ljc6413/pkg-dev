#!/usr/bin/env node
/**
 * 自主扩展器：分析 pkg JSON → 检测知识缺口 → 生成补丁提案
 * ---------------------------------------------------------------
 * 用法：
 *   node auto-expand.mjs                    # 分析目录内全部 pkg-dev*.json，输出缺口报告（stdout）
 *   node auto-expand.mjs --json             # 输出结构化缺口/提案 JSON
 *   node auto-expand.mjs --out gaps.json    # 写入缺口报告 JSON
 *   node auto-expand.mjs --patch patch.json # 输出可导入的补丁包（含建议关系/意象）
 *   node auto-expand.mjs --min-degree 2     # 低连接阈值（默认 1：连接数 ≤1 视为低连接）
 *
 * 缺口检测规则：
 *   1) 孤立意象：无任何关系（in+out 度 = 0）——知识悬空，无法被推演触达
 *   2) 低连接节点：总度 ≤ min-degree——扩展空间最大
 *   3) 语义邻近：对低连接节点，检索同包中与其共享 tag/category 的意象，
 *      生成 similar/support 候选关系（补丁提案）
 *   4) 缺口指数 = 孤立数×2 + 低连接数 + 连通分量数（越小越健康）
 */
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.dirname(process.argv[1])

function loadAll() {
  return fs.readdirSync(DIR).filter(f => f.startsWith('pkg-dev') && f.endsWith('.json') && !f.endsWith('compact.json') && !f.includes('-merged'))
    .map(f => ({ file: f, pkg: JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8').replace(/^\uFEFF/, '')) }))
}

function analyze(pkg, minDegree) {
  const ids = new Set(pkg.imagos.map(i => i.content))
  const deg = {}
  for (const i of pkg.imagos) deg[i.content] = 0
  for (const r of pkg.relations) {
    if (deg[r.from] != null) deg[r.from]++
    if (deg[r.to] != null) deg[r.to]++
  }
  const isolated = Object.keys(deg).filter(n => deg[n] === 0)
  const lowConn = Object.keys(deg).filter(n => deg[n] > 0 && deg[n] <= minDegree).sort((a, b) => deg[a] - deg[b])
  // 连通分量（并查集）
  const parent = {}
  for (const n of ids) parent[n] = n
  const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x] } return x }
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent[ra] = rb }
  for (const r of pkg.relations) if (parent[r.from] && parent[r.to]) union(r.from, r.to)
  const comps = new Set([...ids].map(find))
  // 语义邻近 → 补丁候选关系（tag/category 共享）
  const tagOf = {}, catOf = {}
  for (const i of pkg.imagos) { tagOf[i.content] = i.tags || []; catOf[i.content] = i.category || '' }
  const existing = new Set(pkg.relations.map(r => `${r.from}|${r.to}|${r.type}`))
  const patches = []
  for (const n of [...isolated, ...lowConn]) {
    const myTags = new Set(tagOf[n] || [])
    const myCat = catOf[n]
    const cands = pkg.imagos
      .filter(i => i.content !== n)
      .filter(i => (myTags.size && (i.tags || []).some(t => myTags.has(t))) || (myCat && i.category === myCat))
      .filter(i => !existing.has(`${n}|${i.content}|similar`) && !existing.has(`${i.content}|${n}|similar`) && !existing.has(`${n}|${i.content}|support`) && !existing.has(`${i.content}|${n}|support`))
      .map(i => ({ to: i.content, score: tagOverlap(myTags, i.tags || []) + (catOf[i.content] === myCat ? 1 : 0) }))
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
    for (const c of cands) {
      patches.push({ from: n, to: c.to, type: c.score >= 2 ? 'similar' : 'support', weight: 0.5 + Math.min(0.3, c.score * 0.1), reason: `共享标签/类别（score=${c.score}）` })
    }
  }
  const index = isolated.length * 2 + lowConn.length + comps.size
  return { id: pkg.id, imagos: pkg.imagos.length, relations: pkg.relations.length, isolated, lowConn, lowDegree: lowConn.map(n => ({ n, d: deg[n] })), components: comps.size, gapIndex: index, patches }
}

function main() {
  const args = process.argv.slice(2)
  const minDegree = (() => { const i = args.indexOf('--min-degree'); return i >= 0 ? Number(args[i + 1]) || 1 : 1 })()
  const outIdx = args.indexOf('--out'), patchIdx = args.indexOf('--patch')
  const all = loadAll()
  const reports = all.map(a => analyze(a.pkg, minDegree)).sort((a, b) => b.gapIndex - a.gapIndex)
  const totalGap = reports.reduce((s, r) => s + r.gapIndex, 0)
  const totalPatches = reports.reduce((s, r) => s + r.patches.length, 0)

  if (args.includes('--json') || outIdx >= 0) {
    const out = { generated_at: new Date().toISOString(), min_degree: minDegree, total_gap_index: totalGap, total_patch_candidates: totalPatches, packs: reports }
    if (outIdx >= 0 && args[outIdx + 1]) { fs.writeFileSync(path.resolve(args[outIdx + 1]), JSON.stringify(out, null, 2), 'utf8'); console.log(`[✓] 缺口报告 → ${args[outIdx + 1]}（${reports.length} 包，缺口指数 ${totalGap}，候选补丁 ${totalPatches}）`); return }
    console.log(JSON.stringify(out, null, 2))
    return
  }

  if (patchIdx >= 0 && args[patchIdx + 1]) {
    // 生成可导入的补丁包：全部候选关系 + 确认的孤立意象（标注建议补关系）
    const pkgs = reports.filter(r => r.patches.length)
    const patch = {
      id: 'pkg-dev-auto-patch',
      name: '自主扩展补丁包',
      industry: '软件开发',
      version: '0.1.0',
      namespace: 'EVOLVE开发',
      owner: 'yidev',
      tier: 'pro',
      license_required: true,
      imagos: [],
      relations: [],
      scripts: [],
    }
    for (const r of pkgs) for (const p of r.patches) patch.relations.push({ from: p.from, to: p.to, type: p.type, weight: p.weight, directed: true, context_tag: '#自动补丁' })
    fs.writeFileSync(path.resolve(args[patchIdx + 1]), JSON.stringify(patch, null, 2), 'utf8')
    console.log(`[✓] 补丁包 → ${args[patchIdx + 1]}（${patch.relations.length} 条候选关系）`)
    return
  }

  // 文本报告
  for (const r of reports) {
    const flag = r.isolated.length || r.lowConn.length ? '⚠' : '✓'
    console.log(`[${flag}] ${r.id}（缺口指数 ${r.gapIndex}）孤立 ${r.isolated.length} / 低连接 ${r.lowConn.length} / 分量 ${r.components} / 候选补丁 ${r.patches.length}`)
    if (r.isolated.length) console.log(`    孤立: ${r.isolated.slice(0, 8).join('、')}${r.isolated.length > 8 ? '…' : ''}`)
    if (r.lowConn.length) console.log(`    低连接: ${r.lowConn.slice(0, 8).map(n => n + '(' + (r.lowDegree.find(x => x.n === n) || {}).d + ')').join('、')}${r.lowConn.length > 8 ? '…' : ''}`)
  }
  console.log(`\n汇总：${reports.length} 包 / 缺口指数 ${totalGap} / 候选补丁 ${totalPatches} 条`)
  console.log('补丁示例（auto-expand.mjs --patch patch.json 导出可导入包）：')
  const first = reports.find(r => r.patches.length)
  if (first) for (const p of first.patches.slice(0, 3)) console.log(`    ${first.id}: ${p.from} -${p.type}-> ${p.to}（${p.reason}）`)
}

function tagOverlap(a, b) {
  const sa = new Set(a)
  return b.filter(t => sa.has(t)).length
}

main()
