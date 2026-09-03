# pkg-dev 运维手册（OPS-RUNBOOK）

> 常规操作固化清单——本会话反复出现的发布/部署/运维操作，按此直接执行，不必重复推演。
> 配套内核包 `pkg-dev-runbook`：开启 script_hit_threshold=0.5 后，问对应问题直接命中脚本 0 token 返回。

---

## 1. 重建 release zip（服务器执行，保持正斜杠）

```bash
# 源目录：先 scp 本地 pkg-dev-release/ 内容到 /tmp/src-release/
cd /tmp/src-release
rm -f /tmp/pkg-dev-release-v1.1.0.zip
zip -q -r -X /tmp/pkg-dev-release-v1.1.0.zip .
cp /tmp/pkg-dev-release-v1.1.0.zip /opt/yihe-server/public/pkg-dev-release-v1.1.0.zip
# 验证（Linux unzip 兼容）
rm -rf /tmp/uv && mkdir -p /tmp/uv && cd /tmp/uv
unzip -o -q /opt/yihe-server/public/pkg-dev-release-v1.1.0.zip
ls packages/*.json | wc -l   # 包数
ls rfb/*.asm | wc -l         # asm 数
```
> ⚠ 别用 Windows Compress-Archive（产出反斜杠路径破坏 Linux/macOS 解压）。

## 2. 重建 npm tgz（本地）

```bash
cd D:\dsh\pkg-dev-repo
$env:NPM_CONFIG_CACHE='D:\dsh\.npm-cache'   # 避免 D:\node 权限
npm pack --pack-destination D:\dsh
# 部署
scp -i $key D:\dsh\yihe-pkg-dev-1.1.0.tgz ubuntu@122.51.212.20:/opt/yihe-server/public/
```
> ⚠ tgz 是 gzip+tar 不是 zip，别当 zip 读；验证内容用 tar -xzf。

## 3. PRO_PACKS 三处同步（新增包必做）

1. **内置插件**：`D:\Program Files\DSH Desktop\resources\app.asar.unpacked\node_modules\@deepseek-ai\yihe-shared\index.js` 第 53 行 PRO_PACKS 数组追加 → **DSH 重启生效**
2. **工作区**：`D:\dsh\yihe-plugins\yihe-shared-static-fixed.js` 同位置追加
3. **Rust 网关**（服务器）：`/home/ubuntu/yihe-rust/crates/gateway/src/license.rs` —— 用 python 正则替换数组并改 `[&str; N]` 计数，然后 `cargo check -p gateway`

## 4. 服务器部署新包 + 内核加载验证

```bash
scp packages/<pkg>.json ubuntu@122.51.212.20:/opt/yihe-server/public/packages/
ssh ... "sudo systemctl restart yihe-server && sleep 3 && sudo journalctl -u yihe-server --since '30 sec ago' --no-pager | grep 加载"
# 期望输出：已加载 N/N 个编程包（N 命名空间路由）
# 路由验证：curl -X POST https://www.zhiyiwei.cn/api/demo/reason -d '{"question":"..."}'
```

## 5. GitHub 推送（git 直连不稳 → git data API）

```python
# 服务器上执行：GET ref/heads/main → 每个文件 POST git/blobs(base64) →
# POST git/trees(base_tree=HEAD, tree=[{path,mode:100644,type:blob,sha}]) →
# POST git/commits(parents=[HEAD]) → PATCH git/refs/heads/main
# 带 Authorization: token xxx，403/429 重试等待
```
> 单文件/少文件可用 Contents API（PUT，新文件不带 sha，已有文件带 sha）。

## 6. GitHub Release 资产替换

```bash
# GET releases → 找 tag 的旧资产 id → DELETE /releases/assets/{id}（204 无 body，解析要容错）
# POST https://uploads.github.com/repos/{owner}/{repo}/releases/{id}/assets?name=xxx
#   Content-Type: application/octet-stream，--data-binary @file
# 替换后验证 https://github.com/.../releases/download/... 可下载
```

## 7. 冒烟测试

```bash
cd D:\dsh\pkg-dev-repo
node tools/smoke-test.mjs --selfcheck   # 包意象/关系/脚本完整性（PACKS 数组要加新包断言）
node tools/smoke-test.mjs --rfb         # asm 源检查
```

## 8. 更新 bootstrap 包列表

```bash
# bootstrap-install.mjs 的 PACKS 数组加新包 id；phase 文案「导入编程包（N 个）」同步
node --check bootstrap-install.mjs
# 同步到 D:\dsh\pkg-dev-release\ 与服务器 /tmp/src-release/
```

## 9. 证书/域名打不开排查

```bash
# 服务端先自证正常：curl -v https://www.zhiyiwei.cn/ | grep -E 'SSL|HTTP'
# sudo openssl x509 -in /etc/nginx/ssl/fullchain.cer -noout -dates
# sudo systemctl status nginx; sudo ss -tlnp | grep -E ':(80|443) '
# 客户端 PR_CONNECT_RESET 多为本地：flush DNS / 无痕 / 换网络 / 关代理
```

## 10. 运营快照重跑

```bash
sudo GH_TOKEN=<token> node /opt/yihe-server/scripts/ops-snapshot.mjs
curl "https://www.zhiyiwei.cn/api/ops?token=<admin>" | grep generated_at  # 确认最新
```

## 11. 部署前工具链预检

```bash
node --check server.js && node --check scripts/ops-snapshot.mjs
cd pkg-dev-repo && for f in tools/*.mjs bootstrap-install.mjs; do node --check "$f"; done
```

---

## 通用原则

- **幂等**：重复执行不产生副作用（zip 重建 rm 后重打、推送用 sha 幂等）
- **可复现**：所有操作有固定命令与验证点
- **凭据注入**：GitHub token 用环境变量，不进代码仓库（secret 扫描会拦）
- **省 token 飞轮**：新常规操作出现 → 补进 pkg-dev-runbook 脚本 → 下次命中 0 token
