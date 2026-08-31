#!/usr/bin/env node
/**
 * pkg-dev 冒烟测试套件（v2）
 * ---------------------------------------------------------------
 * 用法：
 *   node smoke-test.mjs --selfcheck   # 静态校验全部包（意象/关系/脚本完整性）
 *   node smoke-test.mjs               # 输出待执行测试清单（11 包 14 条）
 *   node smoke-test.mjs --rfb         # 校验 RFB 经验库 asm 源（无空格/场一致性）
 *
 * CI 断言（宿主执行 yihe_reason 后）：
 *   result.status == "decided" 且 confidence >= 0.6
 *   决策意象 ∈ expect 列表（或相关路径意象）
 */
import fs from 'node:fs'
import path from 'node:path'

const PACKS = [
  { id: 'pkg-dev',     ns: '开发',     q: '这个模块要不要重构',                    expect: ['重构', '技术债'] },
  { id: 'pkg-dev',     ns: '开发',     q: '微服务还是单体，怎么辩证选型',          expect: ['辩证推演', '技术选型'] },
  { id: 'pkg-dev-ts',  ns: 'TS开发',   q: '项目 any 泛滥要不要开严格模式',          expect: ['严格模式', '类型安全'] },
  { id: 'pkg-dev-py',  ns: 'PY开发',   q: 'CPU 密集任务多线程还是多进程',           expect: ['GIL受限', '多进程', '并发'] },
  { id: 'pkg-dev-rs',  ns: 'RS开发',   q: '多线程共享计数器用 Arc 还是 channel',    expect: ['Arc', 'Mutex', '通道'] },
  { id: 'pkg-dev-go',  ns: 'GO开发',   q: 'goroutine 泄漏怎么排查',                 expect: ['goroutine泄漏', 'context'] },
  { id: 'pkg-dev-ai',  ns: 'AI开发',   q: 'RAG 怎么降低幻觉',                       expect: ['RAG', '幻觉', '向量检索'] },
  { id: 'pkg-dev-java',ns: 'JAVA开发', q: 'Spring 事务边界怎么设计',                expect: ['事务管理', 'Spring', 'AOP'] },
  { id: 'pkg-dev-java',ns: 'JAVA开发', q: 'JVM 内存泄漏 OOM 怎么排查',              expect: ['JVM', '垃圾回收', 'OOM'] },
  { id: 'pkg-dev-ops', ns: 'OPS开发',  q: 'K8s 新版本怎么灰度上线',                 expect: ['灰度发布', '金丝雀发布', '部署策略'] },
  { id: 'pkg-dev-db',  ns: 'DB开发',   q: '数据库慢查询怎么优化',                   expect: ['SQL', '索引', '慢查询', '执行计划'] },
  { id: 'pkg-dev-mobile',ns: 'MOBILE开发', q: 'App 启动太慢怎么优化',               expect: ['启动优化', '卡顿', '主线程'] },
  { id: 'pkg-dev-test',ns: 'TEST开发', q: 'Flaky 测试怎么治理',                     expect: ['Flaky测试', '测试稳定性', '测试隔离'] },
  { id: 'pkg-dev-fe',  ns: 'FE开发',   q: '前端首屏性能怎么优化',                   expect: ['代码分割', '首屏性能', '懒加载'] },
  { id: 'pkg-dev-sec', ns: 'SEC开发',  q: 'Web 应用怎么防 SQL 注入和 XSS',          expect: ['SQL注入', 'XSS', '威胁建模'] },
  { id: 'pkg-dev-embed',ns: 'EMBED开发', q: '嵌入式设备低功耗怎么设计',             expect: ['低功耗', '睡眠模式', '唤醒源'] },
  { id: 'pkg-dev-agent',ns: 'AGENT开发', q: 'Agent 自主循环和安全护栏怎么搭',       expect: ['工具调用', '自主循环', '安全护栏'] },
  { id: 'pkg-dev-cpp',  ns: 'CPP开发',   q: 'C++ 内存泄漏和悬垂指针怎么防',          expect: ['RAII', '智能指针', '内存管理'] },
  { id: 'pkg-dev-dotnet',ns: 'DOTNET开发', q: '.NET 依赖注入和生命周期怎么设计',      expect: ['依赖注入', 'ASP.NETCore', '异步编程'] },
  { id: 'pkg-dev-git',  ns: 'GIT开发',   q: '团队 Git 分支策略怎么选',                expect: ['分支策略', 'GitFlow', 'Trunk-based'] },
  { id: 'pkg-dev-bigdata',ns: 'BD开发',  q: '实时流处理选 Spark 还是 Flink',          expect: ['流处理', 'Flink', '流批一体'] },
  { id: 'pkg-dev-game', ns: 'GAME开发',  q: '小团队游戏引擎选 Unity 还是 Godot',      expect: ['游戏引擎', 'Unity', 'Godot'] },
  { id: 'pkg-dev-algo', ns: 'ALGO开发',  q: '频繁查询场景用哈希还是二叉搜索树',        expect: ['哈希表', '算法', '时间复杂度'] },
  { id: 'pkg-dev-arch', ns: 'ARCH开发',  q: '新项目直接上微服务还是先单体',            expect: ['微服务', '单体架构', '架构演进'] },
  { id: 'pkg-dev-design',ns: 'DESIGN开发', q: '运行时行为多变用策略还是状态模式',      expect: ['策略', '状态', '设计模式'] },
  { id: 'pkg-dev-net',  ns: 'NET开发',   q: '实时推送用 WebSocket 还是轮询',          expect: ['WebSocket', '长连接', '网络延迟'] },
  { id: 'pkg-dev-os',   ns: 'OS开发',    q: '高并发网络服务用 epoll 还是多线程',       expect: ['epoll', 'I/O多路复用', '线程'] },
  { id: 'pkg-dev-perf', ns: 'PERF开发',  q: '接口 P99 延迟超标怎么定位瓶颈',           expect: ['P99', '剖析', '火焰图'] },
  { id: 'pkg-dev-evolve',ns: 'EVOLVE开发', q: '编程包生态怎么自主扩展和进化共享',      expect: ['自主扩展', '进化共享', '知识缺口'] },
  { id: 'pkg-dev-quantum',ns: 'QUANTUM开发', q: '量子计算项目值不值得投入',            expect: ['量子优势', '量子算法', '量子比特'] },
  { id: 'pkg-dev-formal', ns: 'FORMAL开发', q: '并发协议要不要做形式化验证',           expect: ['形式化验证', '不变式', '模型检验'] },
  { id: 'pkg-dev-compiler',ns: 'COMPILER开发', q: '自研编译器怎么设计前后端分离',       expect: ['编译器', '中间表示', '代码生成'] },
  { id: 'pkg-dev-wasm',  ns: 'WASM开发',   q: '性能敏感模块要不要用 WebAssembly',      expect: ['WebAssembly', 'WASI', '沙箱安全'] },
  { id: 'pkg-dev-crypto',ns: 'CRYPTO开发', q: '用户口令怎么安全存储',                  expect: ['口令存储', '盐值', '哈希函数'] },
  { id: 'pkg-dev-graph', ns: 'GRAPH开发',  q: '关系深度查询该用图数据库吗',            expect: ['图数据库', '属性图', '图计算'] },
  { id: 'pkg-dev-sci',   ns: 'SCI开发',    q: '数值计算精度不稳怎么处理',              expect: ['浮点误差', '数值稳定性', '误差传播'] },
  { id: 'pkg-dev-fp',    ns: 'FP开发',     q: '现有代码怎么渐进引入函数式风格',        expect: ['纯函数', '不可变性', '副作用'] },
  { id: 'pkg-dev-event', ns: 'EVENT开发',  q: '事件溯源和 CQRS 要不要上',              expect: ['事件溯源', 'CQRS', '幂等性'] },
  { id: 'pkg-dev-dsl',   ns: 'DSL开发',    q: '该不该为配置规则设计 DSL',              expect: ['领域特定语言', 'DSL设计', '语义模型'] },
  { id: 'pkg-dev-chaos', ns: 'CHAOS开发',  q: '混沌工程怎么小成本起步',                expect: ['混沌工程', '故障注入', '爆炸半径'] },
  { id: 'pkg-dev-re',    ns: 'RE开发',     q: '无符号二进制怎么开始逆向分析',          expect: ['逆向工程', '反汇编', '静态分析'] },
  { id: 'pkg-dev-kotlin',ns: 'KOTLIN开发', q: 'Android 异步任务协程还是回调',          expect: ['协程', '结构化并发', '挂起函数'] },
  { id: 'pkg-dev-swift', ns: 'SWIFT开发',  q: 'SwiftUI 状态管理怎么设计',               expect: ['SwiftUI', '视图状态', '数据绑定'] },
  { id: 'pkg-dev-c',     ns: 'C开发',      q: 'C 内存泄漏和悬垂指针怎么防',             expect: ['指针', '内存管理', '悬垂指针'] },
  { id: 'pkg-dev-web3',  ns: 'WEB3开发',   q: '智能合约重入攻击怎么防',                 expect: ['智能合约', '重入攻击', 'Solidity'] },
  { id: 'pkg-dev',     ns: '开发',     q: '技术栈升级要注意什么',                   expect: ['版本管理', '技术选型', '回滚'] },
]

