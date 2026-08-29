# pkg-dev 编程包生态 · 版本与变更日志

> 包 id 前缀 `pkg-dev*` · 语义化版本 MAJOR.MINOR.PATCH
> 变更原则：意象/关系/脚本增删改 → MINOR+；破坏性格式变更 → MAJOR；修复 → PATCH

## 运行状态（2026-08-29）

- **27 个编程包商业许可全部激活**（PRO_PACKS 28 三处同步后重启生效；26 包于首轮重启激活，pkg-dev-evolve 于 PRO_PACKS 28 重启后激活）
- **团队版 team 档落地**：PLANS 增 `team`（¥299/月 / 50000 次 / 超额 ¥0.03/次），三处同步（内置插件/工作区 JS/Rust gateway），`activateLicense` 支持 `TEAM-` 密钥前缀，`tierOf` 升序链 enterprise > team > pro > free，Rust 测试补 TEAM- 断言通过
- **本地优先·脚本预匹配短路落地**：`script_hit_threshold` 配置（默认 0=关闭，>0 开启）——开启后问题命中高分脚本（score≥阈值）→ 免 reason 直接返回脚本模板结论（gateway=script_hit，bump script 免费计量，0 token）；`matchScripts` 增关键词通道（问题含场景名/标签词提升分数，弥补中文语义鸿沟）；三处同步 + Rust 测试 `reason_script_hit_shortcircuit_via_rpc` 通过（34/34）；开启方式：`yihe_admin op=config action=set key=script_hit_threshold value=0.5`；**已实测**：重启后开启 0.5，「这个模块要不要重构」→ 直接返回重构决策脚本模板（dec-4716 入库，reason 不 +1，script 计量 +1）
- **tierOf 优先级修复**：实测发现 team 许可被遍历顺序靠后的 pro 许可覆盖（status 错误显示 pro）——修复为 `team` 一经设置不被 `pro` 覆盖（enterprise > team > pro > free），三处同步；node 模拟验证 27pro+1team → team；Rust license 测试 2/2 通过
- **TEAM- 密钥实测**：`yihe_license op=activate pack_id=pkg-dev-git key=TEAM-DEMO-0001` → tier=team 生效（重启后 status 显示团队版/配额 50000）

### 2026-08-29 · 使用汇总与能力加速
- **脚本 tags 同义词增强（12 包）**：git/perf/algo/evolve/bigdata/cpp/dotnet/game/arch/design/net/os 脚本补充真实提问措辞 tags（如「分支策略怎么选」「CPU瓶颈怎么定位」「哈希还是二叉树」），使 `matchScripts` 关键词通道识别用户实际问法
- **实测效果**：script_hit 决策 5→**12 次**（≈14400 token 节省），8 个之前不命中的真实提问全部命中短路（冲突解决/数据结构选型/性能指标/IO模型/架构风格/内存安全/协议选型/引擎选型）；reason 计量保持 132 未增
- **使用汇总报告**：`usage-report-20260829.md`（64 决策/132 reason/53 脚本命中/领域热度/省钱量化/加速建议）
- **反馈瓶颈识别**：当前反馈 0 条，学习闭环缺数据——建议 reason 后 `yihe_feedback adopted/rejected` 喂数据

### 2026-08-29 · 发布 v1.0.0（面向开发者分发）
- **发布产物**：`pkg-dev-release-v1.0.0.zip`（225.5 KB）——27 包 / 55 asm / 10 工具 / 23 文档 / 一键安装器，自包含可分发
- **bootstrap-install.mjs**：新用户一键安装器（--dry-run 预览计划）——27 包导入 + 55 库建立 + 开脚本短路 + 许可引导 + 冒烟，3 分钟部署
- **RELEASE.md**：面向新开发者的发布指南（快速开始/使用/商业/进化逻辑/安全/工具清单）
- **工具路径探测**：smoke-test.mjs 支持发布结构（tools/ 与 packages/、rfb/ 同级）——发布包 selfcheck 30 包 + rfb 55 文件全通过
- **发布验证**：27 包 JSON 引用完整 / 55 asm 结构正确 / 冒烟全过

