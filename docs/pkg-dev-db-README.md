# YiHe 数据库工程子包（pkg-dev-db）

> 版本：1.0.0 · 命名空间：**DB开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：关系型/NoSQL 选型、SQL 优化、事务与隔离、分库分表、缓存（穿透/击穿/雪崩）、数据迁移、高可用、ETL、数据安全。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 68 | 关系型/NoSQL 选型、SQL 优化、事务与隔离、分库分表、缓存（穿透/击穿/雪崩）、数据迁移、高可用、ETL、数据安全 |
| relations（关系网） | 58 关系 | 索引→削弱慢查询→削弱性能瓶颈；分片→可扩展但→分布式事务；缓存三坑 |
| scripts（脚本池） | 10 | 覆盖领域核心场景 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-db.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-db     （命名空间切到 DB开发）
3. 推演：yihe_reason question=<领域问题> input=<上下文> namespace=DB开发
```

**许可**：商业包——yihe_license op=activate pack_id=pkg-dev-db key=PRO-xxxx…（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| 数据库慢查询怎么优化 → 决策命中（SQL/索引路径） | 决策命中 | — |

RFB 经验库：$(System.Collections.Hashtable.lib)-full（关系网）+ $(System.Collections.Hashtable.lib)-scripts（脚本场景）——已入库可执行。

## 三、扩展定制

1. 复制本文件为 $(System.Collections.Hashtable.id)-<your>.json，按需增补意象/关系/脚本；
2. elations.from/to 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
