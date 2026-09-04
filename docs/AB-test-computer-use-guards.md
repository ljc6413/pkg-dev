# A/B 对照测试方案：YiHe 护栏脚本 vs Computer Use 执行准确性

> 目标：用可复现数据回答"开发 ns 的 8 条 computer-use 护栏脚本是否降低了 computer-use 任务的失败率/重试次数"
> 状态：方案已定稿，执行需在用户在场、任务获批时逐轮发起

## 1. 假设与指标

- H0：护栏脚本不改变任务成功率与尝试次数；H1：护栏组成功率更高、尝试更少。
- 主指标：① 任务成功率（最终答案正确）② 每任务动作尝试次数（观察+动作工具调用数）
- 次指标：③ 工具错误数（element not found / observation 失效 / 空白截图 / 坐标越界）④ 完成时间 ⑤ token 消耗 ⑥ 护栏命中率（仅 B 组）

## 2. 任务集（Windows 原生、可验证、低风险）

| # | 任务提示词（逐字使用） | 成功判据 |
|---|---|---|
| T1 | 用 Computer Use 打开计算器窗口，计算 19 × 7，报告结果。不要操作其他应用。 | 报告"133"且未操作其他应用 |
| T2 | 用 Computer Use 打开记事本，输入 `guard-ab-2026`，保存到 `D:\dsh\ab-runs\out\<run>.txt` 后关闭。 | 文件内容逐字正确 |
| T3 | 用 Computer Use 唤起系统托盘里的记事本窗口（若在托盘），输入 `ok` 并报告。 | 窗口中出现 ok |

每轮只跑一个任务，避免跨任务学习污染。

## 3. 实验设计：ABAB 反转

护栏脚本已在开发 ns 生效，无法回退到"从未存在"的基线，故用反转设计：

| 阶段 | 条件 | 任务×轮次 |
|---|---|---|
| A1 | 对照组：临时移除 8 条 computer-use 护栏脚本 | T1×3, T2×3 |
| B1 | 处理组：恢复 8 条脚本 | T1×3, T2×3 |
| A2 | 对照组（复测漂移） | T1×2, T2×2 |
| B2 | 处理组（复测） | T1×2, T2×2 |

- 每轮 = 独立新会话（隔离上下文），同一 preset（yihe-cognitive）、同一模型（deepseek-v4-flash）、同一工作区 `D:\dsh\ab-runs\r<轮次>`（避免文件/状态串扰）
- 环境固定：每轮前确认计算器/记事本无残留进程；桌面状态记录快照
- 执行人：每轮由用户发起"跑 A/B 第 X 轮 T_Y <Control|Guard>"，由一个背景子代理独立完成并回报结构化结果

## 4. 每轮回报 JSON（执行代理必须输出）

```json
{
  "round": "A1-1", "task": "T1", "arm": "control",
  "success": true, "final_answer": "133",
  "attempts": 6, "tool_errors": [{"tool": "computer_click", "error": "element not found"}],
  "duration_s": 95, "steps_log": ["observe", "click", "click", "type", "observe"],
  "notes": ""
}
```

## 5. 护栏命中率埋点（仅 Guard 组）

- 每轮前读 `yihe_script list`（namespace=开发）记录 8 条护栏 usage 计数；轮后复读，delta>0 记命中场景与次数
- 与步骤日志交叉：命中「computer点击前观察校验」且该轮无"过期观察错误" → 归因证据

## 6. 控制与移除脚本的操作（Control 组切换）

```
# 移（Control）：列 id → 逐个 remove
yihe_script list namespace=开发        # 记 8 条 scenario 的 id
yihe_script remove id=<computer组8条id>
# 恢复（Guard）：从 D:\dsh\yihe-packs\pkg-dev-exec-guards.json 读回 8 条 add
yihe_script add namespace=开发 scenario=... tags=[...] template=...
# 一致性检查：node D:\dsh\gen-exec-guards-pack.cjs 后 diff pack 里 8 条仍在
```
> 用 yihe_script 工具直接操作（脚本在 kernel 自动持久化）。移除会清 usage 计数——Guard 阶段以"恢复后新累计"为准。

## 7. 分析判据（事后一次性）

- 成功率：Control vs Guard（Fisher 精确检验或直接报告 3/6 vs 5/6 这类小样本原始值，不硬上 p 值）
- 尝试次数/工具错误：报告各组均值与逐轮值（Mann-Whitney 或直接目视）
- 护栏命中率 ≥ 40% 且失败集中在未命中轮 → 强证据
- 采纳门槛：Guard 在 ≥1 个任务上成功率 +20% 或尝试次数 -30%，且 B 阶段 A2 复测无反向漂移 → 判定护栏有效，保留并扩展到 kanban/评审组；否则判定效果不足并写原因

## 8. 安全与批准

- T1/T2/T3 均低风险（开窗/输入/保存到指定目录）；每轮仍按 computer use 规则在用户授权下执行，删除/发送类动作不进入任务集
- 中途桌面锁屏/窗口歧义 → 该轮标记 aborted 不计入
- 每轮后清理（关窗、删 out 文件）保持环境可复现

## 9. 产物目录

```
D:\dsh\ab-runs\
  protocol.md        # 本文件副本
  r<轮次>-<arm>-<task>\    # 每轮隔离工作区 + 回报 JSON
  results.csv        # 汇总（追加式）
  analysis.md        # 收尾一次性分析
```
