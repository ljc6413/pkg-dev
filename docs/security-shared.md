# 共享机制安全加固（§20.4）

> 背景：YiHe 编程包生态采用"越多越省"共享机制（共享脚本池 295+ / RFB 库 57 / delta 包跨实例同步 / 反馈权重学习）。
> 共享放大攻击面——知识资产侧的威胁与问题输入侧同等重要。本文档定义威胁模型与已落地的防护。

---

## 一、威胁模型（四类攻击面）

| # | 攻击面 | 攻击方式 | 影响 | 落地前防护 |
|---|---|---|---|---|
| ① | **脚本池投毒** | 注入含恶意指令的脚本模板（rm -rf / 外传数据 / 后门 / 提示注入） | 短路命中 → 恶意内容分发给所有开发者 | ❌ 无 |
| ② | **反馈权重操纵** | 批量 adopted 弱路径 / 毒化关系权重 | 关系网被污染，推演质量系统性下降 | ❌ 无 |
| ③ | **delta 供应链** | 恶意 delta 包导入（携带恶意意象/关系/脚本） | 知识资产被注入，随共享扩散 | ❌ 无 |
| ④ | **标签污染** | 恶意 tags 抬高命中率 | 恶意脚本被更频繁命中 | ❌ 无 |

> 现有 `yihe_sec`（§20.2/§20.3）覆盖**问题输入侧**（DANGER_PATTERNS：删除/转账/攻击/伪造等 6 类 + 语义免疫链 + 蜜罐），
> 但完全未覆盖**知识资产侧**——这是共享机制引入的新缺口。

---

## 二、已落地防护（§20.4）

### 2.1 知识资产专属危险模式 `ASSET_PATTERNS`

| id | 名称 | 覆盖 |
|---|---|---|
| `asset-exec` | 命令注入 | rm/del/drop/truncate/shutdown/format/eval/exec + 参数；DROP TABLE；DELETE FROM；rm -rf |
| `asset-exfil` | 数据外泄 | 窃取/泄露/外传/上传/发送 + 数据/密码/密钥/token/session（**双向顺序**）；dump credentials；curl+password |
| `asset-backdoor` | 后门植入 | 后门/木马/反向 shell/reverse shell/nc -e/powershell download |
| `asset-prompt` | 提示注入 | 忽略(之前/以上/系统)指令；输出原始/内部 prompt/指令/system |

### 2.2 入库拦截点（3 处）

| 入口 | 防护 | 拦截行为 |
|---|---|---|
| `addScript`（脚本入库） | 扫描 scenario+template | 命中 → 拒绝入库 + 审计 `sec.asset_block` |
| `upsertImago`（意象入库） | 扫描 content+tags | 命中 → 拒绝入库 + 审计 |
| `applyPack`（delta/包导入） | 经 addScript/upsertImago 自动覆盖 | 恶意包整体拒绝 |

### 2.3 短路前置扫描（运行时）

`scriptHit` 短路返回前对模板 `secScanAsset`——即使恶意脚本绕过入库检查（如旧数据），
短路命中时仍会被拦截并降级为完整推演（不返回恶意内容）。

---

## 三、验证结果

| 用例 | 结果 |
|---|---|
| 命令注入（rm -rf / DROP TABLE / eval exec） | 🚫 全部拦截 |
| 数据外泄（密码上传/发送到外部/窃取） | 🚫 全部拦截（双向顺序增强后） |
| 后门植入（木马/反向 shell） | 🚫 拦截 |
| 提示注入（忽略指令/输出 prompt） | 🚫 拦截 |
| 正常内容（重构/分支策略/RAII/DP 等） | ✅ 零误报（5/5 放行） |

---

## 四、边界与后续建议

- **已覆盖**：脚本/意象入库 + 短路运行时 + 审计留痕（`sec.asset_block` 入 audit）
- **建议后续**：
  1. **反馈限流**：同一 decision 高频反馈节流（防权重毒化刷量）
  2. **delta 包签名**：生产环境对 delta 包做来源签名校验（当前为演示实现）
  3. **Rust gateway 同步**：Rust 侧 `addScript`/`applyPack` 加同等扫描（当前 JS 层已覆盖运行时主力）
  4. **信任标记**：脚本增加 `source` 字段（builtin/user/imported），imported 来源降信任级
  5. **威胁情报**：`yihe_sec op=attacks` 观察资产拦截记录，持续补充 ASSET_PATTERNS

---

## 五、安全自主进化（§20.5）

> 安全防护机制本身也遵循"越用越强"：拦截记录 → 变体发现 → 模式固化 → 覆盖更广。

### 5.1 进化循环（auto-secure.mjs）

```
拦截/审计记录 → 变体启发扫描 → 新攻击模式提案 → 合入 ASSET_PATTERNS/DANGER_PATTERNS → 拦截新变体
```

