# pkg-dev 编程开发辅助 · 商业收费方案 v1.0

> 首个商业化的 YiHe 行业包。本方案基于运行内核既有商业体系（`yihe_license`：
> PLANS 套餐表 / PRO_PACKS 白名单 / 按 reason 计量 / 超额费率 / 账单导出）设计，
> **不引入新机制**，全部用现有工具落地。实测数据来自当前运行环境。

---

## 一、定价总览（三档分层 + 超额混合）

| 档位 | 套餐 id | 价格 | 思考配额（reason/月） | 超额费率 | 目标用户 | 内容 |
|---|---|---|---|---|---|---|
| 免费体验 | `free` | ¥0 | 500 次 | —（超限即停） | 评估期开发者 | 全部 27 个编程包可体验，配额用尽 fail-closed |
| **个人版** | `pro` | **¥99/月** | 10,000 次 | ¥0.05/次 | 独立开发者 / 自由职业者 | 27 个编程包 + RFB 经验库 + 四能力进化工具 |
| **团队版** | `team` | **¥299/月** | 50,000 次 | ¥0.03/次 | 5–20 人研发团队 | 个人版全部 + 多消费方计量 + 团队审计 |
| 企业定制 | `enterprise` | 定制 | 不限量 | — | 企业 / 平台方 | 定制包 + host 共享 + SLA + 离线部署 |

> 设计原则：**订阅保证可预期成本，超额按量兜底弹性**。个人版 ¥99 卡位开发者心理价位；
> 团队版 ¥299 与个人版 3 倍价差、5 倍配额，鼓励向上转化；企业版定制走商务。

---

## 二、计量口径（什么算一次"思考"）

| 渠道 | 计数键 | 是否计费 | 说明 |
|---|---|---|---|
| 完整推演 | `usage.reason` | ✅ 计费 | `yihe_reason` / `yihe_think` 每次 +1（配额与超额唯一计费口径） |
| **脚本预匹配短路** | `usage.script` | ❌ 免费 | **`script_hit_threshold` 开启后**，命中高分脚本直接返回模板结论（gateway=script_hit，0 token）——本地优先核心省钱通道 |
| RFB 经验库执行 | `usage.rfb` | ❌ 免费 | 本地字节码 VM（`lib.vm`），0 token 成本 → **引导用户走本地优先省成本** |
| 脚本预匹配（未短路） | `usage.script` | ❌ 免费 | 本地脚本池匹配（记录用，不短路） |
| 执行动作 | `executions` | ❌ 免费 | `yihe_exec` 计划/推进/报告 |
| 编织/意象/关系 | `usage.weave` | ❌ 免费 | 知识资产操作 |

**实测现状**：130 次 reason（计费）/ 151 次 RFB / 23 次脚本——本地渠道占比高，
意味着真实成本远低于名义调用量，是"本地优先"策略的商业化卖点。

---

## 三、密钥与激活体系

```
密钥格式：<前缀>-<随机 32 位>   （≥8 位校验，前缀决定档位）
  PRO-xxx…  → 个人版（pro）    现有 activateLicense 已支持
  TEAM-xxx… → 团队版（team）   需在 PLANS 增补 team 档（见第六节落地步骤）
  ENT-xxx…  → 企业版（enterprise）现有支持，升企业版
```

激活链路（已实测跑通）：`yihe_license op=activate pack_id=<包id> key=<密钥>` →
`recordAudit('license.activate')` 留痕 → 状态文件持久化（重启不丢）。

**包粒度与档位关系**：28 个商业包（pkg-finance-pro + 27 编程包）任一激活即把消费方
升到对应档位（`tierOf` 取最高：enterprise > pro）。建议首个包按 **pkg-dev 全家桶**售卖
（27 包打包价），而非单包拆分——单包定价会稀释"编程开发辅助"的整体价值。

---

## 四、账单与对账

`yihe_license op=export` 输出结构化账单（实测）：1 消费方 / 130 次思考 / 计费 ¥99（月费内）。

```
{
  "generated_at": <ts>,
  "currency": "CNY",
  "total_reason_calls": 130,
  "consumers": {
    "session:default": {
      "tier": "pro", "reason": 130, "weave": 0, "rfb": 151, "script": 23,
      "quota": 10000, "over": 0, "est_cost": 99
    }
  }
}
```

**计费公式**（`estimate` 现成实现）：
```
费用 = 月费 + max(0, 实际 reason − 配额) × 超额费率
例：个人版单月 12,000 次 → ¥99 + 2000×0.05 = ¥199
例：团队版单月 55,000 次 → ¥299 + 5000×0.03 = ¥449
```

