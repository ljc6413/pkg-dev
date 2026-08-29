# YiHe 编程开发辅助 · 发布包 v1.0

> **给开发者的完整编程认知内核**：27 个领域包（语言栈/核心理论/工程实践/进化）+ 55 个 RFB
> 经验库 + 10 个工程工具 + 商业/安全/进化全套体系。**越用越省、越用越强、越多开发者用越快。**

---

## 一、这是什么

YiHe 认知硬核的编程领域资产包。每个包是一个**命名空间的关系网**（意象/关系/脚本），
随会话自动装载，让 AI 助手在你熟悉的领域给出高质量决策。

| 类别 | 包 | 覆盖 |
|---|---|---|
| 语言栈 (5) | cpp / dotnet / git / bigdata / game | C++/.NET/版本管理/大数据/游戏引擎 |
| 核心理论 (3) | algo / arch / design | 算法/架构/设计模式 |
| 工程实践 (3) | net / os / perf | 网络/操作系统/性能 |
| 既有领域 (15) | ts/py/rs/go/ai/java/ops/db/mobile/test/fe/sec/embed/agent + 主包 | 全栈/数据/AI/DevOps/移动/前端/安全/嵌入式/Agent |
| 进化 (1) | evolve | 自主扩展/学习/省token/共享方法论 |

---

## 二、快速开始（3 分钟）

### 方式 A：一键安装（推荐）

```bash
# 1) 先看安装计划
node bootstrap-install.mjs --dry-run

# 2) 在 DSH 会话中按计划执行（或让 Agent 逐条执行）：
#    import 27 包 → lib.save 55 库 → config 开短路 → license 激活 → smoke
```

### 方式 B：手动（详见 docs/pkg-dev-restore-checklist.md）

```text
yihe_pack op=import content=<packages/pkg-dev.json>   # 逐个导入 27 包
yihe_rfb op=lib.save name=<lib> content=<rfb/*.asm>    # 建 55 个经验库
yihe_admin op=config action=set key=script_hit_threshold value=0.5  # 开本地优先
```

---

## 三、使用

```text
# 当前命名空间直接用（默认「开发」主包）
yihe_reason question="这个模块要不要重构"

# 切到具体领域
yihe_pack op=activate id=pkg-dev-git     → GIT开发
yihe_pack op=activate id=pkg-dev-perf    → PERF开发

# 本地优先省钱（已开启 script_hit_threshold=0.5）
# 命中脚本 → 免推理直接返回结论（0 token，实测省 ~19k token）
```

---

## 四、商业方案（pkg-dev-pricing.md）

| 档位 | 价格 | 配额/月 | 超额 | 密钥前缀 |
|---|---|---|---|---|
| 免费 | ¥0 | 500 次 | 超限即停 | — |
| 个人版 | ¥99/月 | 10,000 次 | ¥0.05/次 | `PRO-` |
| 团队版 | ¥299/月 | 50,000 次 | ¥0.03/次 | `TEAM-` |
| 企业版 | 定制 | 不限量 | — | `ENT-` |

```text
yihe_license op=activate pack_id=<包id> key=<密钥>
yihe_license op=usage        # 用量与费用
yihe_license op=export       # 账单对账
```

---

## 五、为什么"越多开发者用越好"（usage-report）

1. **共享脚本池**：295+ 脚本全员共用——一人沉淀，全员免费命中
2. **自主进化**：auto-secure 持续发现新攻击变体 → 固化 → 全员防护升级
3. **进化共享**：evolve-share 导出增量 → 跨实例 merge → 池越滚越大
4. **反馈飞轮**：adopted/rejected 喂数据 → 权重强化 → 命中率↑ → 更省

**每个新开发者都在为公共知识池投资**——这是"越多越省"的数学保证。

---

## 六、安全（security-shared.md）

四层纵深防御：问题输入侧（语义免疫+蜜罐）→ 知识资产侧（入库扫描）→
Agent 执行层（危险动作确认网关）→ 进化层（auto-secure 持续加固）。

---

## 七、工具清单（tools/）

| 工具 | 用途 |
|---|---|
| `build-pack-rfb.mjs` | 包 JSON → RFB 汇编源 |
| `smoke-test.mjs` | 冒烟（--selfcheck / --rfb） |
| `graph-viz.mjs` | 关系网可视化 |
| `auto-smoke.mjs` | 自动冒烟用例 |
| `pack-merge.mjs` | 多包合并 |
| `auto-expand.mjs` | 自主扩展（知识缺口检测） |
| `self-learn.mjs` | 自主学习（决策/反馈洞察） |
| `token-save.mjs` | 省 token 审计 |
| `evolve-share.mjs` | 进化共享（delta 导出/合并） |
| `auto-secure.mjs` | 安全自主进化（变体发现） |

---

## 八、发布与版本

- 版本：v1.0.0（2026-08-29）
- 变更：docs/CHANGELOG.md
- 升级：替换 packages/ + rfb/ 后重新导入即可（同命名空间合并）

*YiHe 编程开发辅助 · 让每一个开发者都拥有会进化的编程认知内核*
