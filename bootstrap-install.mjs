#!/usr/bin/env node
/**
 * YiHe 编程包生态 · 一键安装器
 * ---------------------------------------------------------------
 * 让新开发者在 3 分钟内完成全量部署：导入 27 个编程包 → 建 55 个 RFB 经验库
 * → 开启脚本预匹配短路（本地优先省钱）→ 商业许可引导 → 冒烟验证。
 *
 * 用法（在 DSH 会话中由 Agent 执行，或人工按输出逐步调用）：
 *   node bootstrap-install.mjs --dry-run    # 只打印将执行的步骤（推荐先看）
 *   node bootstrap-install.mjs --smoke      # 安装后自动冒烟验证
 *
 * 说明：本脚本输出「可执行的操作序列」（导入/建库/配置/激活命令），
 * 实际执行需在 DSH 运行时通过 yihe_pack/yihe_rfb/yihe_admin 等工具完成——
 * 由宿主 Agent 读取本脚本的步骤清单逐条执行，或人工在会话中调用。
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const DIR = path.dirname(process.argv[1])
const PACK_DIR = path.join(DIR, 'packages')
const RFB_DIR = path.join(DIR, 'rfb')
const PACKS = [
  'pkg-dev', 'pkg-dev-ts', 'pkg-dev-py', 'pkg-dev-rs', 'pkg-dev-go', 'pkg-dev-ai',
  'pkg-dev-java', 'pkg-dev-ops', 'pkg-dev-db', 'pkg-dev-mobile', 'pkg-dev-test',
  'pkg-dev-fe', 'pkg-dev-sec', 'pkg-dev-embed', 'pkg-dev-agent',
  'pkg-dev-cpp', 'pkg-dev-dotnet', 'pkg-dev-git', 'pkg-dev-bigdata', 'pkg-dev-game',
  'pkg-dev-algo', 'pkg-dev-arch', 'pkg-dev-design', 'pkg-dev-net', 'pkg-dev-os',
  'pkg-dev-perf', 'pkg-dev-evolve',
]

function steps() {
  const out = []
  // 1) 导入全部包
  out.push({ phase: '导入编程包（27 个）', cmds: [] })
  for (const id of PACKS) {
    const f = path.join(PACK_DIR, id + '.json')
    if (!fs.existsSync(f)) { console.error(`[✗] 缺少 ${f}`); process.exit(1) }
    out[0].cmds.push(`yihe_pack op=import content=<${id}.json 内容>`)
  }
  // 2) 建 RFB 经验库（关系网 full + 脚本 scripts + meta）
  const libs = []
  for (const id of PACKS) {
    libs.push({ name: id === 'pkg-dev-evolve' ? id : id + '-full', file: path.join(RFB_DIR, id + '-rfb.asm') })
    if (id !== 'pkg-dev-meta') libs.push({ name: id + '-scripts', file: path.join(RFB_DIR, id + '-scripts.asm') })
  }
  libs.push({ name: 'pkg-dev-meta', file: path.join(RFB_DIR, 'pkg-dev-meta.asm') })
  out.push({ phase: `建 RFB 经验库（${libs.length} 个）`, cmds: [] })
  for (const l of libs) {
    if (!fs.existsSync(l.file)) { console.error(`[✗] 缺少 ${l.file}`); process.exit(1) }
    out[1].cmds.push(`yihe_rfb op=lib.save name=${l.name} content=<${path.basename(l.file)}>`)
  }
  // 3) 配置：经验库上限 + 脚本短路
  out.push({ phase: '运行配置', cmds: [
    'yihe_admin op=config action=set key=rfb_library_max value=128',
    'yihe_admin op=config action=set key=script_hit_threshold value=0.5',
  ] })
  // 4) 商业许可引导
  out.push({ phase: '商业许可（按需）', cmds: [
    'yihe_license op=activate pack_id=<包id> key=<PRO-/TEAM-/ENT- 密钥>',
    'yihe_license op=status  # 验证 tier 与配额',
  ] })
  // 5) 冒烟
  out.push({ phase: '冒烟验证', cmds: [
    'node tools/smoke-test.mjs --selfcheck',
    'node tools/smoke-test.mjs --rfb',
    'yihe_reason question=「这个模块要不要重构」namespace=开发',
  ] })
  return out
}

function main() {
  const args = process.argv.slice(2)
  const plan = steps()
  if (args.includes('--dry-run')) {
    console.log('# YiHe 编程包生态 · 一键安装计划')
    for (const p of plan) {
      console.log(`\n## ${p.phase}（${p.cmds.length} 条）`)
      for (const c of p.cmds) console.log('  ' + c)
    }
    console.log(`\n总计 ${plan.reduce((s, p) => s + p.cmds.length, 0)} 条操作`)
    return
  }
  // 完整执行清单（供 Agent/人工逐步执行）
  console.log(JSON.stringify(plan, null, 2))
}

// 安装回传（匿名埋点，失败静默）：channel = release-zip
function reportInstall() {
  try {
    const payload = {
      schema: 'yihe-telemetry-v1',
      instance: `${os.hostname()}-${process.pid}`,
      event: 'install',
      os: process.platform,
      channel: 'release-zip',
      version: '1.0.0',
      time: Math.floor(Date.now() / 1000),
    }
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 5000)
    fetch('https://www.zhiyiwei.cn/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    }).then((r) => {
      clearTimeout(timer)
      if (r.ok) console.log('[yihe-pkg-dev] 安装回传成功 (匿名埋点)')
    }).catch(() => {})
  } catch { /* 网络不可达：跳过 */ }
}

reportInstall()

main()
