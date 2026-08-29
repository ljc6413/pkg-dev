# YiHe Python 全栈开发子包（pkg-dev-py）

> 版本：1.0.0 · 命名空间：**PY开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：Python 语言栈专用子包——类型提示/mypy、GIL 与并发选型、依赖环境管理、
> Web 框架选型、Pandas 性能、pytest 测试、反模式清理、异常日志、性能剖析、版本升级。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 78 | 语言特性（类型提示/Pythonic/列表推导/生成器/装饰器/上下文管理器）、并发（GIL/协程/asyncio/多线程/多进程）、工程（虚拟环境/pip/poetry/requirements/依赖锁定）、Web（Flask/FastAPI/Django/Pydantic）、数据（Pandas/NumPy/SQLAlchemy/Alembic）、测试（pytest/fixture/monkeypatch）、反模式（全局变量/可变默认参数/裸 except）、场景（异步爬虫/数据清洗/机器学习） |
| relations（关系网） | 62 | GIL→GIL 受限→削弱多线程/支撑多进程；类型提示+mypy→支撑类型安全；向量化→削弱慢循环；可变默认参数→导致缺陷；虚拟环境→支撑环境隔离；依赖锁定→支撑可预测性；上下文管理器→削弱资源泄漏 |
| scripts（脚本池） | 10 | 类型提示落地 / 并发选型 / 依赖环境管理 / Web 框架选型 / Pandas 优化 / pytest 策略 / 反模式清理 / 异常日志规范 / 性能剖析 / 版本升级 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-py.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-py     （命名空间切到 PY开发）
3. 推演：yihe_reason question=<Python 问题> input=<上下文> namespace=PY开发
```

**许可**：商业包——`yihe_license op=activate pack_id=pkg-dev-py key=PRO-xxxx…`（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| CPU 密集任务多线程上不去，GIL 怎么绕 | 「Python」（GIL→多进程路径） | 0.779 |
| 可变默认参数共享状态 bug | 「Python」 | 0.779 |
| 脚本匹配「GIL 并发选型」 | 命中 2 个 | — |
| 脚本匹配「可变默认参数反模式」 | 命中 1 个 | — |

## 三、设计要点

- **GIL 是并发决策核心轴**：`GIL → GIL 受限 → 削弱多线程 / 支撑多进程`，配合
  `协程→asyncio→支撑吞吐量` 形成 IO/CPU 密集分流；
- **类型安全轴**：`类型提示 + mypy → 支撑类型安全 → 可预测性`（对应 JS 的严格模式轴）；
- **反模式显式建模**：可变默认参数/全局变量/裸 except 均以 `kind=state` + causal/undermine 表达；
- **自包含**：跨包意象已补齐，导入零悬空。

## 四、扩展定制

1. 复制本文件为 `pkg-dev-py-<your>.json`，按需增补意象/关系/脚本；
2. `relations.from/to` 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
