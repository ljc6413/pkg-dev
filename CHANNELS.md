# 分发渠道指南（CHANNELS.md）· 无 GitHub 版

> 发布产物：`pkg-dev-release-v1.0.0.zip`（自包含） / Git 仓库 `pkg-dev-repo`（本地 main，可日后推送）
> 当前环境：**无 GitHub 账号/远程地址** → 分发走本地/内网/即时通讯渠道，GitHub 作为后续可选项。

---

## 渠道一：本地分发（现在就能用）

**唯一需要做的是：把 zip 发给别人。**

```
D:\dsh\pkg-dev-release-v1.0.0.zip   （225.8 KB，自包含）
```

接收方拿到 zip 后：
1. 解压
2. `node bootstrap-install.mjs --dry-run` 预览安装计划
3. 按计划在 DSH 会话执行 → 3 分钟部署完成

**传送方式**（任选）：
- 微信/QQ 文件传输（小包 225KB 很方便）
- 网盘链接（百度/阿里/腾讯）
- 企业内网共享盘 / 邮件附件
- U 盘拷贝（离线团队）

## 渠道二：内网/企业分发

```bash
# 内网共享
copy pkg-dev-release-v1.0.0.zip \\server\share\yihe\
# 或私有 npm（Verdaccio/Nexus，需账号）
npm login --registry http://<内网>:4873
npm publish --registry http://<内网>:4873
```

- 配合企业版 `ENT-` 许可，离线部署无外网依赖
- 埋点回传走内网静态收集（见渠道四）

## 渠道三：即时通讯/社区（零基础设施）

- **群文件**：技术群/开发者群发 zip + 使用说明（RELEASE.md 直接可用）
- **公众号/知乎文章**：发"会进化的编程认知内核"介绍 + 网盘链接
- **演示录屏**：3 分钟安装 + 一次决策演示，比文字更有说服力

## 渠道四：埋点回传（无服务器方案）

| 方式 | 说明 |
|---|---|
| **静态收集（推荐 MVP）** | 用户跑 `telemetry-export.mjs` → 把 `telemetry-*.json` 文件发回（群/网盘/邮件）→ 你用 `telemetry-merge.mjs --dir` 汇聚 |
| 网盘收件箱 | 建一个固定网盘目录收 telemetry 文件，定期下载 merge |
| 内网 HTTP（有服务器后） | 部署简单 POST 收集器自动回传 |

**隐私**：telemetry 只含匿名聚合统计（计数/命中率/拦截数），不含问题原文/决策/脚本内容——可以放心让用户回传。

---

## 后续可选项（等有账号时）

- **GitHub**：仓库已本地就绪（main + 124 文件 2 commits），届时只需：
  ```bash
  cd pkg-dev-repo
  git remote add origin https://github.com/<你的>/pkg-dev.git
  git push -u origin main
  ```
- **npm 公共包**：`@yihe/pkg-dev` 结构已就绪，`npm login && npm publish` 即可

---

## 行动清单（今天就做）

1. ✅ 复制 zip：`pkg-dev-release-v1.0.0.zip` 发给第一批试用者（3-5 人）
2. ✅ 引导他们：解压 → bootstrap-install → 使用 → 反馈
3. ✅ 收集回传：`telemetry-*.json` → `telemetry-merge.mjs --dir` 看全局报告
4. ✅ 每轮迭代：脚本池增强 / auto-secure 进化 / evolve-share 广播增量

> 不需要 GitHub 也能启动飞轮——**分发靠 zip，进化靠回传，增长靠口碑**。
