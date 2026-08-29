# YiHe AI 数据工程子包（pkg-dev-ai）

> 版本：1.0.0 · 命名空间：**AI开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：AI/数据工程领域子包——LLM 应用（Prompt 工程/RAG/Agent/幻觉治理）、
> 数据管道（清洗/质量/血缘）、ML（特征工程/模型评估/过拟合/数据漂移）、
> MLOps（版本管理/实验追踪/注册表）、LLM 安全（提示注入/隐私合规）、成本延迟优化。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 66 | LLM（LLM 应用/Prompt 工程/RAG/向量检索/Embedding/上下文窗口/Token 管理/幻觉/工具调用/Agent/多轮对话）、RAG（知识库/文档解析/分块/重排序/混合检索）、数据（管道/清洗/质量/标注/血缘/数据湖）、ML（特征工程/训练/评估/过拟合/欠拟合/漂移/微调/少样本）、工程（MLOps/模型版本/注册表/实验追踪/A/B 测试/可观测/成本）、安全（隐私合规/脱敏/越狱/提示注入/内容审核） |
| relations（关系网） | 55 | RAG→削弱幻觉→支撑准确性；Prompt 工程→削弱幻觉；上下文窗口→Token 管理→成本控制；数据管道→清洗→质量→准确性；数据漂移→削弱准确性；提示注入→支撑越狱攻击 |
| scripts（脚本池） | 10 | RAG 系统设计 / Prompt 工程 / Agent 设计 / LLM 成本延迟优化 / 数据管道构建 / 模型评估防漂移 / LLM 安全防护 / MLOps 落地 / 特征工程 / LLM 应用测试 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-ai.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-ai     （命名空间切到 AI开发）
3. 推演：yihe_reason question=<AI 问题> input=<上下文> namespace=AI开发
```

**许可**：商业包——`yihe_license op=activate pack_id=pkg-dev-ai key=PRO-xxxx…`（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| RAG 怎么降低幻觉 | 「RAG」（向量检索/幻觉路径） | 0.779 |
| 脚本匹配「RAG 设计」 | 命中 2 个 | — |

## 三、设计要点

- **幻觉治理是核心轴**：`RAG + Prompt 工程 → 削弱幻觉 → 支撑准确性`；
- **成本轴**：`上下文窗口 → Token 管理 → 成本控制`（LLM 应用特有）；
- **数据质量轴**：`数据管道 → 清洗 → 数据质量 → 准确性`；
- **安全轴**：`提示注入 → 越狱攻击`，`隐私合规 → 数据脱敏`；
- **自包含**：跨包意象（代码可读性）已补齐。

## 四、扩展定制

1. 复制本文件为 `pkg-dev-ai-<your>.json`，按需增补意象/关系/脚本；
2. `relations.from/to` 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
