# pkg-dev 生态集成（CI 规范检查 + 多 Agent 协作）

> 目标：把编程包从"开发者问一句答一句"升级为**可嵌入研发流程的工程组件**。

## 一、CI 集成：RFB 经验库当"编程规范检查器"

### 场景
提交代码前自动检查：本次变更涉及的编程概念，YiHe 关系网是否已有相关规范信号。

### 方案（GitHub Actions 示例）

```yaml
name: yihe-dev-check
on:
  pull_request:
    paths: ['src/**', '*.ts', '*.py', '*.rs', '*.go']
jobs:
  rfb-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: YiHe RFB 规范检查
        run: |
          # 1. 提取变更文件中的编程概念（关键词扫描）
          CONCEPTS=$(grep -oE 'any|unsafe|goroutine|可变默认参数|裸 except|panic' $(git diff --name-only HEAD~1) | sort -u)
          # 2. 对每个概念跑 RFB 经验库三态检查
          for c in $CONCEPTS; do
            yihe_rfb op=lib.vm name=pkg-dev-full input="$c" fields='["编码"]' \
              || echo "⚠️ $c 命中编程规范信号，请评审"
          done
      - name: 冒烟
        run: node yihe-packs/smoke-test.mjs --selfcheck
```

### 价值
- **反模式门禁**：any / unsafe / goroutine 泄漏 / 可变默认参数 等反模式意象在关系网中均
  `undermine/causal` 关联到缺陷/性能瓶颈——CI 可据此标记高风险代码；
- **确定性**：字节码三态执行（0x01/0x00/0x02）比 LLM 判断更稳定，可作硬门禁；
- **审计**：每次检查的激活结果可入审计，形成"规范漂移"趋势。

## 二、多 Agent 协作：语言栈包分派

### 场景
一个跨栈项目（TS 前端 + Go 后端 + AI 服务），不同 Agent 负责不同栈，决策需要协同。

### 方案一：命名空间隔离分派

| Agent | 包 | 命名空间 | 职责 |
|---|---|---|---|
| Agent-FE | pkg-dev-ts | TS开发 | 前端/类型系统决策 |
| Agent-BE | pkg-dev-go | GO开发 | 后端/并发决策 |
| Agent-AI | pkg-dev-ai | AI开发 | RAG/MLOps 决策 |
| Agent-Arch | pkg-dev | 开发 | 跨栈架构/方法论 |

每个 Agent 激活自己的包，`yihe_reason` 在各自命名空间推演，互不污染意象库。

### 方案二：决策总线（类比库桥接）

跨栈问题（如"接口设计"）通过 `pkg-dev-meta` 类比库桥接：

```text
Agent-BE 问：「gRPC 服务设计注意什么」→ GO开发 推演
  → 决策「gRPC」(decided)
  → 触发 pkg-dev-meta 类比：gRPC服务设计 LIKE 架构与技术选型 / 接口设计
  → 通知 Agent-FE：接口契约决策影响前端 TS 类型定义
```

### 方案三：执行层接力（yihe_exec 跨 Agent）

```text
Agent-Arch 决策「技术选型」→ exec plan（辩证推演 → 技术选型 → 校验）
  → step1 完成，通知 Agent-BE 评估 Go 侧
  → Agent-BE 在 GO开发 命名空间独立推演补充
  → 汇总回 Agent-Arch 合题
```

## 三、落地清单

| 项 | 工具 | 状态 |
|---|---|---|
| 包清单 | 6 包 × 各命名空间 | ✅ |
| RFB 检查器 | pkg-dev-full 等 11 库 | ✅ |
| 冒烟套件 | smoke-test.mjs | ✅ 自检通过 |
| CI 示例 | 见上（需适配实际 CI） | 文档化 |
| Agent 分派 | 命名空间隔离即就绪 | 文档化 |
| 类比桥接 | pkg-dev-meta | ✅ 已入库 |

## 四、注意事项

- RFB 检查器匹配的是**概念关键词**，非语义理解——对变量名/注释噪声敏感，建议配合
  代码静态分析工具（ESLint/clippy/golangci-lint）做第一道过滤，YiHe 做第二道概念级判断；
- 多 Agent 协作时确认 `yihe_license` 计量按 consumer 隔离（usage 已支持 consumer 维度）。