**工具**：`auto-secure.mjs`（安全自主进化器）
```bash
node auto-secure.mjs                    # 进化报告（基线/拦截/变体线索）
node auto-secure.mjs --patch out.json   # 生成危险模式补丁提案（可跨实例共享）
node auto-secure.mjs --scan-text "<文本>" # 进化式扫描（现有模式 + 变体启发）
node auto-secure.mjs --audit            # 拦截摘要
```

### 5.2 已固化的进化成果（ASSET_PATTERNS 4→9 类）

| 进化新增模式 | 覆盖变体 | 来源 |
|---|---|---|
| `asset-db-destroy` | 清库/清表/重置数据库 | auto-secure 变体启发 |
| `asset-crypto-transfer` | USDT/BTC/ETH/钱包转账 | 同上 |
| `asset-key-exfil` | 导出密钥/私钥/证书 | 同上 |
| `asset-tunnel-backdoor` | ssh 隧道/代理穿透 | 同上 |
| `asset-file-exfil` | 整仓源码/项目上传外传 | 同上 |
| `asset-prompt` 增强 | 越狱/DAN/跳过安全检查 | 同上 |

### 5.3 进化闭环实测

```
进化前：7 类新型攻击（清库/加密转账/密钥导出/隧道/越狱/跳过检查/文件外传）→ 0/7 拦截
进化后：合入 auto-secure 发现的变体模式 → 7/7 拦截（+7 新变体覆盖）
```

### 5.4 进化共享

- `sec-patch.json`（补丁提案）格式与 pack 兼容，可通过 `yihe_pack import` 分发
- 攻击指纹库（secAttacks）可随状态文件导出，配合 `evolve-share.mjs` 跨实例同步
- 建议：新攻击变体 → auto-secure 生成补丁 → 广播给所有实例 → 全员防护升级

---

## 六、AI Agent 执行层护栏（§20.6）

> Agent 特有攻击面在**执行层**（自主循环/计划/工具调用）——决策层防护无法覆盖"Agent 计划执行危险操作"。
> §20.6 在执行层加护栏：危险动作标记 → 人类确认网关。

### 6.1 AGENT_PATTERNS（执行层危险动作 6 类）

| id | 名称 | 覆盖 |
|---|---|---|
| `agent-destroy` | 破坏性系统操作 | 删除/清空/格式化/重置 数据库/磁盘/服务器/生产；rm -rf；DROP TABLE |
| `agent-priv` | 权限提升 | 提权/sudo/root/管理员权限/绕过权限/越权访问 |
| `agent-exfil` | 数据外泄动作 | 导出/上传/发送 全部数据/密码/密钥/源码/私钥；curl+password |
| `agent-net` | 危险网络动作 | 关闭/禁用防火墙/WAF；ssh 隧道穿透；开放全部端口 |
| `agent-inject` | 注入型指令 | eval/exec/system(；rm/shutdown/reboot 拼接 |
| `agent-prompt` | Agent 提示注入 | 忽略/无视规则；"你不需要遵守"；输出原始 prompt |

### 6.2 护栏链路

```
planExecution：每步动作 secScanAction → 危险动作标记 require_confirm + 审计 sec.agent_guard
advancePlan：require_confirm 步骤无 confirmed=true → 拦截 + 审计 sec.agent_block
人类确认：confirmed=true 显式确认 → 放行执行
```

### 6.3 闭环实测

```
危险动作 7/7 拦截：删除生产库/清空日志/获取root/导出源码/关闭防火墙/eval注入/忽略规则
人类确认放行：confirmed=true → 通过
正常动作 0/5 误报：重构/单测/测试套件/提交/性能报告
```

### 6.4 与既有安全层协同

| 层 | 覆盖 | 工具 |
|---|---|---|
| 问题输入侧 | DANGER_PATTERNS 6 类 + 语义免疫 + 蜜罐 | `yihe_sec scan` |
| 知识资产侧 | ASSET_PATTERNS 9 类 + 入库拦截 + 短路前置 | `secScanAsset` |
| **Agent 执行层** | **AGENT_PATTERNS 6 类 + 危险动作确认网关** | **`secScanAction`** |
| 进化层 | auto-secure 持续发现新变体 → 固化 | `auto-secure.mjs` |

---

## 七、操作

```text
# 查看安全状态
yihe_sec op=status
# 查看危险模式库（6 问题侧 + 4 资产侧）
yihe_sec op=patterns
# 查看攻击/拦截指纹
yihe_sec op=attacks
# 审计拦截记录
yihe_admin op=audit → 过滤 sec.asset_block
```

*文档 v1.0 · 2026-08-29 · 配套 `pkg-dev-pricing.md`（商业方案，信任与合规章节）*
