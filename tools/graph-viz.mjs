#!/usr/bin/env node
/**
 * 关系网可视化器：pkg JSON → Mermaid / DOT / HTML 关系图
 * ---------------------------------------------------------------
 * 用法：
 *   node graph-viz.mjs <pkg.json>                  # 输出 Mermaid flowchart
 *   node graph-viz.mjs <pkg.json> --html out.html  # 输出交互式 HTML（mermaid.js CDN）
 *   node graph-viz.mjs <pkg.json> --dot out.dot    # 输出 Graphviz DOT
 *   node graph-viz.mjs <pkg.json> --fields         # 按 context_tag（#前缀）分泳道子图
 *   node graph-viz.mjs --all                       # 目录内所有 pkg-dev*.json 生成 Mermaid
 *   node graph-viz.mjs --stats <pkg.json>          # 只打印关系统计（边/类型/连通分量）
 *
 * 关系类型 → 边样式（Mermaid）：
 *   causal/CAUSE      实线箭头          cause
 *   condition/IF      实线"IF"标注
 *   support/SUPPORT   实线（绿）
 *   undermine/UNDERMINE 虚线（红）
 *   similar/LIKE      虚线（蓝）
 *   oppose/BUT        粗虚线（橙）
 *   entail/ENTAIL     双线
 *   belong/BELONG     点线（归属）
 *   temporal/TEMP     虚线（时序）
 */
import fs from 'node:fs'
import path from 'node:path'

const EDGE_STYLE = {
  causal:   { arrow: '-->',  label: '',        style: '' },
  condition: { arrow: '-->',  label: 'IF',      style: '' },
  progression: { arrow: '-->', label: 'THEN',   style: '' },
  support:  { arrow: '-->',  label: '支持',     style: 'stroke:#2e7d32' },
  undermine: { arrow: '-.->', label: '削弱',    style: 'stroke:#c62828' },
  similar:  { arrow: '-.->', label: '相似',     style: 'stroke:#1565c0' },
  oppose:   { arrow: '-.->', label: '对立',     style: 'stroke:#e65100' },
  entail:   { arrow: '==>',  label: '蕴含',     style: '' },
  belong:   { arrow: '-.->', label: '属于',     style: 'stroke:#6a1b9a' },
  temporal: { arrow: '-.->', label: '时序',     style: 'stroke:#00838f' },
}

function load(pkgPath) {
  return JSON.parse(fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, ''))
}

