# 编程包四能力进化工具

> 配套 `pkg-dev-evolve` 包（EVOLVE开发，32 意象/35 关系/10 脚本）与 4 个进化工具。
> 方法论：**发现缺口 → 自主补丁 → 反馈沉淀 → 本地优先省 token → 增量共享**。

## 1. 自主扩展 · `auto-expand.mjs`

检测知识缺口（孤立意象 / 低连接节点 / 连通分量），生成语义邻近补丁提案。

```bash
node auto-expand.mjs                        # 全部包缺口报告（缺口指数）
node auto-expand.mjs --json --out gaps.json # 结构化缺口 JSON
node auto-expand.mjs --patch patch.json     # 导出可导入补丁包（候选 similar/support 关系）
node auto-expand.mjs --min-degree 2         # 低连接阈值（默认 1）
```

- 缺口指数 = 孤立数×2 + 低连接数 + 分量数（越小越健康）
- 补丁关系按共享 tag/category 语义邻近生成，权重 0.5~0.8
- 实测：27 包 → 缺口指数 1514 → 3143 条候选补丁

## 2. 自主学习 · `self-learn.mjs`

读取运行态（`~/.dsh/yihe-host.json`），输出学习洞察与沉淀建议。

```bash
node self-learn.mjs                          # 文本报告
node self-learn.mjs --json --out learn.json  # 结构化洞察
node self-learn.mjs --min-conf 0.7           # 沉淀建议置信度阈值
node self-learn.mjs --state <yihe-host.json> # 指定状态文件
```

- 决策统计（总数/命名空间分布/平均置信/高置信数）
- 反馈闭环方向（采纳>拒绝 → 脚本化沉淀；拒绝>采纳 → 记反例）
- 奖惩队列待应用权重变化
- 高置信决策 → 建议脚本化（含期望意象）
- 经验库热度（usage≥2 热库 / usage=0 冷库）

## 3. 省 token · `token-save.mjs`

量化「本地优先」策略的 LLM token 节省空间。

```bash
node token-save.mjs                                    # 审计报告
node token-save.mjs --assume-llm-tokens 1200           # 每次 reason 的 token 估算（默认 1200）
node token-save.mjs --json --out token.json            # 结构化
```

- 渠道分布：reason（计费）vs RFB 本地执行 / 脚本预匹配（0 token）
- 可本地化分析：脚本覆盖命名空间的决策 → 节省估算 + 比例
- 高频脚本清单（沉淀价值高）+ 4 条优化建议
- 实测：106 次 reason ≈ 12.7 万 token，22 条决策可本地化 → 节省 ≈ 2.6 万 token（20.8%）

## 4. 进化共享 · `evolve-share.mjs`

基线对比 → delta 增量包 → 跨实例合并。

```bash
# 两包对比
node evolve-share.mjs --diff a.json b.json --out delta.json
# 基线 vs 运行态（真实进化场景）
node evolve-share.mjs --base pkg-dev-git.json --state <yihe-host.json> --out git-delta.json
# 跨实例合并（冲突取 delta 并集）
node evolve-share.mjs --merge base.json delta.json --out merged.json
```

- 增量 = 新意象（content 维度）/ 新关系（from|to|type）/ 新脚本（scenario）
- 自动版本 bump（base_version + diff_from + change 摘要）
- merge 冲突计数可审计

## 推荐进化循环（月度）

1. `auto-expand.mjs --json` → 检视缺口 → 人工确认补丁 → `--patch` 导出导入
2. 日常 `yihe_feedback adopted/rejected` 采集 → 月末 `self-learn.mjs` → 脚本化沉淀
3. `token-save.mjs` → 定位可本地化场景 → 启用本地优先决策（缓存→RFB→脚本→兜底 reason）
4. `evolve-share.mjs --base <上月包> --state` → 导出增量 → 共享给其他实例 merge
