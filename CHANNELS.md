# 分发渠道指南（CHANNELS.md）

> 发布产物：`pkg-dev-release-v1.0.0.zip` / Git 仓库 `pkg-dev-repo` / npm 包 `@yihe/pkg-dev`

---

## 渠道一：GitHub 公开仓库（推荐 · 知识开源获信任）

```bash
cd pkg-dev-repo
git add -A
git commit -m "v1.0.0: YiHe 编程开发辅助发布（27 包/55 库/10 工具/商业+安全+进化体系）"
git branch -M main
git remote add origin https://github.com/<org>/pkg-dev.git
git push -u origin main
```

- **优点**：开源获信任、Issues 收集反馈、Release 管理版本、star 增长传播
- **注意**：知识资产（packages/rfb）Apache-2.0 开源；商业许可用于运行时激活，不冲突
- **发布 Release**：GitHub → Releases → 上传 `pkg-dev-release-v1.0.0.zip` + 写发布说明

## 渠道二：npm 包（开发者工具链分发）

```bash
cd pkg-dev-repo
npm login                       # 需 npm 账号（@yihe scope 需 org）
npm publish --access public     # 发布 @yihe/pkg-dev
```

- **优点**：开发者 `npm i -g @yihe/pkg-dev` 即得全部工具（bin 入口），生态集成方便
- **工具命令**：`yihe-pkg-smoke` / `yihe-pkg-expand` / `yihe-pkg-secure` / `yihe-pkg-telemetry` 等
- **注意**：包内 JSON/asm 为数据资产，发布体积约 1.4MB 可接受

## 渠道三：内部分发（企业/团队）

- **链接分发**：托管 zip 到内部 CDN/网盘，`bootstrap-install.mjs` 一键部署
- **私有 npm**：Verdaccio/Nexus 发布 `@yihe/pkg-dev`，配合企业版 `ENT-` 许可
- **离线包**：企业版可整包离线部署（含内置插件），无外网依赖

## 渠道四：社区/内容传播

- 技术文章：发布说明 → 掘金/知乎/公众号（"会进化的编程认知内核"）
- 示例项目：配一个"3 分钟跑通"的 demo 仓库
- 埋点回传：引导用户跑 `telemetry-export.mjs` 回传使用数据（匿名聚合）

---

## 回传端点建议（配合 telemetry-export）

| 方案 | 说明 |
|---|---|
| 静态收集 | 用户导出 `*.telemetry.json` → 邮件/网盘提交 → 管理员 `telemetry-merge` 汇聚 |
| HTTP 端点 | 部署简单 POST 收集器 → 自动回传（需隐私声明：匿名聚合） |
| GitHub Issues | 引导用户把 telemetry JSON 贴进专用 Issue（不适合大规模） |

**建议**：MVP 用静态收集（零基础设施），有规模后上 HTTP 端点。
隐私：telemetry 只含匿名统计（计数/命中率/拦截数），不含问题原文与决策内容。
