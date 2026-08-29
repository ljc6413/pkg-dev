# YiHe 前端工程子包（pkg-dev-fe）

> 版本：1.0.0 · 命名空间：**FE开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：React/Vue/Angular 框架、组件与状态管理、SSR/CSR/SSG 渲染、微前端、Web 性能指标（LCP/FCP/CLS）、构建优化、前端安全（XSS/CSRF）。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 约 70 | React/Vue/Angular 框架、组件与状态管理、SSR/CSR/SSG 渲染、微前端、Web 性能指标（LCP/FCP/CLS）、构建优化、前端安全（XSS/CSRF） |
| relations（关系网） | 约 55-63 | 领域核心决策链（见包 JSON） |
| scripts（脚本池） | 10 | 领域核心场景模板 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-fe.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-fe     （命名空间切到 FE开发）
3. 推演：yihe_reason question=<领域问题> input=<上下文> namespace=FE开发
```

**许可**：商业包——yihe_license op=activate pack_id=pkg-dev-fe key=PRO-xxxx…（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| 前端首屏性能怎么优化 → 「代码分割」0.779 | 决策命中 | — |

RFB 经验库：$(System.Collections.Hashtable.id)-full（关系网）+ $(System.Collections.Hashtable.id)-scripts（脚本场景）——已入库可三态执行。

## 三、扩展定制

1. 复制本文件为 $(System.Collections.Hashtable.id)-<your>.json，按需增补意象/关系/脚本；
2. elations.from/to 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