### 2026-08-29 · AI Agent 执行层护栏（§20.6）
- **AGENT_PATTERNS 落地（6 类）**：破坏性系统操作/权限提升/数据外泄动作/危险网络动作/注入型指令/Agent 提示注入
- **护栏链路**：planExecution 每步 secScanAction → 危险动作标记 require_confirm + 审计 sec.agent_guard；advancePlan require_confirm 步骤无 confirmed=true → 拦截 + 审计 sec.agent_block
- **人类确认网关**：危险操作 confirmed=true 显式确认后放行（与决策层 risk_tier=high 确认网关同构）
- **lossless 序列化修复**：重启实测 plan 报 "not lossless JSON"——护栏 guard 字段用 undefined 被 JSON.stringify 丢弃 → 改 null（双处同步，模拟验证危险/正常步骤均 lossless）
- **闭环实测**：危险动作 7/7 拦截（删除生产库/清root/导出源码/关闭防火墙/eval注入/忽略规则）、confirmed 放行、正常动作 0/5 误报
- **安全体系四层齐备**：问题输入侧（DANGER_PATTERNS）+ 资产侧（ASSET_PATTERNS）+ **Agent 执行层（AGENT_PATTERNS）** + 进化层（auto-secure）
- 内置插件 + 工作区 JS 双处同步；⚠️ 需重启生效

### 2026-08-29 · 安全自主进化（§20.5）
- **auto-secure.mjs 工具**：安全自主进化器——分析拦截/审计记录 + 8 条变体启发 → 发现现有模式未覆盖的新攻击表述（清库/加密转账/密钥导出/隧道后门/越狱/跳过检查/文件外传）
- **进化闭环实测**：7 类新型攻击进化前 0/7 拦截 → 应用变体模式后 **7/7 拦截**（+7 新变体）
- **进化成果固化**：ASSET_PATTERNS 4→9 类（新增 asset-db-destroy/asset-crypto-transfer/asset-key-exfil/asset-tunnel-backdoor/asset-file-exfil + asset-prompt 越狱增强），内置插件+工作区 JS 双处同步
- **重启验证 + 模式盲区修复**：重启后实测入库拦截生效（恶意脚本/越狱被拒）；发现资产模式**方向性盲区**——「把私钥导出到外部」反向语序漏报 → asset-key-exfil 双向增强 + asset-exfil 补"导出/转储"动词（双处同步，验证 5/6→6/6）
- **进化共享**：sec-patch 补丁提案格式与 pack 兼容可分发；攻击指纹库可随 evolve-share 跨实例同步
- **安全文档 v2**：security-shared.md 增「§20.5 安全自主进化」（进化循环/固化成果/闭环实测/共享）

### 2026-08-29 · 共享机制安全加固（§20.4）
- **威胁模型**：识别四类共享机制攻击面——脚本池投毒/反馈权重操纵/delta 供应链/标签污染（现有 yihe_sec 仅覆盖问题输入侧，知识资产侧零防护）
- **ASSET_PATTERNS 落地（4 类）**：命令注入（rm -rf/DROP TABLE/eval exec）、数据外泄（双向顺序增强）、后门植入、提示注入
- **三处入库拦截**：addScript/upsertImago 前置 secScanAsset 扫描（命中拒绝+审计 sec.asset_block），applyPack（delta 导入）经此自动覆盖
- **短路前置扫描**：scriptHit 返回前对模板扫描，恶意模板降级为完整推演
- **实测**：6/6 攻击用例全拦截（含数据外泄漏报修复）、5/5 正常内容零误报
- **安全文档**：`security-shared.md`（威胁模型/防护/验证/边界与建议）
- ⚠️ 生效：内置插件改动需 DSH 重启加载；Rust gateway 同步列为后续建议