function nodeId(name) {
  // Mermaid 节点 id：去空格 + 转义特殊字符
  return '"' + name.replace(/["\\]/g, '') + '"'
}

function mermaid(pkg, byFields) {
  const out = []
  out.push('flowchart LR')
  const ids = new Set(pkg.imagos.map(i => i.content))
  // 泳道：context_tag 分组（imagos 可能带 context_tag 字段；否则按 relations 的 context_tag 统计）
  const groups = new Map() // tag -> [names]
  if (byFields) {
    const tagOf = new Map()
    for (const i of pkg.imagos) if (i.context_tag) tagOf.set(i.content, i.context_tag.replace(/^#/, ''))
    for (const r of pkg.relations) {
      const t = (r.context_tag || '').replace(/^#/, '') || tagOf.get(r.from) || tagOf.get(r.to) || '核心'
      for (const n of [r.from, r.to]) {
        if (!ids.has(n)) continue
        if (!groups.has(t)) groups.set(t, [])
        if (!groups.get(t).includes(n)) groups.get(t).push(n)
      }
    }
    for (const [t, names] of groups) {
      out.push(`  subgraph ${JSON.stringify(t)}`)
      for (const n of names) out.push(`    ${nodeId(n)}[${n}]`)
      out.push('  end')
    }
  } else {
    for (const n of ids) out.push(`  ${nodeId(n)}[${n}]`)
  }
  for (const r of pkg.relations) {
    const s = EDGE_STYLE[r.type] || EDGE_STYLE.causal
    const a = s.arrow, l = s.label
    const from = nodeId(r.from), to = nodeId(r.to)
    const w = typeof r.weight === 'number' ? `|${r.weight.toFixed(2)}|` : ''
    const label = l ? `|${l}|` : ''
    const edge = `${from} ${a}${w}${label} ${to}`
    out.push(`  ${edge}${s.style ? ':::' + r.type : ''}`)
  }
  // 边样式定义
  const used = new Set(pkg.relations.map(r => r.type))
  for (const t of used) {
    const s = EDGE_STYLE[t]
    if (s && s.style) out.push(`  classDef ${t} ${s.style}`)
  }
  return out.join('\n')
}

function dot(pkg) {
  const out = []
  out.push('digraph ' + (pkg.id || 'graph') + ' {')
  out.push('  rankdir=LR;')
  for (const i of pkg.imagos) out.push(`  "${i.content}" [shape=box];`)
  for (const r of pkg.relations) {
    const s = EDGE_STYLE[r.type] || EDGE_STYLE.causal
    out.push(`  "${r.from}" -> "${r.to}" [label="${r.type}${typeof r.weight === 'number' ? ' ' + r.weight : ''}"${s.arrow === '-.->' ? ' style=dashed' : ''}${s.arrow === '==>' ? ' style=bold' : ''}];`)
  }
  out.push('}')
  return out.join('\n')
}

function html(mermaidSrc) {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="utf-8">
<title>YiHe 关系网</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<style>body{font-family:system-ui;margin:24px;background:#0f1117;color:#e6e6e6}.wrap{background:#1a1d27;border-radius:12px;padding:16px}h1{font-size:18px}.legend{font-size:12px;color:#aaa;margin:8px 0 16px}</style>
</head>
<body>
<h1>YiHe 关系网可视化</h1>
<div class="legend">关系类型：实线=因果/条件 · 绿=支持 · 红虚线=削弱 · 蓝虚线=相似 · 橙=对立 · 双线=蕴含 · 点线=归属</div>
<div class="wrap"><pre class="mermaid">
${mermaidSrc}
</pre></div>
<script>mermaid.initialize({ startOnLoad: true, theme: 'dark', flowchart: { curve: 'basis' } });</script>
</body>
</html>`
}

function stats(pkg) {
  const byType = {}
  for (const r of pkg.relations) byType[r.type] = (byType[r.type] || 0) + 1
  // 连通分量（并查集）
  const parent = new Map()
  const find = x => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x) } return x }
  const union = (a, b) => { const ra = find(a), rb = find(b); if (ra !== rb) parent.set(ra, rb) }
  for (const i of pkg.imagos) parent.set(i.content, i.content)
  for (const r of pkg.relations) if (parent.has(r.from) && parent.has(r.to)) union(r.from, r.to)
  const comps = new Set([...parent.keys()].map(find))
  const isolated = [...parent.keys()].filter(n => find(n) === n && !pkg.relations.some(r => r.from === n || r.to === n)).length
  const tags = {}
  for (const r of pkg.relations) { const t = (r.context_tag || '核心').replace(/^#/, ''); tags[t] = (tags[t] || 0) + 1 }
  return {
    id: pkg.id, imagos: pkg.imagos.length, relations: pkg.relations.length, scripts: pkg.scripts.length,
    by_type: byType, components: comps.size, isolated,
    top_tags: Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k}:${v}`),
  }
}

function main() {
  const args = process.argv.slice(2)
  if (!args.length) { console.error('用法: node graph-viz.mjs <pkg.json> [--html out.html] [--dot out.dot] [--fields] [--stats] [--all]'); process.exit(1) }
  const dir = path.dirname(process.argv[1])
  if (args[0] === '--all') {
    const files = fs.readdirSync(dir).filter(f => f.startsWith('pkg-dev') && f.endsWith('.json') && !f.endsWith('compact.json'))
    for (const f of files) {
      const pkg = load(path.join(dir, f))
      fs.writeFileSync(path.join(dir, f.replace('.json', '.mmd')), mermaid(pkg, false), 'utf8')
      console.log(`[✓] ${f.replace('.json', '.mmd')}（${pkg.relations.length} 边）`)
    }
    return
  }
  const pkgPath = path.resolve(args[0])
  const pkg = load(pkgPath)
  const flags = new Set(args.slice(1))
  if (flags.has('--stats')) { console.log(JSON.stringify(stats(pkg), null, 2)); return }
  const m = mermaid(pkg, flags.has('--fields'))
  const htmlIdx = args.indexOf('--html')
  const dotIdx = args.indexOf('--dot')
  if (htmlIdx >= 0 && args[htmlIdx + 1]) {
    fs.writeFileSync(path.resolve(args[htmlIdx + 1]), html(m), 'utf8')
    console.log(`[✓] HTML 已生成：${args[htmlIdx + 1]}`)
    return
  }
  if (dotIdx >= 0 && args[dotIdx + 1]) {
    fs.writeFileSync(path.resolve(args[dotIdx + 1]), dot(pkg), 'utf8')
    console.log(`[✓] DOT 已生成：${args[dotIdx + 1]}`)
    return
  }
  console.log(m)
}

main()
