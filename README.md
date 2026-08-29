# YiHe 编程开发辅助 · pkg-dev

> **会进化的编程认知内核** — 27 个领域包 · 55 个 RFB 经验库 · 越用越省 · 越多开发者用越快

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Packs](https://img.shields.io/badge/packs-27-green)]()
[![RFB Libs](https://img.shields.io/badge/rfb_libs-55-orange)]()
[![Version](https://img.shields.io/badge/version-1.0.0-purple)]()

## 是什么

YiHe 认知硬核的编程领域资产：每个包 = 一个命名空间的关系网（意象/关系/脚本），
随会话自动装载，让 AI 在熟悉的领域给出高质量决策。

```
语言栈：cpp / dotnet / git / bigdata / game
理论：  algo / arch / design
实践：  net / os / perf
既有：  ts/py/rs/go/ai/java/ops/db/mobile/test/fe/sec/embed/agent + 主包
进化：  evolve（自主扩展/学习/省token/共享方法论）
```

## 快速开始

```bash
# 解压后
node bootstrap-install.mjs --dry-run   # 预览安装计划（27 包 + 55 库 + 配置）
# 按计划在 DSH 会话中执行即可，3 分钟部署完成
```

完整指南见 [RELEASE.md](RELEASE.md) · 商业方案 [pkg-dev-pricing.md](docs/pkg-dev-pricing.md) · 安全 [security-shared.md](docs/security-shared.md)

## 为什么"越多开发者用越好"

- **共享脚本池**：295+ 脚本全员共用 — 一人沉淀，全员免费命中（省 token）
- **自主进化**：auto-secure 持续发现新攻击变体 → 固化 → 全员防护升级
- **进化共享**：evolve-share 导出增量 → 跨实例 merge → 知识池越滚越大
- **反馈飞轮**：adopted/rejected 喂数据 → 权重强化 → 命中率↑ → 更省

## 目录

```
packages/    27 个编程包 JSON（意象/关系/脚本）
rfb/         55 个 RFB 汇编源（→ yihe_rfb lib.save）
tools/       10 个工具（构建/冒烟/可视化/进化/安全/埋点）
docs/        23 份文档（使用/商业/安全/汇总）
```

## 工具

| 工具 | 用途 |
|---|---|
| build-pack-rfb.mjs | 包 JSON → RFB 汇编 |
| smoke-test.mjs | 冒烟（--selfcheck / --rfb） |
| auto-expand.mjs | 自主扩展（知识缺口检测） |
| auto-secure.mjs | 安全自主进化（变体发现） |
| self-learn.mjs | 自主学习（决策/反馈洞察） |
| token-save.mjs | 省 token 审计 |
| evolve-share.mjs | 进化共享（delta 导出/合并） |
| telemetry-export.mjs | 埋点导出（使用统计回传） |
| telemetry-merge.mjs | 回传汇聚（跨实例进化） |

## License

Apache-2.0（知识资产开源；商业使用需激活许可，见 docs/pkg-dev-pricing.md）