### 2026-08-29 · 飞轮三动作（反馈闭环 / 脚本化 / 进化共享）
- **A 反馈闭环启动**：批量 adopted 16 条高置信决策（覆盖 GIT/ALGO/PERF/EVOLVE/开发等），9 条奖惩已 flush 应用（权重调整），队列 18 条待自动应用——学习闭环从 0 起步
- **B 高频场景脚本化（+8 脚本）**：提交规范/动态规划/消息队列选型/压测方案/Token消耗审计/游戏循环设计/反模式识别/并发编程，均带提问同义词 tags；脚本池 295 个，被命中 24 个
- **C 进化共享验证**：evolve-share 导出 GIT 运行态 delta（+8 意象/+60 关系）→ 导入成功 → merge 基线（48→56 意象、33→93 关系，冲突 0）——跨实例共享全链路跑通
- **D matchScripts 空白归一化修复**：关键词通道对"commit 信息"类带空格中英组合失效——三处同步修复（问题与 tags 去空白后再比），模拟验证 0.476→0.550 命中；Rust 编译通过
- **实测**：script_hit 累计 **16 次 ≈ 19200 token 节省**；reason 134、script 67 计量正常
- 运行环境：30 包（27 编程 + 3 内置）/ 57 RFB 经验库 / pro 套餐配额 10000 / 当前命名空间「开发」
- 全部 27 包真实使用实测通过（yihe_reason decided 0.779）；开放性问题会触发信息不足保护（need_more_info）属正常行为
- 商业方案：`pkg-dev-pricing.md`（三档定价/计量口径/密钥体系/账单对账/落地状态）

## 包版本清单

| 包 | 版本 | 命名空间 | 意象 | 关系 | 脚本 | 许可 |
|---|---|---|---|---|---|---|
| pkg-dev | 3.0.0 | 开发 | 118 | 150 | 30 | pro |
| pkg-dev-ts | 1.0.0 | TS开发 | 88 | 69 | 10 | pro |
| pkg-dev-py | 1.0.0 | PY开发 | 78 | 62 | 10 | pro |
| pkg-dev-rs | 1.0.0 | RS开发 | 68 | 54 | 10 | pro |
| pkg-dev-go | 1.0.0 | GO开发 | 66 | 47 | 10 | pro |
| pkg-dev-ai | 1.0.0 | AI开发 | 66 | 55 | 10 | pro |
| pkg-dev-java | 1.0.0 | JAVA开发 | 80 | 59 | 10 | pro |
| pkg-dev-ops | 1.0.0 | OPS开发 | 69 | 56 | 10 | pro |
| pkg-dev-db | 1.0.0 | DB开发 | 68 | 58 | 10 | pro |
| pkg-dev-mobile | 1.0.0 | MOBILE开发 | 66 | 54 | 10 | pro |
| pkg-dev-test | 1.0.0 | TEST开发 | 64 | 55 | 10 | pro |
| pkg-dev-fe | 1.0.0 | FE开发 | 70 | 55 | 10 | pro |
| pkg-dev-sec | 1.0.0 | SEC开发 | 70 | 61 | 10 | pro |
| pkg-dev-embed | 1.0.0 | EMBED开发 | 67 | 57 | 10 | pro |
| pkg-dev-agent | 1.0.0 | AGENT开发 | 73 | 63 | 10 | pro |
| pkg-dev-cpp | 1.0.0 | CPP开发 | 67 | 46 | 10 | pro |
| pkg-dev-dotnet | 1.0.0 | DOTNET开发 | 69 | 45 | 10 | pro |
| pkg-dev-git | 1.0.0 | GIT开发 | 48 | 33 | 10 | pro |
| pkg-dev-bigdata | 1.0.0 | BD开发 | 60 | 46 | 10 | pro |
| pkg-dev-game | 1.0.0 | GAME开发 | 53 | 38 | 10 | pro |
| pkg-dev-algo | 1.0.0 | ALGO开发 | 60 | 45 | 10 | pro |
| pkg-dev-arch | 1.0.0 | ARCH开发 | 48 | 33 | 10 | pro |
| pkg-dev-design | 1.0.0 | DESIGN开发 | 49 | 44 | 10 | pro |
| pkg-dev-net | 1.0.0 | NET开发 | 53 | 40 | 10 | pro |
| pkg-dev-os | 1.0.0 | OS开发 | 51 | 36 | 10 | pro |
| pkg-dev-perf | 1.0.0 | PERF开发 | 49 | 40 | 10 | pro |
| pkg-dev-evolve | 1.0.0 | EVOLVE开发 | 32 | 35 | 10 | pro |