function packDir() {
  // 发布结构：tools/ 与 packages/ 同级；源结构：包在脚本同目录
  const self = path.dirname(process.argv[1])
  const cand = path.join(self, '..', 'packages')
  if (fs.existsSync(cand)) return cand
  return self
}

function selfcheck() {
  let fail = 0, total = 0
  const pdir = packDir()
  for (const p of PACKS) {
    const file = path.join(pdir, `${p.id}.json`)
    if (!fs.existsSync(file)) { console.error(`[✗] ${p.id}: 包文件缺失（${file}）`); fail++; continue }
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
    const ids = new Set(pkg.imagos.map(i => i.content))
    total++
    let pkgFail = 0
    for (const e of p.expect) {
      const aliasOk = [...ids].some(i => i.replace(/\s/g, '') === e.replace(/\s/g, ''))
      if (!aliasOk) { console.error(`[✗] ${p.id}: 期望意象「${e}」不存在`); pkgFail++ }
    }
    const bad = pkg.relations.filter(r => !ids.has(r.from) || !ids.has(r.to))
    if (bad.length) { console.error(`[✗] ${p.id}: ${bad.length} 条关系引用缺失意象`); pkgFail++ }
    const dup = pkg.imagos.map(i => i.content).filter((c, i, a) => a.indexOf(c) !== i)
    if (dup.length) { console.error(`[✗] ${p.id}: ${dup.length} 个重复意象`); pkgFail++ }
    if (!pkgFail) console.log(`[✓] ${p.id}（${pkg.imagos.length} 意象 / ${pkg.relations.length} 关系 / ${pkg.scripts.length} 脚本）`)
    else fail++
  }
  console.log(fail ? `\n冒烟自检失败：${fail}/${total} 项` : `\n冒烟自检全部通过 ✓（${total} 包）`)
  process.exit(fail ? 1 : 0)
}

