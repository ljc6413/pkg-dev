# 插件安装评审手册（dshmarket / npm 社区插件）

> 配套脚本：开发 ns「插件安装评审」组 6 条（同名甄别 / 兼容性预检 / 信誉热度核查 / 安装前安全扫描 / 评审结论 / 批量事务）
> 实战记录：2026-09-04 dsh-computer-use 同名 4 家、dsh-kanban 候选 3 家甄别

## 四步评审清单

### ① 同名甄别（先答"是哪个"再谈装不装）
- npm 包名 + scope 逐字核对；GitHub owner/repo 与 npm publishConfig.repository 一致
- 在市场条目（awesome-dsh-plugin plugins.json）里按 name/owner/npm 三字段对齐
- 同名多实体的判据：owner 不同 = 不同实体（如 `dsh-computer-use` 有 988hj7tczd-oss/Anionex/ZRui-C/… 4 家；`dsh-kanban` 市场条目=alpacachen 的 `@alpacachen/dsh-kanban`，与 npm 无 scope 的 `dsh-kanban` 是两个东西）
- 拿不准 → 列候选让用户拍板，禁止凭名称直接装（今天两次都走了这一步，用户均确认了推荐项）

### ② 兼容性预检（对本机 DSH Desktop v2.0.2）
| 检查项 | 本机基准 |
|---|---|
| peerDependencies cordis | `^4.0.1`（内置 4.0.1） |
| peerDependencies dsh-settings | 区间需含 `0.1.1-rc.2` |
| peerDependencies schemastery | 内置 3.x |
| engines.node | 内置 ≥22.19（pnpm 装时无引擎警告即通过） |
| dsh.engines.dsh | 若声明门槛（如 ≥0.1.2-rc.1）需 ≤ 内置 0.1.1-rc.2，否则会被拒 |
| client.inject 模块 | 逐个查内置 unpacked `node_modules\@deepseek-ai\` 是否存在 |
| dsh.bundle.patch | cordis.patch.yml 路径必须存在 |

### ③ 信誉热度
npm downloads / 市场 stars+added 日期 / 最近发布间隔 / 仓库活动。红线：零下载、数月未更、来源仓库 404 或 private。

### ④ 安全
- 对 README/安装说明做语义安全扫描；内核 yihe_script add 自带 §20.4 拒收（危险词模板直接拦，是特性不是 bug）
- 高权限/改配置/声明上传行为的插件按 high risk 交用户确认

## 结论模板
`建议安装 vX.Y.Z（npm:xxx，来源 github:xxx/xxx，peer/engines 覆盖，dl N，四步全过）` / `缓装：<理由+条件>` / `换同名替代：<候选>` / `不装：<依据>`，并存决策轨迹。

## 与安装流程衔接（事务纪律）
- 同批多插件：**单条** `dsh plugin add A B C`（一个恢复事务）；逐条 add 会被 awaiting-restart 连环阻塞
- 装完提醒：重启一次 DSH Desktop 让启动校验提交（health-commit + rendererStatus healthy 才算过）
- 失败兜底：pending 事务在下次启动自动回滚到装前 package.json；或手动从 `dsh.profile.bundles` 摘除出问题条目

## 实测案例回放（2026-09-04）
1. dsh-computer-use-windows：npm(nanbbb, 0.2.1, 0 peer) vs 市场(github:qphotoai) → 用户选 ModLens 配套款（npm nanbbb）；peer 空、client 仅 bundle patch → 兼容
2. dsh-kanban：市场"dsh-kanban"= `@alpacachen/dsh-kanban` v1.4.0（Board+15 工具, react peer）vs npm `dsh-kanban` 0.2.4（零依赖 4 工具, 未进市场）vs `dsh-project-kanban`（零 peer 9 工具）→ 用户选 alpacachen；react peer 风险由启动校验兜底