**对账流程**：每月末 `export` → 与支付平台流水核对 → 超配额消费方自动生成补缴单。

---

## 五、优惠与增长策略（建议）

| 策略 | 说明 |
|---|---|
| 免费转付费 | free 500 次体验满 → fail-closed 提示 + 一键激活入口（降摩擦） |
| 年度折扣 | 年付 8 折（¥950/年 个人版），现金流前置 |
| 首包优惠 | 首个商业包（pkg-dev）首月 5 折 ¥49.5，验证付费意愿 |
| 团队试用 | 团队版 14 天全功能试用密钥（TEAM-TRIAL-xxx，激活即计时） |
| 本地优先降本 | 向用户证明 RFB/脚本本地执行省钱 → 提升续费意愿（token-save.mjs 出报告） |
| 推荐奖励 | 老用户推荐新用户，各得 1000 次超额额度 |

---

## 六、落地步骤（现成机制 → 需增补项）

**已就绪（无需改动）**：
1. ✅ 三档套餐表 `PLANS`（free/pro/enterprise）
2. ✅ 28 包 `PRO_PACKS` 白名单 + 激活/审计/持久化
3. ✅ 按 reason 计量 + 超额计费 `estimate` + 账单 `export`
4. ✅ 配额控制 `quotaFor`（超限 fail-closed，`allow_over` 可放行）

**已落地（团队版 team 档，2026-08-29 完成）**：
1. ✅ `PLANS` 增 `team` 档：`{ id: 'team', name: '团队版', price: 299, reason_quota: 50000, over_rate: 0.03, note: '5-20 人团队；超额 ¥0.03/次' }`
   - 三处同步：内置插件 `index.js`（51 行）、工作区 `yihe-shared-static-fixed.js`、Rust `gateway/src/license.rs` `plans()`
2. ✅ `activateLicense` 密钥前缀映射：`TEAM-` → tier `team`（三处）
3. ✅ `tierOf` 升序链加 `team`：enterprise > team > pro > free（三处）
4. ✅ 密钥格式文案更新：`≥8 位，PRO-/TEAM-/ENT- 前缀`（三处）
5. ✅ Rust 测试更新：新增 TEAM- 映射断言 + plans 索引断言 + 持久化计数断言（`cargo test -p gateway license` 通过）
6. ✅ 团队多消费方：`usage` 已按 consumer 键控，天然支持多消费方隔离计量

> 生效方式：内置插件改动需 DSH 重启后生效；工作区文件与 Rust 网关改动随对应构建部署生效。
> 验证：重启后 `yihe_license op=plans` 应显示四档（免费/专业/团队/企业）；`TEAM-xxx` 密钥激活后
> `yihe_license op=status` 显示 tier=team、quota=50000。

---

## 七、风险与合规要点

- **计量公平**：reason 是唯一计费口径，需在 SDK/文档中明示"思考"定义，避免争议
- **密钥安全**：离线签名验证为演示实现；生产应上服务端签发 + 在线校验（README 已注明）
- **超额兜底**：默认 fail-closed 防恶意刷量；`allow_over=true` 才计超额——默认安全
- **数据归属**：企业版定制包的知识资产归企业所有，需在合同中明确
- **审计留痕**：所有激活/计量操作已入 `yihe_admin op=audit`，满足企业治理要求

---

## 八、FAQ

**Q: 免费版能用到什么？** 全部 27 个编程包可体验，500 次 reason/月，超限自动停（不产生费用）。

**Q: 超额了会怎样？** 默认 fail-closed（拒绝新思考）；调用方显式 `allow_over=true` 才按 ¥0.05/次（pro）计费。

**Q: RFB 经验库和脚本算钱吗？** 不算。本地字节码执行 0 成本，鼓励用户用 `token-save.mjs` 规划本地优先。

**Q: 一个密钥能几个人用？** 个人版限单消费方；团队版按 consumer 隔离多消费方计量；企业版不限。

**Q: 怎么从 pro 升 team？** 激活 TEAM- 密钥即覆盖（tierOf 取最高），当月配额立即切换，无需退订。

**Q: 这个方案怎么落地到代码？** 见第六节——个人版/企业版零改动，团队版约 5 处增补点（约 30 分钟）。

---

*方案版本 v1.0 · 2026-08-29 · 基于运行内核实测（130 reason / 151 rfb / 23 script / 28 许可）*
*配套工具：`self-learn.mjs`（用量复盘）、`token-save.mjs`（成本审计）、`evolve-tools.md`（进化循环）*