function rfbCheck() {
  let fail = 0
  const self = path.dirname(process.argv[1])
  const rfbDir = path.join(self, '..', 'rfb')
  const dir = fs.existsSync(rfbDir) ? rfbDir : self
  const asmFiles = fs.readdirSync(dir).filter(f => f.endsWith('.asm'))
  for (const f of asmFiles) {
    const text = fs.readFileSync(path.join(dir, f), 'utf8')
    let fFail = 0
    // 1) 指令行意象/场名不含空格（汇编器 \S+ 限制）
    for (const line of text.split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('.') || t.startsWith('//')) continue
      const parts = t.split(/\s+/)
      if (parts.length >= 3 && (parts[1].includes(' ') || parts[2].includes(' '))) {
        console.error(`[✗] ${f}: 指令行含空格意象: ${t.slice(0, 60)}`); fFail++
      }
    }
    // 2) .FIELD 声明去重
    const fields = text.split(/\r?\n/).filter(l => l.startsWith('.FIELD ')).map(l => l.slice(7).trim())
    const dupF = fields.filter((x, i) => fields.indexOf(x) !== i)
    if (dupF.length) { console.error(`[✗] ${f}: 重复场声明: ${dupF.join(',')}`); fFail++ }
    console.log(`[${fFail ? '✗' : '✓'}] ${f}（${text.split(/\r?\n/).filter(l => l.trim() && !l.startsWith('.IMAGE') && !l.startsWith('.FIELD')).length} 指令）`)
    if (fFail) fail++
  }
  console.log(fail ? `\nRFB 源检查失败：${fail} 文件` : `\nRFB 源检查全部通过 ✓（${asmFiles.length} 文件）`)
  process.exit(fail ? 1 : 0)
}

if (process.argv.includes('--selfcheck')) selfcheck()
else if (process.argv.includes('--rfb')) rfbCheck()
else {
  console.log('pkg-dev 冒烟测试清单 v2（共 ' + PACKS.length + ' 条）——逐条执行：')
  console.log('yihe_reason question="<q>" namespace=<ns> risk_tier=mid\n')
  for (const p of PACKS) {
    console.log(`# ${p.id} @${p.ns}`)
    console.log(`  question: ${p.q}`)
    console.log(`  expect: decided，决策 ∈ [${p.expect.join(' / ')}] 或相关路径\n`)
  }
  console.log('CI 断言：result.status == "decided" && confidence >= 0.6')
  console.log('附加：node smoke-test.mjs --selfcheck（静态） / --rfb（RFB 源）')
}
