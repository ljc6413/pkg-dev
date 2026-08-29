# pkg-dev 编程包 × RFB 字节码经验库

> 版本：2026-08 · 关联：`pkg-dev.json`（v3.0，150 关系）→ `pkg-dev-rfb.asm` → RFB 经验库
> 目的：把编程包的**关系网编译为定长 16B 字节码**，存入意合虚拟机经验库（冷热分离），
> 让编程知识在字节码层**跨实例稳定、可分发、可三态执行**。

## 一、现状（已入库）

| 经验库 | 内容 | 指令 | 体积 | 状态 |
|---|---|---|---|---|
| `pkg-dev-full` | pkg-dev 全部 150 条关系（116 意象 + 15 场） | 150 | 2400B | ✅ 已入库可执行 |
| `pkg-dev-ts-full` | pkg-dev-ts 全部 69 条关系（86 意象 + 7 场） | 69 | 1104B | ✅ 已入库可执行 |
| `pkg-dev-py-full` | pkg-dev-py 全部 62 条关系（76 意象 + 14 场） | 62 | 992B | ✅ 已入库可执行 |
| `pkg-dev-refactor` | 重构决策示例（4 条） | 4 | 64B | ✅ 已入库可执行 |

> 三个语言栈（开发/TS/PY）关系网均已编译为 RFB 经验库——编程知识获得字节码层能力。

## 二、作用（为什么值得做）

（同前：机器码级固化 / 三态执行 / 经验复用 / 与执行层互补）

### 汇编器兼容性（坑位记录补充）

汇编器指令行正则要求 **src/dst 意象名不含空格**（`\S+` 令牌）：
- `.IMAGE 声明` 支持含空格名，但**指令行引用必须无空格**；
- 含空格意象需用无空格别名（如 `tsc 类型检查 → tsc类型检查`、`GIL 受限 → GIL受限`、
  `Python 版本 → Python版本`、`裸 except → 裸except`），声明与指令统一替换；

## 三、流水线（table → asm → lib.save → lib.vm）

### 第 1 步：导出关系网为 RFB 指令表（JSON 视图）

```text
yihe_rfb op=table namespace=开发          → 188 条（开发）/ 78 条（TS开发）
```

### 第 2 步：生成 RFB-Assembly（人类可读中间层）

操作码映射（`causal→CAUSE, condition→IF, progression→THEN, similar→LIKE,
oppose→BUT, entail→ENTAIL, support→SUPPORT, undermine→UNDERMINE, temporal→TEMP,
belong→BELONG`）。语法：

```text
.IMAGE 意象名            ← 先声明意象（src/dst 必须已声明，未声明报错）
.FIELD 场名              ← 场声明（与指令 .FIELD 名称一致，去掉 #）
CAUSE 需求不明确 需求变更 .WEIGHT 0.8 .FIELD 需求
SUPPORT 重构 代码可读性 .WEIGHT 0.7 .FIELD 编码
```

> 坑位记录：`.FIELD` 声明与指令行的场名必须**完全一致**（本项目统一去掉 `#` 前缀，
> 如 `#编码 → 编码`），否则报「未声明场」；`#` 开头注释行不可用于场名。

### 第 3 步：编译入库

```text
yihe_rfb op=lib.save name=pkg-dev-full content=<RFB-Assembly 文本>
→ 经验库已入库：pkg-dev-full（150 条指令，2400B）
```

### 第 4 步：字节码三态执行

```text
yihe_rfb op=lib.vm name=pkg-dev-full input=重构 fields=["编码"]
→ RFB 库[pkg-dev-full]：success（0x01，激活 3）
```

实测激活矩阵：

| 库 | 输入 | 场 | 结果 |
|---|---|---|---|
| pkg-dev-full | 重构 | 编码 | success 0x01 · 激活 3 |
| pkg-dev-full | 辩证推演 | 理论+双链 | success 0x01 · 激活 4 |
| pkg-dev-full | 漏洞 | 安全 | success 0x01 · 激活 2 |
| pkg-dev-ts-full | any | TS | success 0x01 · 激活 2 |
| pkg-dev-py-full | GIL受限 | 并发 | success 0x01 · 激活 3 |

## 四、维护

- **重新生成**：改 `pkg-dev.json` 后重跑第 2~3 步（`pkg-dev-rfb.asm` 为已生成源，可复用）；
- **删除条目**：`yihe_rfb op=lib.remove id=<库id>`；
- **查看**：`yihe_rfb op=lib.list`；
- **跨实例**：字节码语义指纹稳定 → merge/分发不冲突（v1.22 merge 语义同源）。

## 五、进阶：转二进制

`lib.save` 内部自动完成 asm→16B 二进制；也可独立 `op=asm` 取 hex、`op=disasm` 还原、
`op=vm` 对二进制执行（与 JSON `op=exec` 语义等价，v0.6 F2 已验证）。
