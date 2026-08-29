# pkg-dev 编程包重启恢复 checklist

> 目的：DSH 重启后一键恢复「编程包 → 命名空间 → RFB 经验库 → 商业许可」全链路。
> 前提：插件已按 `yihe-packs/README.md` 第六节 bootstrap 重建（@yihe 动态插件不跨进程存活）。

## 一、恢复清单总览

| 资产 | 数量 | 来源文件 | 恢复操作 |
|---|---|---|---|
| 编程包 | 27 | `pkg-dev*.json`（dev/ts/py/rs/go/ai/java/ops/db/mobile/test/fe/sec/embed/agent/cpp/dotnet/git/bigdata/game/algo/arch/design/net/os/perf/evolve） | `yihe_pack op=import content=<JSON>` |
| RFB 经验库 | 57 | `pkg-dev*-rfb.asm` / `pkg-dev*-scripts.asm` / `pkg-dev-meta.asm` | `yihe_rfb op=lib.save name=xxx content=<asm>` |
| 商业许可 | 27 | —（密钥由 YiHe Labs 签发） | `yihe_license op=activate pack_id=<id> key=PRO-xxxx…` |
| 激活命名空间 | 1 | — | `yihe_pack op=activate id=<目标包>` |

## 二、恢复步骤（按序执行）

### 第 1 步：导入编程包（27 个）

```text
read yihe-packs/pkg-dev.json          → yihe_pack op=import content=<JSON>   (开发)
read yihe-packs/pkg-dev-ts.json       → yihe_pack op=import content=<JSON>   (TS开发)
read yihe-packs/pkg-dev-py.json       → yihe_pack op=import content=<JSON>   (PY开发)
read yihe-packs/pkg-dev-rs.json       → yihe_pack op=import content=<JSON>   (RS开发)
read yihe-packs/pkg-dev-go.json       → yihe_pack op=import content=<JSON>   (GO开发)
read yihe-packs/pkg-dev-ai.json       → yihe_pack op=import content=<JSON>   (AI开发)
read yihe-packs/pkg-dev-java.json     → yihe_pack op=import content=<JSON>   (JAVA开发)
read yihe-packs/pkg-dev-ops.json      → yihe_pack op=import content=<JSON>   (OPS开发)
read yihe-packs/pkg-dev-db.json       → yihe_pack op=import content=<JSON>   (DB开发)
read yihe-packs/pkg-dev-mobile.json   → yihe_pack op=import content=<JSON>   (MOBILE开发)
read yihe-packs/pkg-dev-test.json     → yihe_pack op=import content=<JSON>   (TEST开发)
read yihe-packs/pkg-dev-fe.json       → yihe_pack op=import content=<JSON>   (FE开发)
read yihe-packs/pkg-dev-sec.json      → yihe_pack op=import content=<JSON>   (SEC开发)
read yihe-packs/pkg-dev-embed.json    → yihe_pack op=import content=<JSON>   (EMBED开发)
read yihe-packs/pkg-dev-agent.json    → yihe_pack op=import content=<JSON>   (AGENT开发)
read yihe-packs/pkg-dev-cpp.json      → yihe_pack op=import content=<JSON>   (CPP开发)
read yihe-packs/pkg-dev-dotnet.json   → yihe_pack op=import content=<JSON>   (DOTNET开发)
read yihe-packs/pkg-dev-git.json      → yihe_pack op=import content=<JSON>   (GIT开发)
read yihe-packs/pkg-dev-bigdata.json  → yihe_pack op=import content=<JSON>   (BD开发)
read yihe-packs/pkg-dev-game.json     → yihe_pack op=import content=<JSON>   (GAME开发)
read yihe-packs/pkg-dev-algo.json     → yihe_pack op=import content=<JSON>   (ALGO开发)
read yihe-packs/pkg-dev-arch.json     → yihe_pack op=import content=<JSON>   (ARCH开发)
read yihe-packs/pkg-dev-design.json   → yihe_pack op=import content=<JSON>   (DESIGN开发)
read yihe-packs/pkg-dev-net.json      → yihe_pack op=import content=<JSON>   (NET开发)
read yihe-packs/pkg-dev-os.json       → yihe_pack op=import content=<JSON>   (OS开发)
read yihe-packs/pkg-dev-perf.json     → yihe_pack op=import content=<JSON>   (PERF开发)
read yihe-packs/pkg-dev-evolve.json   → yihe_pack op=import content=<JSON>   (EVOLVE开发)
```

验证：`yihe_pack op=list` → 30 个包（含 3 内置）。

### 第 2 步：恢复 RFB 经验库（57 个）

**关系网库（27）**：每个 `pkg-dev*-rfb.asm` → `lib.save name=<包id>-full`（如 `pkg-dev-rfb.asm` → `pkg-dev-full`，150 指令；evolve → `pkg-dev-evolve`，34 指令）。

**脚本场景库（27）**：每个 `pkg-dev*-scripts.asm` → `lib.save name=<包id>-scripts`（如 `pkg-dev-scripts.asm` → `pkg-dev-scripts`）。

