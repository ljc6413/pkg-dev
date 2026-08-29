#!/usr/bin/env node
// pkg-dev 安装回传（postinstall 埋点）：匿名上报安装事件，失败静默不影响安装
// 端点: https://www.zhiyiwei.cn/api/telemetry (schema: yihe-telemetry-v1)
import os from 'os'

const VERSION = '1.0.0'

async function main() {
  try {
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
    const timer = setTimeout(() => ctrl.abort(), 5000)
    const res = await fetch('https://www.zhiyiwei.cn/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    })
    clearTimeout(timer)
    if (res.ok) {
      console.log('[yihe-pkg-dev] 安装回传成功 (匿名埋点)')
    }
  } catch {
    // 网络不可达/超时：静默跳过，不影响 npm install
  }
}

main()
