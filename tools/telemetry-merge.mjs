#!/usr/bin/env node
/**
 * 回传汇聚器：合并多实例埋点 → 全局使用报告（驱动跨实例进化决策）
 * ---------------------------------------------------------------
 * 用法：
 *   node telemetry-merge.mjs telemetry-*.json        # 合并所有回传文件
 *   node telemetry-merge.mjs --dir telemetry/         # 合并目录内所有 *.telemetry.json
 *   node telemetry-merge.mjs --out report.json        # 指定输出
 *   node telemetry-merge.mjs --json                   # stdout
 *
 * 输出：
 *   instances（去重实例数）/ 全局计数 / 决策汇总 / 领域热度聚合
 *   script_pool 总规模与命中 / 安全汇总 / 省钱总估算
 *   evolution_hints（进化建议：高频领域、低命中脚本池、高拦截模式）
 */
import fs from 'node:fs'
import path from 'node:path'

function collect(files) {
  const tels = []
  for (const f of files) {
    try {
      const t = JSON.parse(fs.readFileSync(f, 'utf8'))
      if (t.schema === 'yihe-telemetry-v1') tels.push({ file: path.basename(f), ...t })
    } catch (e) { console.warn(`[✗] 跳过 ${f}: ${e.message}`) }
  }
  return tels
}

function main() {
  const args = process.argv.slice(2)
  let files = []
  const di = args.indexOf('--dir')
  if (di >= 0 && args[di + 1]) {
    const dir = path.resolve(args[di + 1])
    files = fs.readdirSync(dir).filter(f => f.includes('telemetry') && f.endsWith('.json')).map(f => path.join(dir, f))
  } else {
    files = args.filter(a => !a.startsWith('--') && (a.includes('telemetry') || a.endsWith('.json')))
  }
  if (!files.length) { console.error('未找到回传文件（telemetry-*.json）'); process.exit(1) }

  const tels = collect(files)
  if (!tels.length) { console.error('无可合并的有效回传'); process.exit(1) }

  const instances = new Set(tels.map(t => t.instance))
  const sum = (k) => tels.reduce((s, t) => s + ((t[k] || 0)), 0)
  const sumNested = (obj, k) => tels.reduce((s, t) => s + ((t[obj] && t[obj][k]) || 0), 0)
  const g = {
    instances: instances.size,
    instance_ids: [...instances],
    counts: { reason: sumNested('counts', 'reason'), rfb: sumNested('counts', 'rfb'), script: sumNested('counts', 'script'), executions: sumNested('counts', 'executions') },
    decisions: { total: sumNested('decisions', 'total'), decided: sumNested('decisions', 'decided'), script_hit: sumNested('decisions', 'script_hit'), need_more: sumNested('decisions', 'need_more') },
  }
  // 领域热度聚合
  const dom = {}
  for (const t of tels) for (const d of (t.domains || [])) dom[d.ns] = (dom[d.ns] || 0) + d.count
  const domains = Object.entries(dom).map(([ns, count]) => ({ ns, count })).sort((a, b) => b.count - a.count).slice(0, 15)
  // 脚本池
  const pool = { total: sumNested('script_pool', 'total'), hit: sumNested('script_pool', 'hit') }
  // 安全
  const sec = { attack_fingerprints: sumNested('security', 'attack_fingerprints'), sec_audit_events: sumNested('security', 'sec_audit_events'), asset_blocks: sumNested('security', 'asset_blocks') }
  // 省钱
  const savings = { script_hit_token_est: sumNested('savings', 'script_hit_token_est'), total_reason: sumNested('savings', 'reason_calls') }
  // 平均置信（加权）
  const avgConf = tels.length ? Number((tels.reduce((s, t) => s + ((t.decisions && t.decisions.avg_confidence || 0)), 0) / tels.length).toFixed(3)) : 0

  const report = {
    schema: 'yihe-telemetry-merged-v1',
    generated_at: Date.now(),
    instances: g.instances,
    counts: g.counts,
    decisions: { ...g.decisions, avg_confidence: avgConf },
    domains,
    script_pool: pool,
    security: sec,
    savings,
    evolution_hints: {
      hot_domains: domains.slice(0, 5).map(d => d.ns),
      pool_hit_rate: pool.total ? Number((pool.hit / pool.total).toFixed(3)) : 0,
      security_pressure: sec.asset_blocks,
      suggest: [
        domains.slice(0, 3).length ? `优先深化高频领域：${domains.slice(0, 3).map(d => d.ns).join('/')}` : '使用量不足，先引导更多实例接入',
        pool.hit / Math.max(1, pool.total) < 0.2 ? '脚本池命中率偏低：建议增强提问同义词 tags 或引导反馈' : '脚本池命中率健康',
        sec.asset_blocks > 0 ? `检测到 ${sec.asset_blocks} 次资产拦截：运行 auto-secure 进化加固` : '安全状态良好',
      ],
    },
  }

  const oi = args.indexOf('--out')
  if (args.includes('--json')) { console.log(JSON.stringify(report, null, 2)); return }
  if (oi >= 0 && args[oi + 1]) {
    fs.writeFileSync(path.resolve(args[oi + 1]), JSON.stringify(report, null, 2), 'utf8')
    console.log(`[✓] 全局报告 → ${args[oi + 1]}`)
  } else {
    console.log('# YiHe 全局使用报告（跨实例汇聚）')
    console.log(`\n实例数: ${g.instances}`)
    console.log(`计数: reason ${g.counts.reason} / rfb ${g.counts.rfb} / script ${g.counts.script}`)
    console.log(`决策: ${g.decisions.total}（decided ${g.decisions.decided} / script_hit ${g.decisions.script_hit} / 平均置信 ${avgConf}）`)
    console.log(`脚本池: ${pool.total}（命中 ${pool.hit}）`)
    console.log(`安全: 攻击指纹 ${sec.attack_fingerprints} / 资产拦截 ${sec.asset_blocks}`)
    console.log(`省钱: 脚本短路共省 ≈ ${savings.script_hit_token_est} token`)
    console.log(`\n领域热度 TOP: ${domains.map(d => d.ns + '(' + d.count + ')').join('、')}`)
    console.log(`进化建议:`)
    for (const s of report.evolution_hints.suggest) console.log('  · ' + s)
  }
}

main()