## RFB 经验库清单

| 库 | 指令 | 体积 | 来源 |
|---|---|---|---|
| pkg-dev-full | 150 | 2400B | pkg-dev 关系网 |
| pkg-dev-ts-full | 69 | 1104B | pkg-dev-ts 关系网 |
| pkg-dev-py-full | 62 | 992B | pkg-dev-py 关系网 |
| pkg-dev-rs-full | 54 | 864B | pkg-dev-rs 关系网 |
| pkg-dev-go-full | 47 | 752B | pkg-dev-go 关系网 |
| pkg-dev-ai-full | 55 | 880B | pkg-dev-ai 关系网 |
| pkg-dev-java-full | 59 | 944B | pkg-dev-java 关系网 |
| pkg-dev-ops-full | 56 | 896B | pkg-dev-ops 关系网 |
| pkg-dev-db-full | 58 | 928B | pkg-dev-db 关系网 |
| pkg-dev-mobile-full | 54 | 864B | pkg-dev-mobile 关系网 |
| pkg-dev-test-full | 55 | 880B | pkg-dev-test 关系网 |
| pkg-dev-fe-full | 55 | 880B | pkg-dev-fe 关系网 |
| pkg-dev-sec-full | 61 | 976B | pkg-dev-sec 关系网 |
| pkg-dev-embed-full | 57 | 912B | pkg-dev-embed 关系网 |
| pkg-dev-agent-full | 63 | 1008B | pkg-dev-agent 关系网 |
| pkg-dev-scripts | 98 | 1568B | pkg-dev 脚本场景 |
| pkg-dev-ts-scripts | 40 | 640B | pkg-dev-ts 脚本场景 |
| pkg-dev-py-scripts | 31 | 496B | pkg-dev-py 脚本场景 |
| pkg-dev-rs-scripts | 32 | 512B | pkg-dev-rs 脚本场景 |
| pkg-dev-go-scripts | 31 | 496B | pkg-dev-go 脚本场景 |
| pkg-dev-ai-scripts | 30 | 480B | pkg-dev-ai 脚本场景 |
| pkg-dev-java-scripts | 31 | 496B | pkg-dev-java 脚本场景 |
| pkg-dev-ops-scripts | 33 | 528B | pkg-dev-ops 脚本场景 |
| pkg-dev-db-scripts | 33 | 528B | pkg-dev-db 脚本场景 |
| pkg-dev-mobile-scripts | 31 | 496B | pkg-dev-mobile 脚本场景 |
| pkg-dev-test-scripts | 27 | 432B | pkg-dev-test 脚本场景 |
| pkg-dev-fe-scripts | 30 | 480B | pkg-dev-fe 脚本场景 |
| pkg-dev-sec-scripts | 28 | 448B | pkg-dev-sec 脚本场景 |
| pkg-dev-embed-scripts | 29 | 464B | pkg-dev-embed 脚本场景 |
| pkg-dev-agent-scripts | 30 | 480B | pkg-dev-agent 脚本场景 |
| pkg-dev-meta | 46 | 736B | 正反合模板 + 跨域类比库（+26 新领域类比） |
| pkg-dev-cpp-full | 46 | 736B | pkg-dev-cpp 关系网 |
| pkg-dev-cpp-scripts | 31 | 496B | pkg-dev-cpp 脚本场景 |
| pkg-dev-dotnet-full | 45 | 720B | pkg-dev-dotnet 关系网 |
| pkg-dev-dotnet-scripts | 27 | 432B | pkg-dev-dotnet 脚本场景 |
| pkg-dev-git-full | 33 | 528B | pkg-dev-git 关系网 |
| pkg-dev-git-scripts | 38 | 608B | pkg-dev-git 脚本场景 |
| pkg-dev-bigdata-full | 46 | 736B | pkg-dev-bigdata 关系网 |
| pkg-dev-bigdata-scripts | 39 | 624B | pkg-dev-bigdata 脚本场景 |
| pkg-dev-game-full | 38 | 608B | pkg-dev-game 关系网 |
| pkg-dev-game-scripts | 32 | 512B | pkg-dev-game 脚本场景 |
| pkg-dev-algo-full | 45 | 720B | pkg-dev-algo 关系网 |
| pkg-dev-algo-scripts | 33 | 528B | pkg-dev-algo 脚本场景 |
| pkg-dev-arch-full | 33 | 528B | pkg-dev-arch 关系网 |
| pkg-dev-arch-scripts | 33 | 528B | pkg-dev-arch 脚本场景 |
| pkg-dev-design-full | 44 | 704B | pkg-dev-design 关系网 |
| pkg-dev-design-scripts | 38 | 608B | pkg-dev-design 脚本场景 |
| pkg-dev-net-full | 40 | 640B | pkg-dev-net 关系网 |
| pkg-dev-net-scripts | 36 | 576B | pkg-dev-net 脚本场景 |
| pkg-dev-os-full | 36 | 576B | pkg-dev-os 关系网 |
| pkg-dev-os-scripts | 41 | 656B | pkg-dev-os 脚本场景 |
| pkg-dev-perf-full | 40 | 640B | pkg-dev-perf 关系网 |
| pkg-dev-perf-scripts | 29 | 464B | pkg-dev-perf 脚本场景 |
| pkg-dev-refactor | 4 | 64B | 重构决策示例 |
| pkg-dev-evolve | 34 | 544B | pkg-dev-evolve 关系网（四能力方法论） |
| pkg-dev-evolve-scripts | 22 | 352B | pkg-dev-evolve 脚本场景 |
## 变更日志

