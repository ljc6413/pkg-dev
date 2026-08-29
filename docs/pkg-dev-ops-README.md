# YiHe DevOps 平台工程子包（pkg-dev-ops）

> 版本：1.0.0 · 命名空间：**OPS开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：CI/CD 流水线、容器镜像、Kubernetes 编排、基础设施即代码、可观测性（指标/日志/追踪）、SRE（SLO/错误预算/故障演练）、发布策略（灰度/金丝雀/蓝绿）、安全加固、多环境管理。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 69 | CI/CD 流水线、容器镜像、Kubernetes 编排、基础设施即代码、可观测性（指标/日志/追踪）、SRE（SLO/错误预算/故障演练）、发布策略（灰度/金丝雀/蓝绿）、安全加固、多环境管理 |
| relations（关系网） | 56 关系 | DevOps→CI/CD 链；SLO→错误预算→发布节奏；可观测性三支柱 |
| scripts（脚本池） | 10 | 覆盖领域核心场景 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-ops.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-ops     （命名空间切到 OPS开发）
3. 推演：yihe_reason question=<领域问题> input=<上下文> namespace=OPS开发
```

**许可**：商业包——yihe_license op=activate pack_id=pkg-dev-ops key=PRO-xxxx…（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| K8s 新版本怎么灰度上线 → 决策命中（灰度发布路径） | 决策命中 | — |

RFB 经验库：$(System.Collections.Hashtable.lib)-full（关系网）+ $(System.Collections.Hashtable.lib)-scripts（脚本场景）——已入库可执行。

## 三、扩展定制

1. 复制本文件为 $(System.Collections.Hashtable.id)-<your>.json，按需增补意象/关系/脚本；
2. elations.from/to 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
