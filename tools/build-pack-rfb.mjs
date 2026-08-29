#!/usr/bin/env node
/**
 * pkg-dev 一键构建器：pkg JSON → RFB-Assembly
 * ---------------------------------------------------------------
 * 用法：
 *   node build-pack-rfb.mjs <pkg.json> [lib-name]   # 单包
 *   node build-pack-rfb.mjs --all                   # 批量：目录内所有 pkg-dev*.json
 *   node build-pack-rfb.mjs --check <pkg.json>      # 仅静态校验（不输出 asm）
 *   - 读取编程包 JSON（imagos/relations/scripts）
 *   - 生成 RFB-Assembly（.IMAGE/.FIELD 声明 + 指令行）
 *   - 自动处理汇编器限制：
 *       1) 含空格意象名 → 无空格别名（tsc 类型检查 → tsc类型检查）
 *       2) context_tag 的 # 前缀统一去掉
 *   - 输出 <pkg>-rfb.asm（关系网版）与 <pkg>-scripts.asm（脚本场景版）
 *   - 打印入库命令（yihe_rfb op=lib.save ...）
 * 示例：node build-pack-rfb.mjs pkg-dev-rs.json
 */
import fs from 'node:fs'
import path from 'node:path'

const OPCODE = { causal: 'CAUSE', condition: 'IF', progression: 'THEN', similar: 'LIKE', oppose: 'BUT', entail: 'ENTAIL', support: 'SUPPORT', undermine: 'UNDERMINE', temporal: 'TEMP', belong: 'BELONG' }

function alias(name) { return name.replace(/\s+/g, '') }

function main() {
  const [arg1, arg2] = process.argv.slice(2)

  // ---- --check：仅静态校验 ----
  if (arg1 === '--check') {
    const f = path.resolve(arg2)
    const pkg = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''))
    const ids = new Set(pkg.imagos.map(i => i.content))
    const bad = pkg.relations.filter(r => !ids.has(r.from) || !ids.has(r.to))
    const dup = pkg.imagos.map(i => i.content).filter((c, i, a) => a.indexOf(c) !== i)
    console.log(`[${bad.length || dup.length ? '✗' : '✓'}] ${path.basename(f)}（${pkg.imagos.length} 意象 / ${pkg.relations.length} 关系 / ${pkg.scripts.length} 脚本）`)
    if (bad.length) console.error(`  缺失引用: ${bad.map(r => `${r.from}->${r.to}`).join(', ')}`)
    if (dup.length) console.error(`  重复意象: ${dup.join(', ')}`)
    process.exit(bad.length || dup.length ? 1 : 0)
  }

  // ---- --all：批量构建目录内所有 pkg-dev*.json ----
  if (arg1 === '--all') {
    const dir = path.dirname(process.argv[1])
    const files = fs.readdirSync(dir).filter(f => f.startsWith('pkg-dev') && f.endsWith('.json') && !f.endsWith('compact.json'))
    if (!files.length) { console.error('目录内无 pkg-dev*.json'); process.exit(1) }
    let fail = 0
    for (const f of files) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8').replace(/^\uFEFF/, ''))
        const ids = new Set(pkg.imagos.map(i => i.content))
        const bad = pkg.relations.filter(r => !ids.has(r.from) || !ids.has(r.to))
        if (bad.length) { console.error(`[✗] ${f}: ${bad.length} 条缺失引用，跳过`); fail++; continue }
        buildOne(path.join(dir, f))
      } catch (e) { console.error(`[✗] ${f}: ${e.message}`); fail++ }
    }
    console.log(fail ? `\n批量构建完成（${fail} 个失败）` : '\n批量构建全部成功 ✓')
    process.exit(fail ? 1 : 0)
  }

  if (!arg1) { console.error('用法: node build-pack-rfb.mjs <pkg.json> | --all | --check <pkg.json>'); process.exit(1) }
  buildOne(path.resolve(arg1))
}

function buildOne(abs) {
  const raw = fs.readFileSync(abs, 'utf8').replace(/^\uFEFF/, '') // 剥离 UTF-8 BOM
  const pkg = JSON.parse(raw)
  const base = path.basename(abs, '.json')
  const libName = pkg.id || base
  const ids = new Set(pkg.imagos.map(i => i.content))

  // ---- 校验关系引用 ----
  const bad = pkg.relations.filter(r => !ids.has(r.from) || !ids.has(r.to))
  if (bad.length) {
    console.error(`[!] ${bad.length} 条关系引用了缺失意象（会被汇编器跳过）：`)
    bad.forEach(r => console.error(`    ${r.from} -> ${r.to}`))
    process.exit(1)
  }

  // ---- 关系网 → asm ----
  const lines = []
  const imgs = new Set()
  pkg.relations.forEach(r => { imgs.add(alias(r.from)); imgs.add(alias(r.to)) })
  imgs.forEach(i => lines.push(`.IMAGE ${i}`))
  const fields = new Set()
  pkg.relations.forEach(r => { if (r.context_tag) fields.add(r.context_tag.replace(/^#/, '')) })
  fields.forEach(f => lines.push(`.FIELD ${f}`))
  pkg.relations.forEach(r => {
    const op = OPCODE[r.type] || r.type.toUpperCase()
    const w = Number(r.weight).toFixed(3)
    let line = `${op} ${alias(r.from)} ${alias(r.to)} .WEIGHT ${w}`
    if (r.context_tag) line += ` .FIELD ${r.context_tag.replace(/^#/, '')}`
    lines.push(line)
  })
  const asmFile = `${base}-rfb.asm`
  fs.writeFileSync(asmFile, lines.join('\n'), 'utf8')
  console.log(`[✓] 关系网 asm: ${asmFile}（${pkg.relations.length} 条指令，${imgs.size} 意象，${fields.size} 场）`)

  // ---- 脚本 → 场景 asm ----
  if (pkg.scripts && pkg.scripts.length) {
    const sl = ['.FIELD 场景']
    pkg.scripts.forEach(s => {
      const scene = alias(s.scenario)
      sl.push(`.IMAGE ${scene}`)
      ;(s.tags || []).forEach(t => {
        const ta = alias(t)
        if (ta !== scene && ids.has(t)) sl.push(`SUPPORT ${scene} ${ta} .WEIGHT 0.7 .FIELD 场景`)
      })
      const clauses = s.template.split(/[；;，,。]/)
      clauses.forEach(cl => {
        const c = cl.trim()
        for (const id of ids) {
          if (c.includes(id) || (c.length >= 2 && id.includes(c.slice(0, Math.min(4, c.length))))) {
            const ia = alias(id)
            if (ia !== scene && !sl.includes(`SUPPORT ${scene} ${ia} .WEIGHT 0.5 .FIELD 场景`)) {
              sl.push(`SUPPORT ${scene} ${ia} .WEIGHT 0.5 .FIELD 场景`)
            }
            break
          }
        }
      })
    })
    const sFile = `${base}-scripts.asm`
    fs.writeFileSync(sFile, sl.join('\n'), 'utf8')
    console.log(`[✓] 脚本场景 asm: ${sFile}（${pkg.scripts.length} 个场景）`)
  }

  // ---- 入库命令 ----
  console.log('\n[入库命令]')
  console.log(`yihe_rfb op=lib.save name=${libName} content=<${asmFile} 内容>`)
  if (pkg.scripts && pkg.scripts.length) {
    console.log(`yihe_rfb op=lib.save name=${libName}-scripts content=<${base}-scripts.asm 内容>`)
  }
  console.log('\n[验证]')
  console.log(`yihe_rfb op=lib.vm name=${libName} input=<意象> fields=["<场>"]`)
}

main()
