#!/usr/bin/env node
/**
 * 进化共享器：对比基线 → 导出进化增量包（delta）→ 跨实例合并
 * ---------------------------------------------------------------
 * 用法：
 *   node evolve-share.mjs --base baseline.json --state <yihe-host.json> --out delta.json
 *   node evolve-share.mjs --diff pkg-a.json pkg-b.json --out delta.json
 *   node evolve-share.mjs --merge base.json delta.json --out merged.json
 *
 * 增量语义（delta 包 = 可导入的 pkg JSON）：
 *   - 意象：基线没有的新意象（content 维度）
 *   - 关系：基线没有的 (from,to,type) 组合
 *   - 脚本：基线没有的 scenario
 *   - meta：记录 base_version / diff_from / generated_at / change 摘要
 *   - 冲突处理（--merge）：意象按 content 并集；关系/脚本冲突取 delta（新）并标注
 *
 * 典型链路：本实例进化后 → --base 旧版包 --state 运行态 → delta 包 → 另一实例 --merge 导入。
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const DIR = path.dirname(process.argv[1])

function load(f) { return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '')) }

function diffPacks(base, cur) {
  const baseImgs = new Set((base.imagos || []).map(i => i.content))
  const curImgs = new Set((cur.imagos || []).map(i => i.content))
  const baseRels = new Set((base.relations || []).map(r => `${r.from}|${r.to}|${r.type}`))
  const curRels = new Set((cur.relations || []).map(r => `${r.from}|${r.to}|${r.type}`))
  const baseScs = new Set((base.scripts || []).map(s => s.scenario))
  const curScs = new Set((cur.scripts || []).map(s => s.scenario))

  const newImagos = (cur.imagos || []).filter(i => !baseImgs.has(i.content))
  const newRelations = (cur.relations || []).filter(r => !baseRels.has(`${r.from}|${r.to}|${r.type}`))
  const newScripts = (cur.scripts || []).filter(s => !baseScs.has(s.scenario))
  const removedImagos = (base.imagos || []).filter(i => !curImgs.has(i.content)).map(i => i.content)
  const removedScripts = (base.scripts || []).filter(s => !curScs.has(s.scenario)).map(s => s.scenario)

  const delta = {
    id: cur.id + '-delta',
    name: (cur.name || cur.id) + ' 进化增量',
    industry: cur.industry || '',
    version: bumpVersion(cur.version),
    base_version: base.version || '',
    diff_from: base.id || '',
    namespace: cur.namespace || base.namespace || '通用',
    owner: cur.owner || 'yidev',
    tier: cur.tier || 'pro',
    license_required: !!cur.license_required,
    delta: {
      added_imagos: newImagos.length,
      added_relations: newRelations.length,
      added_scripts: newScripts.length,
      removed_imagos: removedImagos,
      removed_scripts: removedScripts,
    },
    imagos: newImagos,
    relations: newRelations,
    scripts: newScripts,
  }
  return delta
}

function bumpVersion(v) {
  const m = String(v || '1.0.0').match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!m) return '1.1.0'
  return `${m[1]}.${m[2]}.${Number(m[3]) + 1}`
}

function mergePacks(base, delta) {
  const imgs = new Map((base.imagos || []).map(i => [i.content, i]))
  for (const i of delta.imagos || []) if (!imgs.has(i.content)) imgs.set(i.content, i)
  const rels = new Map((base.relations || []).map(r => [`${r.from}|${r.to}|${r.type}`, r]))
  let conflicts = 0
  for (const r of delta.relations || []) { const k = `${r.from}|${r.to}|${r.type}`; if (rels.has(k)) conflicts++; rels.set(k, r) }
  const scs = new Map((base.scripts || []).map(s => [s.scenario, s]))
  for (const s of delta.scripts || []) scs.set(s.scenario, s)
  return {
    id: base.id, name: base.name, industry: base.industry, version: delta.version || base.version,
    namespace: base.namespace, owner: base.owner, tier: base.tier, license_required: base.license_required,
    imagos: [...imgs.values()], relations: [...rels.values()], scripts: [...scs.values()],
    merged_from: delta.diff_from, merged_delta: delta.id, merge_conflicts: conflicts,
  }
}

function main() {
  const args = process.argv.slice(2)
  const outIdx = args.indexOf('--out')
  const out = outIdx >= 0 && args[outIdx + 1] ? path.resolve(args[outIdx + 1]) : null

  // ---- --diff：两个包文件对比 ----
  const diffIdx = args.indexOf('--diff')
  if (diffIdx >= 0 && args[diffIdx + 1] && args[diffIdx + 2]) {
    const a = load(path.resolve(args[diffIdx + 1])), b = load(path.resolve(args[diffIdx + 2]))
    const delta = diffPacks(a, b)
    if (out) { fs.writeFileSync(out, JSON.stringify(delta, null, 2), 'utf8'); console.log(`[✓] delta 包 → ${out}`) } else console.log(JSON.stringify(delta, null, 2))
    console.log(`增量：+${delta.imagos.length} 意象 / +${delta.relations.length} 关系 / +${delta.scripts.length} 脚本；移除 ${delta.delta.removed_imagos.length} 意象 / ${delta.delta.removed_scripts.length} 脚本`)
    return
  }

  // ---- --merge：合并 ----
  const mergeIdx = args.indexOf('--merge')
  if (mergeIdx >= 0 && args[mergeIdx + 1] && args[mergeIdx + 2]) {
    const base = load(path.resolve(args[mergeIdx + 1])), delta = load(path.resolve(args[mergeIdx + 2]))
    const merged = mergePacks(base, delta)
    if (out) { fs.writeFileSync(out, JSON.stringify(merged, null, 2), 'utf8'); console.log(`[✓] 合并 → ${out}（${merged.imagos.length} 意象 / ${merged.relations.length} 关系 / ${merged.scripts.length} 脚本，冲突 ${merged.merge_conflicts} 处）`) }
    else console.log(JSON.stringify(merged, null, 2))
    return
  }

  // ---- --base + --state：运行态 vs 基线 ----
  const baseIdx = args.indexOf('--base'), stateIdx = args.indexOf('--state')
  if (baseIdx >= 0 && args[baseIdx + 1]) {
    const baseFile = path.resolve(args[baseIdx + 1])
    const base = load(baseFile)
    // 运行态：从 state 按命名空间重建当前包视图
    const stateFile = stateIdx >= 0 && args[stateIdx + 1] ? path.resolve(args[stateIdx + 1]) : path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'yihe-host.json')
    const j = JSON.parse(fs.readFileSync(stateFile, 'utf8'))
    const nsName = base.namespace
    const ns = (j.namespaces || {})[nsName]
    if (!ns) { console.error(`状态文件中无命名空间 ${nsName}`); process.exit(1) }
    const cur = {
      id: base.id, name: base.name, industry: base.industry, version: bumpVersion(base.version), namespace: nsName,
      owner: base.owner, tier: base.tier, license_required: base.license_required,
      imagos: (ns.imagos || []).map(i => ({ content: i.content, kind: i.kind, category: i.category, tags: i.tags, modality: i.modality, confidence: i.confidence })),
      relations: (ns.relations || []).map(r => ({ from: r.from, to: r.to, type: r.type, weight: r.weight, directed: r.directed, context_tag: r.context_tag })),
      scripts: (ns.scripts || []).map(s => ({ scenario: s.scenario, tags: s.tags, template: s.template })),
    }
    const delta = diffPacks(base, cur)
    if (out) { fs.writeFileSync(out, JSON.stringify(delta, null, 2), 'utf8'); console.log(`[✓] 运行态增量 → ${out}`) } else console.log(JSON.stringify(delta, null, 2))
    console.log(`增量：+${delta.imagos.length} 意象 / +${delta.relations.length} 关系 / +${delta.scripts.length} 脚本；移除 ${delta.delta.removed_imagos.length} 意象 / ${delta.delta.removed_scripts.length} 脚本`)
    return
  }

  console.error('用法: evolve-share.mjs --diff a.json b.json [--out d.json] | --merge base.json delta.json [--out m.json] | --base base.json [--state yihe-host.json] [--out d.json]')
  process.exit(1)
}

main()
