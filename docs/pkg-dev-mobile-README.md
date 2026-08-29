# YiHe 移动跨端开发子包（pkg-dev-mobile）

> 版本：1.0.0 · 命名空间：**MOBILE开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：iOS/Swift、Android/Kotlin、跨平台（RN/Flutter）、UI 适配、状态管理（MVI/MVVM）、内存泄漏、启动优化、弱网、发布（签名/审核/灰度）、崩溃治理。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 66 | iOS/Swift、Android/Kotlin、跨平台（RN/Flutter）、UI 适配、状态管理（MVI/MVVM）、内存泄漏、启动优化、弱网、发布（签名/审核/灰度）、崩溃治理 |
| relations（关系网） | 54 关系 | 主线程→卡顿→性能瓶颈；生命周期/循环引用→内存泄漏 |
| scripts（脚本池） | 10 | 覆盖领域核心场景 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-mobile.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-mobile     （命名空间切到 MOBILE开发）
3. 推演：yihe_reason question=<领域问题> input=<上下文> namespace=MOBILE开发
```

**许可**：商业包——yihe_license op=activate pack_id=pkg-dev-mobile key=PRO-xxxx…（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| App 启动太慢 → 决策「启动优化」0.669 | 决策命中 | — |

RFB 经验库：$(System.Collections.Hashtable.lib)-full（关系网）+ $(System.Collections.Hashtable.lib)-scripts（脚本场景）——已入库可执行。

## 三、扩展定制

1. 复制本文件为 $(System.Collections.Hashtable.id)-<your>.json，按需增补意象/关系/脚本；
2. elations.from/to 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
