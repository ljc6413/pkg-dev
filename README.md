# YiHe 编程开发辅助 · pkg-dev

> **会进化的编程认知内核** — 39 个领域包 · 79 个 RFB 经验库 · 越用越省 · 越多开发者用越快

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Packs](https://img.shields.io/badge/packs-39-green)]()
[![RFB Libs](https://img.shields.io/badge/rfb_libs-79-orange)]()
[![Tools](https://img.shields.io/badge/tools-15-blue)]()
[![Version](https://img.shields.io/badge/version-1.2.0-purple)]()
[![CI](https://img.shields.io/badge/CI-smoke%20passing-brightgreen)](.github/workflows/smoke.yml)
[![Site](https://img.shields.io/badge/site-zhiyiwei.cn-blue)](https://www.zhiyiwei.cn)
[![Ops](https://img.shields.io/badge/ops-dashboard-purple)](https://www.zhiyiwei.cn/ops)

给 DeepSeek Harness 装一个会进化的编程领域知识库：39 个编程领域包（语言/框架/理论/实践 + 前沿探索 + 进化方法论），
每个包 = 一个命名空间的关系网（意象/关系/脚本），随会话自动装载，让 AI 在熟悉的领域给出高质量决策。

```
语言栈：cpp / dotnet / git / bigdata / game
理论：  algo / arch / design
实践：  net / os / perf
既有：  ts / py / rs / go / ai / java / ops / db / mobile / test / fe / sec / embed / agent + 主包
前沿：  quantum（量子计算）/ formal（形式化验证）/ compiler（编译器）/ wasm（WebAssembly）
        crypto（密码学·零知识）/ graph（图计算）/ sci（科学计算）/ fp（函数式编程）
        event（事件驱动）/ dsl（DSL·元编程）/ chaos（混沌工程）/ re（逆向·二进制分析）
进化：  evolve（自主扩展 / 学习 / 省 token / 共享方法论）
```

## ✨ 亮点

- **27 编程包 + 55 RFB 经验库**：即装即用，`yihe_reason` 三阶段决策（关系编织→语境整合→势态推演）
- **本地优先省 token**：脚本预匹配短路（script_hit_threshold）——高频问题直接命中脚本模板，**0 token**
- **自主进化**：auto-expand / self-learn / evolve-share 从会话学习自动扩包，越用越聪明
- **四层安全**：问题输入侧 + 资产侧 + Agent 执行层护栏 + 自主安全进化（auto-secure）
- **商业化就绪**：三档套餐（个人 ¥99 / 团队 ¥299 / 企业定制）+ 试用到期提醒 + 在线收款签发
- **运营可观测**：匿名埋点自动回传 + Web 运营增长仪表盘（访问/下载/回传/转化/试用/GitHub 增长）

## 🚀 快速开始

**先在线体验（真实内核）**：https://www.zhiyiwei.cn —— 输入「缓存用 Redis 还是本地内存？」这类真实技术问题，看三阶段决策与置信度。

```bash
# 下载发行包：https://www.zhiyiwei.cn （或本仓库 Release）
node bootstrap-install.mjs --dry-run   # 预览安装计划（27 包 + 55 库 + 配置）
# 按计划在 DSH 会话中执行即可，3 分钟部署完成
```

或 npm URL 安装（无需账号）：

```bash
npm install https://www.zhiyiwei.cn/npm-package
```

## 📦 目录

```
packages/            39 个编程包 JSON（意象/关系/脚本）
rfb/                 79 个 RFB 汇编源（→ yihe_rfb lib.save）
tools/               15 个工具（构建/冒烟/可视化/进化/安全/埋点/试用提醒）
docs/                25 份文档（使用/商业/安全/汇总/进化）
server-dashboard/    运营增长仪表盘（ops.html + 快照聚合器）
```

## 🛠 工具

| 工具 (bin) | 用途 |
|---|---|
| build-pack-rfb.mjs (`yihe-pkg-build`) | 包 JSON → RFB 汇编 |
| smoke-test.mjs (`yihe-pkg-smoke`) | 冒烟（--selfcheck / --rfb） |
| auto-expand.mjs (`yihe-pkg-expand`) | 自主扩展（知识缺口检测） |
| auto-secure.mjs (`yihe-pkg-secure`) | 安全自主进化（攻击变体发现） |
| self-learn.mjs (`yihe-pkg-learn`) | 自主学习（决策/反馈洞察） |
| token-save.mjs (`yihe-pkg-token`) | 省 token 审计 |
| evolve-share.mjs (`yihe-pkg-share`) | 进化共享（delta 导出/合并） |
| telemetry-export.mjs (`yihe-pkg-telemetry`) | 埋点导出（匿名使用统计） |
| telemetry-merge.mjs (`yihe-pkg-telemetry-merge`) | 回传汇聚（跨实例进化） |
| trial-remind.mjs (`yihe-pkg-remind`) | 试用/配额到期提醒（购买引导） |
| key-issue.mjs (`yihe-pkg-key`) | 商业密钥签发器 |
| postinstall-report.mjs | npm 安装匿名回传（自动触发） |

## 💬 真实体验

> 「我用下来的体验确实强过市面上大多数 agent 工具——它不是一个玩具，是我日常真的在用的编程助手。」
> —— 早期使用者（持续使用中）

| 维度 | 体验 |
|---|---|
| 🎯 决策深度 | 回答专业具体，不是模板话术 |
| 💰 省 token | 高频问题本地短路，成本肉眼可见地降 |
| 🧩 领域广度 | 27 个领域包，通用 agent 覆盖不了 |
| 🔄 进化能力 | 越用越懂我的项目，越用越强 |
| 🛡 安全感 | 危险操作要确认、四层护栏，用着放心 |
| ⚡ 易用性 | 装完就能用，工具链顺手，上手快 |

## 🤝 贡献

欢迎提交新领域包、脚本、安全模式或文档改进 —— 见 [CONTRIBUTING.md](CONTRIBUTING.md)。
每个贡献的脚本会进入共享脚本池，让所有使用者受益（省 token 飞轮）。

## 📚 文档导航

| 主题 | 文档 |
|---|---|
| 发布与快速开始 | [RELEASE.md](RELEASE.md) · [bootstrap-install.mjs](bootstrap-install.mjs) |
| 商业方案 | [pkg-dev-pricing.md](docs/pkg-dev-pricing.md) · [pkg-dev-payment.md](docs/pkg-dev-payment.md) |
| 安全体系 | [security-shared.md](docs/security-shared.md) · [SECURITY.md](SECURITY.md) |
| 进化方法论 | [evolve-tools.md](docs/evolve-tools.md) |
| 生态与分发渠道 | [CHANNELS.md](CHANNELS.md) · [pkg-dev-ecosystem.md](docs/pkg-dev-ecosystem.md) |
| 使用汇总报告 | [usage-report-20260829.md](docs/usage-report-20260829.md) |
| 变更日志 | [CHANGELOG.md](docs/CHANGELOG.md) |

## 📈 运营增长

- **Web 仪表盘**：https://www.zhiyiwei.cn/ops （访问/下载/安装回传/转化漏斗/试用临期/GitHub 增长）
- **匿名埋点**：安装即回传（preset-zip / npm / release-zip 三渠道），隐私友好（不含内容）
- **试用提醒**：团队版 14 天试用 → 临期自动提醒 → 到期锁定引导购买

## License

Apache-2.0（知识资产开源；商业使用需激活许可，见 docs/pkg-dev-pricing.md）