**元库（1）**：`read pkg-dev-meta.asm → lib.save name=pkg-dev-meta`（正反合模板 + 跨域类比库，46 指令）。

> 经验库上限：运行插件默认 `rfb_library_max=32`，**57 库会截尾丢失最老库**——恢复前先
> `yihe_admin op=config action=set key=rfb_library_max value=128`（已在运行环境执行并持久化）。
> asm 源已含 `.IMAGE/.FIELD` 声明；`lib.save` 自动汇编为 16B 字节码。
> 含空格意象已用无空格别名（tsc类型检查/GIL受限/Python版本/裸except 等）。

验证：`yihe_rfb op=lib.list` → ≥57；抽测 `lib.vm name=pkg-dev-full input=重构 fields=["编码"]` → success。

### 第 3 步：恢复商业许可（27 个）

```text
# 逐个激活：pack_id = 包清单中每个 pkg-dev*（dev/ts/py/rs/go/ai/java/ops/db/mobile/
# test/fe/sec/embed/agent/cpp/dotnet/git/bigdata/game/algo/arch/design/net/os/perf）
yihe_license op=activate pack_id=pkg-dev       key=PRO-xxxx…
yihe_license op=activate pack_id=pkg-dev-ts    key=PRO-xxxx…
…（其余 24 个同式）
yihe_license op=activate pack_id=pkg-finance-pro key=PRO-xxxx…（可选）
```

> 若报「非商业包」：确认运行插件 `PRO_PACKS` 含全部 `pkg-dev*`（内置位已更新；
> 仍报则需重启 DSH）。

验证：`yihe_license op=status` → tier=pro、quota=10000。

### 第 4 步：激活目标命名空间

```text
yihe_pack op=activate id=pkg-dev        → 开发
yihe_pack op=activate id=pkg-dev-ts     → TS开发
yihe_pack op=activate id=pkg-dev-py     → PY开发
…（26 个 pkg-dev* 均可按需激活；一次激活一个命名空间）
```

## 三、快速冒烟（恢复后 30 秒验证）

| 检查 | 命令 | 期望 |
|---|---|---|
| 包就绪 | `yihe_pack op=list` | 30 个（27 编程 + 3 内置） |
| 库就绪 | `yihe_rfb op=lib.list` | ≥57 个 |
| 字节码可执行 | `yihe_rfb op=lib.vm name=pkg-dev-full input=重构 fields=["编码"]` | success 0x01 |
| 脚本库可执行 | `yihe_rfb op=lib.vm name=pkg-dev-scripts input=重构决策 fields=["场景"]` | success 0x01 |
| 新领域库可执行 | `yihe_rfb op=lib.vm name=pkg-dev-algo-full input=算法 fields=["ALGO"]` | success 0x01 |
| 许可生效 | `yihe_license op=status` | pro / 10000 |
| 决策可用 | `yihe_reason question=「这个模块要不要重构」namespace=开发` | decided |

自动化：`node yihe-packs/smoke-test.mjs --selfcheck`（30 包完整性）/ `--rfb`（55 asm 源）。

## 四、故障排查

| 症状 | 原因 | 处理 |
|---|---|---|
| import 报「JSON 缺少 id/imagos」 | content 非合法包 JSON | 重新 read 文件后原样传入 |
| lib.save 报「未声明场/意象」 | asm 源被手工改动 | 用仓库 asm 源重试；场名去 `#`、意象名无空格 |
| activate 报「未加载包」 | 包未 import | 先执行第 1 步 |
| license 报「非商业包」 | PRO_PACKS 缺条目或插件未重启 | 核对内置位 PRO_PACKS；重启 DSH |
| reason 决策质量差 | 命名空间未激活或包未导入 | 确认 active_ns 与包清单 |

## 五、资产文件索引

```
yihe-packs/
├── pkg-dev.json … pkg-dev-perf.json      （26 个编程包 JSON）
├── pkg-dev*-rfb.asm / pkg-dev*-scripts.asm / pkg-dev-meta.asm   （RFB 源，可用 build-pack-rfb.mjs 重建）
├── build-pack-rfb.mjs        ← 一键构建（JSON→asm）
├── smoke-test.mjs            ← 冒烟套件（--selfcheck / --rfb）
├── graph-viz.mjs             ← 关系网可视化（Mermaid/HTML/DOT/统计）
├── auto-smoke.mjs            ← 自动冒烟用例生成 + 报告
├── pack-merge.mjs            ← 多包合并
├── auto-expand.mjs           ← 自主扩展（知识缺口检测 → 补丁提案）
├── self-learn.mjs            ← 自主学习（决策/反馈/奖惩洞察 + 沉淀建议）
├── token-save.mjs            ← 省 token（本地优先策略量化审计）
├── evolve-share.mjs          ← 进化共享（基线 vs 运行态 diff → delta 增量包 → merge）
├── CHANGELOG.md              ← 版本与变更
└── pkg-dev-ecosystem.md      ← CI/多 Agent 集成
```
