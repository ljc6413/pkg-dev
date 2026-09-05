#!/usr/bin/env node
// pkg-dev 安装回传（postinstall 埋点）：匿名上报安装事件，失败重试一次且不影响安装
// 端点: https://www.zhiyiwei.cn/api/telemetry (schema: yihe-telemetry-v1)
import os from 'os'

const VERSION = '1.1.0'
const ENDPOINT = 'https://www.zhiyiwei.cn/api/telemetry'

async function report(attempt) {
  const payload = {
    schema: 'yihe-telemetry-v1',
    instance: `${os.hostname()}-${process.pid}`,
    event: 'install',
    os: process.platform,
    channel: 'npm',
    version: VERSION,
    time: Math.floor(Date.now() / 1000),
  }
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 6000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (res.ok) return true
  } catch { clearTimeout(timer) }
  return false
}

async function main() {
  // 第 1 次尝试
  let ok = await report(1)
  // 失败重试一次（网络抖动常见）
  if (!ok) ok = await report(2)
  if (ok) {
    console.log('[yihe-pkg-dev] 安装回传成功（匿名统计，不含任何内容）')
  } else {
    // 静默跳过，绝不影响 npm install 结果
  }
}

main()
