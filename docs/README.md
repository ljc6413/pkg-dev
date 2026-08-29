# YiHe Kernel 行业模板包（工作区持久层）

> 动态 Cordis 插件的状态**不跨进程存活**（DSH 重启即清空）。本目录的工作区 JSON 就是
> YiHe Kernel 的**持久化层与分发介质**：知识资产存在文件里，插件随用随导。

## 一、包清单

| 文件 | 包 id | 行业 | 命名空间 | 来源 |
|---|---|---|---|---|
| `pkg-life.json` | pkg-life | 综合 | 通用 | 内置包落盘（v1.1.0） |
| `pkg-commute.json` | pkg-commute | 交通 | 通勤 | 内置包落盘（v1.1.0，**已补全意象**） |
| `pkg-dining.json` | pkg-dining | 餐饮 | 餐饮 | 内置包落盘（v1.1.0，**已补全意象**） |
| `pkg-medical.json` | pkg-medical | 医疗 | 医疗 | 企业定制示例 |
| `pkg-law.json` | pkg-law | 法律 | 法务 | 企业定制示例 |
| `pkg-dev.json` | pkg-dev | 软件开发 | 开发 | 编程开发辅助 v3.0（118 意象/150 关系/30 脚本，含 YiHe 方法论） |
| `pkg-dev-ts.json` | pkg-dev-ts | 软件开发 | TS开发 | TypeScript/Node 全栈子包（88 意象/69 关系/10 脚本） |
| `pkg-dev-py.json` | pkg-dev-py | 软件开发 | PY开发 | Python 全栈子包（78 意象/62 关系/10 脚本，pro） |
| `pkg-dev-rs.json` | pkg-dev-rs | 软件开发 | RS开发 | Rust 系统编程子包（68 意象/54 关系/10 脚本，pro） |
| `pkg-dev-go.json` | pkg-dev-go | 软件开发 | GO开发 | Go 云原生子包（66 意象/47 关系/10 脚本，pro） |
| `pkg-dev-ai.json` | pkg-dev-ai | 软件开发 | AI开发 | AI 数据工程子包（66 意象/55 关系/10 脚本，pro） |
| `pkg-dev-java.json` | pkg-dev-java | 软件开发 | JAVA开发 | Java/Spring 企业开发子包（80 意象/59 关系/10 脚本，pro） |
| `pkg-dev-ops.json` | pkg-dev-ops | 软件开发 | OPS开发 | DevOps/平台工程子包（69 意象/56 关系/10 脚本，pro） |
| `pkg-dev-db.json` | pkg-dev-db | 软件开发 | DB开发 | 数据库工程子包（68 意象/58 关系/10 脚本，pro） |
| `pkg-dev-mobile.json` | pkg-dev-mobile | 软件开发 | MOBILE开发 | 移动跨端开发子包（66 意象/54 关系/10 脚本，pro） |
| `pkg-dev-test.json` | pkg-dev-test | 软件开发 | TEST开发 | 软件测试工程子包（64 意象/55 关系/10 脚本，pro） |
| `pkg-dev-fe.json` | pkg-dev-fe | 软件开发 | FE开发 | 前端工程子包（70 意象/55 关系/10 脚本，pro） |
| `pkg-dev-sec.json` | pkg-dev-sec | 软件开发 | SEC开发 | 网络安全工程子包（70 意象/61 关系/10 脚本，pro） |
| `pkg-dev-embed.json` | pkg-dev-embed | 软件开发 | EMBED开发 | 嵌入式 IoT 子包（67 意象/57 关系/10 脚本，pro） |
| `pkg-dev-agent.json` | pkg-dev-agent | 软件开发 | AGENT开发 | **Agent 智能体工程**（73 意象/63 关系/10 脚本，pro，创新领域） |
| `pkg-dev-cpp.json` | pkg-dev-cpp | 软件开发 | CPP开发 | C/C++ 系统级开发子包（67 意象/46 关系/10 脚本，pro） |
| `pkg-dev-dotnet.json` | pkg-dev-dotnet | 软件开发 | DOTNET开发 | .NET/C# 企业开发子包（69 意象/45 关系/10 脚本，pro） |
| `pkg-dev-git.json` | pkg-dev-git | 软件开发 | GIT开发 | Git 版本管理工程子包（48 意象/33 关系/10 脚本，pro） |
| `pkg-dev-bigdata.json` | pkg-dev-bigdata | 软件开发 | BD开发 | 大数据/湖仓/流计算子包（60 意象/46 关系/10 脚本，pro） |
| `pkg-dev-game.json` | pkg-dev-game | 软件开发 | GAME开发 | 游戏引擎开发子包（53 意象/38 关系/10 脚本，pro） |
| `pkg-dev-algo.json` | pkg-dev-algo | 软件开发 | ALGO开发 | 算法与数据结构核心子包（60 意象/45 关系/10 脚本，pro） |
| `pkg-dev-arch.json` | pkg-dev-arch | 软件开发 | ARCH开发 | 软件架构与 DDD 子包（48 意象/33 关系/10 脚本，pro） |
| `pkg-dev-design.json` | pkg-dev-design | 软件开发 | DESIGN开发 | 设计模式与 SOLID 子包（49 意象/44 关系/10 脚本，pro） |
| `pkg-dev-net.json` | pkg-dev-net | 软件开发 | NET开发 | 网络编程子包（53 意象/40 关系/10 脚本，pro） |
| `pkg-dev-os.json` | pkg-dev-os | 软件开发 | OS开发 | 操作系统/并发子包（51 意象/36 关系/10 脚本，pro） |
| `pkg-dev-perf.json` | pkg-dev-perf | 软件开发 | PERF开发 | 性能工程子包（49 意象/40 关系/10 脚本，pro） |
| `pkg-dev-evolve.json` | pkg-dev-evolve | 软件开发 | EVOLVE开发 | **编程包自主进化**：自主扩展/自主学习/省 token/进化共享方法论（32 意象/35 关系/10 脚本，pro） |
| `pkg-dev-rfb.asm` | — | — | — | pkg-dev 关系网编译的 RFB-Assembly 源（→ `yihe_rfb lib.save` 入库） |
| `pkg-dev-ts-rfb.asm` | — | — | — | pkg-dev-ts → RFB 汇编源（69 指令） |
| `pkg-dev-py-rfb.asm` | — | — | — | pkg-dev-py → RFB 汇编源（62 指令） |
| `pkg-dev-rs-rfb.asm` | — | — | — | pkg-dev-rs → RFB 汇编源（54 指令） |
| `pkg-dev-go-rfb.asm` | — | — | — | pkg-dev-go → RFB 汇编源（47 指令） |
| `pkg-dev-ai-rfb.asm` | — | — | — | pkg-dev-ai → RFB 汇编源（55 指令） |
| `pkg-dev-java-rfb.asm` | — | — | — | pkg-dev-java → RFB 汇编源（59 指令） |
| `pkg-dev-*-scripts.asm` | — | — | — | 各包脚本场景 → RFB 场景库源 |
| `pkg-dev-meta.asm` | — | — | — | 正反合决策模板 + 跨栈类比库源（46 指令，含 11 新领域跨域类比） |
| `pkg-dev-*-rfb.asm` / `*-scripts.asm`（11 新包） | — | — | — | cpp/dotnet/git/bigdata/game/algo/arch/design/net/os/perf 关系网+场景汇编源 |

