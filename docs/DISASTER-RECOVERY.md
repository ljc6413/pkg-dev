# YiHe 风险保护手册（DISASTER-RECOVERY）

> 目的：商业数据/代码/知识资产丢失或损坏时的恢复步骤 + 凭据清单 + 轮换提醒。
> 备份位置：本地 `D:\dsh\yihe-backups\`（服务器备份 + 本地资产，各保留 30 份）。

---

## 一、备份体系（已配置）

| 层 | 内容 | 频率 | 位置 |
|---|---|---|---|
| 服务器自动备份 | data(密钥/订单/用量/回传) + server.js + xunhupay + scripts + 内核包 + nginx 配置 + cron | 每日 3:30（cron） | `/opt/yihe-server/backups/`（保留 14 份） |
| 本地异地备份 | 拉取服务器备份 + 打包 44 包/repo/release/preset + 内置插件 | 手动执行 | `D:\dsh\yihe-backups\`（保留 30 份） |

手动异地备份命令：
```powershell
powershell -ExecutionPolicy Bypass -File D:\dsh\yihe-offsite-backup.ps1
```

## 二、恢复步骤

### 场景 1：服务器数据损坏（密钥台账/订单丢了）
```bash
# 1. 停服务
sudo systemctl stop yihe-server
# 2. 从最新备份恢复 data（替换为备份时间点，会丢该点之后的新增）
BK=$(ls -t /opt/yihe-server/backups/yihe-data-*.tar.gz | head -1)
sudo tar xzf $BK -C /opt/yihe-server
# 3. 起服务验证
sudo systemctl start yihe-server
curl https://www.zhiyiwei.cn/api/status
```
> 备选：从本地异地 `D:\dsh\yihe-backups\server\<日期>\` 上传恢复（若服务器备份也没了）。

### 场景 2：服务器代码损坏（server.js 改坏/误删）
```bash
BK=$(ls -t /opt/yihe-server/backups/yihe-code-*.tar.gz | head -1)
sudo tar xzf $BK -C /opt/yihe-server
sudo systemctl restart yihe-server
```

### 场景 3：内置插件被覆盖（升级 DSH Desktop 后 PRO_PACKS 丢了）
```powershell
# 备份副本：D:\dsh\backups\yihe-shared-index-*.js
# 或权威副本：D:\dsh\yihe-preset-dist\yihe-shared-index.js
Copy-Item 'D:\dsh\backups\yihe-shared-index-20260904-093325.js' `
  'D:\Program Files\DSH Desktop\resources\app.asar.unpacked\node_modules\@deepseek-ai\yihe-shared\index.js' -Force
# 重启 DSH 后验证：
#   PRO_PACKS 是否含 pkg-dev-growth
#   yihe_license op=status
#   yihe_reason 脚本短路
```

### 场景 4：DSH Desktop 被意外升级（更新源冻结失效）
```powershell
# 1. 恢复更新源冻结：检查 app-update.yml 是否仍为 generic 冻结态（见 D:\dsh\backups\app-update-*.yml 参考）
# 2. 恢复内置插件（场景 3）
# 3. 若新版本不兼容：回滚到备份的旧版本安装包（保留旧安装包是理想做法，建议以后升级前先下载保留）
```

### 场景 5：本地 44 包误删/损坏
```powershell
# 从异地备份恢复
$zip = Get-ChildItem 'D:\dsh\yihe-backups\local\yihe-local-assets-*.zip' | Sort-Object Name -Descending | Select-Object -First 1
# 解压 zip 里的 yihe-packs 回 D:\dsh\
```

## 三、凭据清单与轮换提醒 ⚠️

| 凭据 | 位置 | 风险 | 建议 |
|---|---|---|---|
| **GitHub token** | 对话多次明文出现 | 🔴 已泄露 | **立即 revoke 重建**；crontab 里 GH_TOKEN 同步换 |
| ADMIN_TOKEN (server) | yihe-server.service env | 🟡 对话出现 | 轮换后改 systemd + /api 调用处 |
| Xunhupay appsecret | 对话出现 | 🟡 已泄露 | 去虎皮椒后台重置 |
| OPC 账号密码 | 对话出现 | 🟡 已泄露 | OPC 站内改密 |
| SSH key (yhkclaw.pem) | 本机 | 🟢 未外发 | 保持本机 |
| yihe.key / yihe-rust.json | 本机 .dsh | 🟢 | 随备份覆盖 |

**轮换命令速查**：
```bash
# GitHub token 换新后更新 cron
crontab -e   # 改 GH_TOKEN=新token
# server ADMIN_TOKEN 换新后
sudo systemctl edit yihe-server   # 改 Environment=ADMIN_TOKEN=新值
sudo systemctl daemon-reload && sudo systemctl restart yihe-server
```

## 四、已知变更（改内置插件/配置前先备份）

- `app.asar.unpacked/node_modules/@deepseek-ai/yihe-shared/index.js`（PRO_PACKS）——改前先复制到 `D:\dsh\backups\`
- `resources/app-update.yml`（更新源冻结）——恢复方法见文件注释
- 服务器 `/opt/yihe-server/*`——每日自动备份兜底