### 2026-08 · 四能力进化（自主扩展 / 自主学习 / 省 token / 进化共享）
- **新增 pkg-dev-evolve 包**（EVOLVE开发，32 意象/35 关系/10 脚本）：自主扩展（知识缺口检测/补丁提案/进化循环）、自主学习（反馈闭环/奖惩队列/脚本案例化）、省 token（RFB 本地执行/决策缓存/本地优先）、进化共享（增量包/Delta 导出/跨实例同步）四能力方法论；RFB 库 2 个（evolve 34 指令 + evolve-scripts 22 指令）实测可执行
- **自主扩展工具 auto-expand.mjs**：27 包缺口分析（孤立意象/低连接节点/连通分量/缺口指数）→ 3143 条候选补丁（语义邻近 similar/support 提案），可导出可导入补丁包
- **自主学习工具 self-learn.mjs**：读取运行态 → 决策统计（64 决策/51 decided/平均置信 0.757）/反馈方向/奖惩队列/高置信沉淀建议/经验库热度
- **省 token 工具 token-save.mjs**：渠道审计（reason 106 次 ≈ 12.7 万 token vs RFB 31 次 + 脚本 22 次 0 token）→ 22 条决策可本地化，节省 ≈ 2.6 万 token（20.8%），含 4 条优化建议
- **进化共享工具 evolve-share.mjs**：`--diff`（两包对比）、`--base --state`（基线 vs 运行态增量）、`--merge`（冲突取 delta 并集合并）三模式实测通过
- **经验库治理**：发现并记录磁盘重复 meta 库（46 条新版 + 20 条旧版残留），运行时热池按 name 后加载覆盖行为正确，重启后 `lib.remove rl-1659-49b0` 清理
- 冒烟：selfcheck 30 包 + rfb 55 asm 源全过；evolve 包 yihe_reason 实测 decided 0.707

### 2026-08 · 编程包全面扩展（11 新包 + 工具链 + 智能深化）
- **新增 11 个子包（共 26 个编程包）**：
  - 语言栈 5：pkg-dev-cpp（C/C++ 系统开发，67/46/10）、pkg-dev-dotnet（.NET/C# 企业开发，69/45/10）、pkg-dev-git（Git 版本管理，48/33/10）、pkg-dev-bigdata（大数据/湖仓/流计算，60/46/10）、pkg-dev-game（游戏引擎开发，53/38/10）
  - 核心理论 3：pkg-dev-algo（算法与数据结构，60/45/10）、pkg-dev-arch（软件架构/DDD，48/33/10）、pkg-dev-design（设计模式/SOLID，49/44/10）
  - 工程实践 3：pkg-dev-net（网络编程，53/40/10）、pkg-dev-os（操作系统/并发，51/36/10）、pkg-dev-perf（性能工程，49/40/10）
