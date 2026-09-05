# server-dashboard · 运营增长仪表盘

线上地址：https://www.zhiyiwei.cn/ops（公开页面，数据接口需 admin token）

| 文件 | 说明 |
|---|---|
| `ops.html` | 仪表盘页面（零第三方依赖，内联 CSS/JS）：KPI 卡片、转化漏斗、访问 30 天趋势、回传 7 天趋势、GitHub 增长卡、试用临期清单、最近回传、运营快照明细；60s 自动刷新；token 经 `?token=` 或会话存储 |
| `ops-snapshot.mjs` | 快照聚合器（cron 每 10 分钟）：sudo 读 nginx access.log（访问/下载/API + 30 天趋势）→ 合并 keys/orders/usage 台账、telemetry 回传目录、GitHub REST+GraphQL（仓库星标 / PR #334 / Discussion 5018 / Release 下载）→ 写 `data/ops-snapshot.json`（schema yihe-ops-snapshot-v1） |

## 服务端接口

```
GET /ops                    仪表盘页面
GET /api/ops?token=<ADMIN>  快照 JSON（未授权 403）
```

## cron（服务器）

```
*/10 * * * * sudo /usr/bin/node /opt/yihe-server/scripts/ops-snapshot.mjs >> /opt/yihe-server/data/ops-snapshot.log 2>&1
```

## 手动跑一次

```bash
sudo node /opt/yihe-server/scripts/ops-snapshot.mjs
```

> 部署位置：`/opt/yihe-server/public/ops.html` 与 `/opt/yihe-server/scripts/ops-snapshot.mjs`；
> 完整部署与运营说明见 `pkg-dev-server/DEPLOY-TENCENT.md`。