> 编程包 RFB 经验库用法见 `pkg-dev-rfb.md`（table→asm→lib.save→lib.vm 流水线 + 实测激活矩阵）。
> **重启恢复**：`pkg-dev-restore-checklist.md`（包→经验库→许可→命名空间一键恢复 + 冒烟 + 排障）。
> **版本/变更**：`CHANGELOG.md`；**一键构建**：`build-pack-rfb.mjs`；**冒烟**：`smoke-test.mjs`。
> **生态集成**：`pkg-dev-ecosystem.md`（CI 规范检查 + 多 Agent 协作）。
> **商业收费**：`pkg-dev-pricing.md`（首个商业包三档定价方案——订阅+超额混合/计量口径/密钥体系/账单对账/落地步骤）。
> **使用汇总**：`usage-report-20260829.md`（开发者使用全景/领域热度/脚本短路成效/省钱量化/加速建议）。
> **共享安全**：`security-shared.md`（共享机制威胁模型/ASSET_PATTERNS 资产扫描/入库拦截/短路前置防护）。
> **工具链**：`graph-viz.mjs`（关系网 → Mermaid/HTML/DOT 可视化 + 关系统计）、`auto-smoke.mjs`（自动派生冒烟用例 + 报告）、`pack-merge.mjs`（多包合并为复合包）。
> **进化工具链**：`auto-expand.mjs`（自主扩展——知识缺口检测 → 补丁提案）、`self-learn.mjs`（自主学习——决策/反馈/奖惩洞察 + 沉淀建议）、`token-save.mjs`（省 token——本地优先策略量化审计）、`evolve-share.mjs`（进化共享——基线 vs 运行态 diff → delta 增量包 → 跨实例 merge）。用法与进化循环见 `evolve-tools.md`。

> **数据修正说明**：插件内置的 `pkg-commute` 缺少意象「早高峰」、`pkg-dining` 缺少「用餐」「外卖」，
> 导致对应关系加载时被静默跳过。本目录的落盘版本已补全意象；导入后关系网完整。
> 修正方式是**导入覆盖**（同命名空间合并：先补意象，再建关系），无需改插件代码。

## 二、格式规范（与 `yihe_pack export` 输出一致）