- **22 个 RFB 经验库入库**（11 包 × 关系网 full + 脚本场景 scripts），全部 lib.vm 实测可执行
- **修复经验库截尾缺陷**：运行插件 `rfb_library_max=32`，新增 22 库导致最老 3 库（rs/go/ai-full）被 slice 截出持久化——`admin config set rfb_library_max=128` 并重存恢复，55 库全量在盘
- **工具链 3 件**：`graph-viz.mjs`（关系网→Mermaid/HTML/DOT + 统计）、`auto-smoke.mjs`（自动派生冒烟用例 189 条 + 报告）、`pack-merge.mjs`（多包合并去重）
- **智能深化**：agent-exec 打通（toolbox 3 新原子 → plan → advance×3 → report 全链路实测）；pkg-dev-meta 类比库 20→46 指令（+分支策略/流处理/湖仓/引擎/算法/模式/协议/I/O 模型等跨域类比）；决策案例库 11 例入库（各新领域实测案例）
- **PRO_PACKS 16→27**：Rust gateway license.rs + 工作区 JS + 内置插件三处同步（DSH 重启生效）
- 冒烟：smoke-test.mjs 扩至 29 包全过（selfcheck + rfb 53 asm 文件），11 新包 yihe_reason 实测全 decided 0.779

### 2026-08 · v3.0.0（pkg-dev 主包）
- **意象 41→118**：+32 YiHe 方法论（意合/关系编织/激活扩散/势态推演/辩证推演/留白/确认网关/学习闭环/三态逻辑/滚动规划/类比推理…）
- **关系 40→150**：理论内部链 29 + 理论×编程双链 21
- **脚本 10→30**：+10 方法论应用场景

### 2026-08 · v2.0.0（pkg-dev 主包）
- 意象 +45（安全/性能/数据/API/工程/流程/编码细节）；关系 +60；脚本 +10

### 2026-08 · v1.0.0 系列（语言栈子包）
- pkg-dev-ts（TypeScript/Node 全栈）、pkg-dev-py（Python 全栈）、pkg-dev-rs（Rust 系统编程）、pkg-dev-go（Go 云原生）、pkg-dev-ai（AI 数据工程）、pkg-dev-java（Java/Spring 企业开发）——各 60~88 意象 / 47~69 关系 / 10 脚本

### 2026-08 · v1.0.0 系列（领域子包）
- **pkg-dev-ops**（DevOps/平台工程：CI/CD/容器/K8s/IaC/可观测/SRE，69/56/10）
- **pkg-dev-db**（数据库工程：SQL 优化/事务/分库分表/缓存/高可用，68/58/10）
- **pkg-dev-mobile**（移动跨端：iOS/Android/Flutter/启动优化/崩溃治理，66/54/10）
- **pkg-dev-test**（软件测试：测试金字塔/自动化/性能/安全测试/用例设计，64/55/10）
- **pkg-dev-fe**（前端工程：React/Vue/SSR/微前端/Web 指标/构建优化，70/55/10）
- **pkg-dev-sec**（网络安全：威胁建模/攻击防护/密码学/事件响应/合规，70/61/10）
- **pkg-dev-embed**（嵌入式 IoT：RTOS/驱动/低功耗/OTA/实时性，67/57/10）
- **pkg-dev-agent**（**Agent 智能体工程**：多智能体编排/工具调用/记忆架构/自主循环/安全护栏/评测，73/63/10——创新未来领域）

### 2026-08 · RFB 经验库体系
- 全量关系网编译（table→asm→lib.save 流水线）
- 脚本场景映射库（场景节点→意象 SUPPORT 链）
- 正反合决策模板 + 跨栈类比库（pkg-dev-meta）

## 构建与验证

- 一键构建：`node yihe-packs/build-pack-rfb.mjs <pkg.json>`
- 冒烟测试：`node yihe-packs/smoke-test.mjs`（见 pkg-dev-smoke 文档）
- 重启恢复：`pkg-dev-restore-checklist.md`
