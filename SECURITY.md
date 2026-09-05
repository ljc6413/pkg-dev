# 安全策略

## 报告漏洞

发现安全问题时请**不要**公开讨论，直接联系维护者：

- 邮箱：yidev@zhiyiwei.cn
- 或在本仓库提一个 **Security Advisory**（GitHub 私密通道）

## 安全体系（四层防护）

完整文档：[docs/security-shared.md](docs/security-shared.md)

1. **问题输入侧** — `DANGER_PATTERNS`（6 类）：恶意/危险问题表述拦截
2. **资产侧** — `ASSET_PATTERNS`（9 类）：数据外泄/破坏性资产操作拦截（清库/转账/密钥导出/隧道后门等）
3. **Agent 执行层** — `AGENT_PATTERNS`（6 类）：破坏性系统操作/权限提升/注入型指令，`require_confirm` + 人类确认网关
4. **进化层** — `auto-secure.mjs`：从拦截/审计记录自主发现新攻击变体 → 固化 → 全员防护升级

## 密钥与计量

- 商业密钥签发/校验走服务端（`/api/issue-key` / `/api/validate`），密钥随机生成（16 位 hex）
- 计量按 reason 次数，超配额默认 fail-closed（不产生费用）；`allow_over` 显式才计超额
- 试用密钥过期即 fail-closed（`TRIAL_EXPIRED` + 购买引导）

## 数据与隐私

- 埋点仅匿名聚合统计（实例 id 盐化、不含问题/决策/脚本内容），见 `tools/telemetry-export.mjs`
- 服务器端台账（keys/orders/usage）仅存必要字段，管理接口需 admin token
