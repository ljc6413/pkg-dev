# 贡献指南

感谢你对 pkg-dev 生态的关注！每个贡献都会让所有使用者受益（共享脚本池飞轮）。

## 可以贡献什么

1. **新领域包**（`packages/pkg-dev-*.json`）——意象/关系/脚本齐全，参考现有包结构
2. **新脚本**（包内 `scripts`）——高频问题的模板化决策，命中即 0 token
3. **安全模式**（`DANGER_PATTERNS` / `ASSET_PATTERNS` / `AGENT_PATTERNS` 变体）
4. **工具改进**（`tools/*.mjs`）
5. **文档**（`docs/`）

## 开发流程

```bash
# 1. 检查包结构
node tools/smoke-test.mjs --selfcheck

# 2. 构建 RFB 汇编
node tools/build-pack-rfb.mjs packages/pkg-dev-xxx.json

# 3. 运行冒烟
node tools/smoke-test.mjs --rfb

# 4. 提交前：全部工具语法检查
for f in tools/*.mjs bootstrap-install.mjs; do node --check "$f"; done
```

## 提交规范

- 分支：`feat/<包或工具名>` 或 `fix/<描述>`
- Commit message：`feat(pack): 新增 xxx 领域包` / `feat(tools): xxx` / `docs: xxx`
- PR 描述包含：改动内容、验证方式（smoke 结果）、对共享脚本池的影响

## CI

push/PR 自动跑 `smoke.yml`：27 包完整性 + 55 RFB 结构 + 工具语法。**通过后才能合并。**

## 许可

贡献即同意以 Apache-2.0 授权知识资产；商业包激活逻辑见 `docs/pkg-dev-pricing.md`。
