#!/usr/bin/env node
/**
 * 多包合并器：多个 pkg JSON → 合并为一个复合包
 * ---------------------------------------------------------------
 * 用法：
 *   node pack-merge.mjs --out merged.json pkg-a.json pkg-b.json ...
 *   node pack-merge.mjs --out merged.json --all --prefix 高阶    # 目录内全部 pkg-dev*.json
 *   node pack-merge.mjs --check pkg-a.json pkg-b.json           # 仅校验可合并性（不输出）
 *
 * 合并语义：
 *   - 意象：按 content 去重（跨包同名意象视为同一节点）
 *   - 关系：按 (from,to,type) 去重；权重取 max（强化共识）并保留 context_tag
 *   - 脚本：按 scenario 去重（同名场景保留权重最高者）
 *   - 命名空间：若各包 namespace 不同 → 默认取第一个；--ns <name> 可指定
 *   - 元数据：name/industry 取各包名称拼接；version 取最高；tier 取最严
 */
import fs from 'node:fs'
import path from 'node:path'

function load(f) {
  return JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''))
}

function merge(pkgs, opts) {
  const imagoMap = new Map() // content -> imago
  const relMap = new Map()   // key(from|to|type) -> relation
  const scriptMap = new Map() // scenario -> script
  let ns = opts.ns || pkgs[0].namespace
  const nameParts = new Set(), indParts = new Set(), tiers = new Set()
  let maxVer = '0.0.0'

  for (const p of pkgs) {
    if (p.namespace) ns = opts.ns || ns
    nameParts.add(p.name)
    indParts.add(p.industry || '')
    if (p.tier) tiers.add(p.tier)
    if (p.version && semverGt(p.version, maxVer)) maxVer = p.version
    for (const i of p.imagos || []) if (!imagoMap.has(i.content)) imagoMap.set(i.content, i)
    for (const r of p.relations || []) {
      if (!imagoMap.has(r.from) || !imagoMap.has(r.to)) continue // 悬挂关系丢弃（正常包不应出现）
      const k = `${r.from}|${r.to}|${r.type}`
      const old = relMap.get(k)
      if (!old) relMap.set(k, r)
      else if (typeof r.weight === 'number' && (!old.weight || r.weight > old.weight)) relMap.set(k, { ...old, weight: r.weight })
    }
    for (const s of p.scripts || []) {
      const old = scriptMap.get(s.scenario)
      if (!old || (s.weight || 0) > (old.weight || 0)) scriptMap.set(s.scenario, s)
    }
  }
  const names = [...nameParts].filter(Boolean)
  const inds = [...indParts].filter(Boolean)
  const tierOrder = ['free', 'pro', 'enterprise']
  const tier = opts.tier || (tiers.size ? [...tiers].sort((a, b) => tierOrder.indexOf(b) - tierOrder.indexOf(a))[0] : 'pro')

  const merged = {
    id: opts.id || pkgs.map(p => p.id).join('+'),
    name: opts.name || names.join(' + '),
    industry: opts.industry || (inds.length ? inds.join('/') : '编程'),
    version: maxVer,
    namespace: ns,
    owner: opts.owner || pkgs[0].owner || 'yidev',
    tier,
    license_required: opts.license ?? pkgs.some(p => p.license_required),
    imagos: [...imagoMap.values()],
    relations: [...relMap.values()],
    scripts: [...scriptMap.values()],
  }
  return merged
}

function semverGt(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number)
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0) }
  return false
}

function check(pkgs) {
  const problems = []
  for (const p of pkgs) {
    const ids = new Set(p.imagos.map(i => i.content))
    for (const r of p.relations) if (!ids.has(r.from) || !ids.has(r.to)) problems.push(`${p.id}: 悬挂关系 ${r.from}->${r.to}`)
  }
  return problems
}

function main() {
  const args = process.argv.slice(2)
  const opts = {}
  const files = []
  const VAL = new Set(['--out', '--ns', '--name', '--id', '--owner'])
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--all' || a === '--check') continue
    if (VAL.has(a)) { opts[a.slice(2)] = args[++i]; continue }
    if (a.startsWith('--')) continue
    files.push(a)
  }

  if (args.includes('--check')) {
    if (!files.length) { console.error('--check 需要包文件'); process.exit(1) }
    const pkgs = files.map(load)
    const problems = check(pkgs)
    const total = pkgs.reduce((s, p) => s + p.imagos.length, 0)
    const uniq = new Set(pkgs.flatMap(p => p.imagos.map(i => i.content))).size
    console.log(`[${problems.length ? '✗' : '✓'}] ${files.length} 包 / ${total} 意象（去重后 ${uniq}）`)
    if (problems.length) { console.error(problems.map(p => '  ' + p).join('\n')); process.exit(1) }
    return
  }

  if (args.includes('--all')) {
    const dir = path.dirname(process.argv[1])
    files.push(...fs.readdirSync(dir).filter(f => f.startsWith('pkg-dev') && f.endsWith('.json') && !f.endsWith('compact.json')).map(f => path.join(dir, f)))
  }
  if (files.length < 2) { console.error('合并至少需要 2 个包文件'); process.exit(1) }

  const pkgs = files.map(load)
  const problems = check(pkgs)
  if (problems.length) { console.error('存在悬挂关系，拒绝合并：\n' + problems.map(p => '  ' + p).join('\n')); process.exit(1) }
  const merged = merge(pkgs, opts)
  if (opts.out) {
    fs.writeFileSync(path.resolve(opts.out), JSON.stringify(merged, null, 2), 'utf8')
    console.log(`[✓] 已合并 ${files.length} 包 → ${opts.out}`)
    console.log(`    ${merged.imagos.length} 意象 / ${merged.relations.length} 关系 / ${merged.scripts.length} 脚本 / ns=${merged.namespace} / tier=${merged.tier}`)
  } else {
    console.log(JSON.stringify(merged, null, 2))
  }
}

main()