```json
{
  "id": "pkg-medical",              // 必填：包唯一 id
  "name": "医疗健康",               // 显示名
  "industry": "医疗",               // 行业分类
  "version": "1.0.0",               // 语义化版本
  "namespace": "医疗",              // 必填：导入后进入的命名空间
  "owner": "enterprise",            // 归属方（企业治理字段）
  "imagos": [                       // 意象库（原子概念）
    { "content": "发烧", "kind": "state", "category": "medical",
      "tags": ["症状"], "modality": "sensor", "confidence": 1 }
  ],
  "relations": [                    // 关系网（**from/to 必须是 imagos 的 content**）
    { "from": "发烧", "to": "急诊", "type": "condition",
      "weight": 0.9, "directed": true, "context_tag": "#紧急" }
  ],
  "scripts": [                      // 脚本池（决策模板）
    { "scenario": "夜间发烧怎么办", "tags": ["医疗", "发烧"],
      "template": "38.5°C 以下先观察；持续高烧立即急诊；预留复诊接口" }
  ]
}
```

字段约束：
- `relations.from / to`：写**意象内容**（content），导入时自动解析为意象 id；引用了不存在的意象则该关系被跳过——所以**先列全 imagos 再写 relations**；
- `type`：`causal / entail / similar / oppose / temporal / belong / support / undermine / condition / progression`；
- `context_tag`：语境标签（如 `#紧急`），语境场修剪的输入；
- 任意字段缺失则取默认值（kind 自动推断、weight 0.6、directed true、namespace 通用）。

## 三、使用流程（会话内导入）

1. 读取文件（用 `read` 工具）：`read file_path: yihe-packs/pkg-medical.json`
2. 导入：`yihe_pack` `op=import` `content=<上一步读到的 JSON 文本>`
3. 激活（切换到该行业命名空间）：`yihe_pack` `op=activate` `id=pkg-medical`
4. 之后 `yihe_reason` 即在该行业关系网上推演；管理操作自动记入 `yihe/audit`

> 一次性加载多个包时注意命名空间：同命名空间 = 合并（互补知识），不同命名空间 = 隔离（行业专属）。
> 激活包 = 切换命名空间 = 切换整套认知基底。

## 四、创建企业定制包

1. 从本目录任选一个包作为模板（或 `yihe_pack op=export id=xxx` 导出运行中的包）；
2. 替换 imagos / relations / scripts 为行业知识，遵守第二节的字段约束；
3. 保存为新 JSON 文件（如 `pkg-logistics.json`），按第三节流程导入激活；
4. 用 `yihe_admin` `op=audit` 追踪谁在何时加载/激活了哪个包（企业治理）。

## 五、引擎配置（yihe_admin config）

| 键 | 默认 | 含义 |
|---|---|---|
| fanout | 8 | 激活扩散每层最大分支 |
| depth | 6 | 最大扩散深度（蓝图目标 3 度） |
| theta | 0.3 | 激活度剪枝阈值 |
| damping | 0.8 | 激活衰减系数 |
| max_paths | 64 | 单周期路径上限 |
| eps_tie | 0.05 | 辩证平局阈值（触发翻转/留白） |
| script_threshold | 0.15 | 脚本匹配阈值 |
| default_stake | 0.5 | 默认影响度 |
| default_cost | 0.5 | 默认代价 |

设置示例：`yihe_admin` `op=config` `action=set` `key=theta` `value=0.25`（写入审计）。

## 六、重启恢复（bootstrap）

DSH 进程重启后插件需重建（`@yihe` 动态插件不跨进程存活）。恢复路径：
1. 重新定义并运行插件（Host-only 包）；
2. 按第三节流程导入本目录全部包；
3. `yihe_pack activate pkg-xxx` 恢复现场。

## 七、商业包与许可（开放核心模式）

- **免费包**：`pkg-life / pkg-commute / pkg-dining`（开源核心自带，无需许可）；
- **商业包**：`pkg-finance-pro` / `pkg-dev` 及全部 26 个编程子包（ts/py/rs/go/ai/java/ops/db/mobile/test/fe/sec/embed/agent/cpp/dotnet/git/bigdata/game/algo/arch/design/net/os/perf）（`tier: pro, license_required: true`）——需先激活许可证：
  `yihe_license op=activate pack_id=<包id> key=PRO-xxxx…`（≥8 位，PRO-/ENT- 前缀；ENT- 前缀升企业版），再 `yihe_pack load/import` 并激活；
  > 注：`pkg-dev` 系（26 个编程包）的商业许可已加入运行插件与 Rust 网关的 `PRO_PACKS`，**DSH 重启后生效**；重启前激活会报「非商业包」。
- **按量计费**：`yihe_license op=usage` 查看用量（每次思考 = 一次 reason 调用；模型驱动调用自动计量）；
  超额默认 fail-closed，`allow_over=true` 按超额费率计费；`yihe_license op=export` 导出账单 JSON 供结算对账；
  其他插件经 `yihe.commerce.metered` 服务按量付费调用（配额见 `yihe_license op=plans`）。
- 商业包由 YiHe Labs 签发许可证密钥（生产环境为离线签名验证 + 在线校验，本仓库为演示实现）。
