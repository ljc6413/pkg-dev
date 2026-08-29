# YiHe 嵌入式 IoT 开发子包（pkg-dev-embed）

> 版本：1.0.0 · 命名空间：**EMBED开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：MCU/RTOS（FreeRTOS）、任务调度与实时性、设备驱动、低功耗、无线通信（BLE/WiFi/Zigbee/LoRa）、OTA、内存管理、安全启动、车规。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 约 70 | MCU/RTOS（FreeRTOS）、任务调度与实时性、设备驱动、低功耗、无线通信（BLE/WiFi/Zigbee/LoRa）、OTA、内存管理、安全启动、车规 |
| relations（关系网） | 约 55-63 | 领域核心决策链（见包 JSON） |
| scripts（脚本池） | 10 | 领域核心场景模板 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-embed.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-embed     （命名空间切到 EMBED开发）
3. 推演：yihe_reason question=<领域问题> input=<上下文> namespace=EMBED开发
```

**许可**：商业包——yihe_license op=activate pack_id=pkg-dev-embed key=PRO-xxxx…（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| 嵌入式低功耗 → 「低功耗」0.779 | 决策命中 | — |

RFB 经验库：$(System.Collections.Hashtable.id)-full（关系网）+ $(System.Collections.Hashtable.id)-scripts（脚本场景）——已入库可三态执行。

## 三、扩展定制

1. 复制本文件为 $(System.Collections.Hashtable.id)-<your>.json，按需增补意象/关系/脚本；
2. elations.from/to 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
