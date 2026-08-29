# YiHe Go 云原生开发子包（pkg-dev-go）

> 版本：1.0.0 · 命名空间：**GO开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：Go 语言栈专用子包——goroutine/channel/select 并发模型、错误处理规范、
> 接口设计、goroutine 泄漏排查、依赖管理（go mod/go.sum）、Web 分层、gRPC、
> 表驱动测试、pprof 性能剖析、微服务拆分。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 66 | 并发（goroutine/channel/select/互斥锁/WaitGroup/context/数据竞争/goroutine 泄漏）、语言（接口/结构体/切片/map/多返回值/类型断言/泛型/embed）、工程（go mod/go.sum/依赖管理/模块）、Web（net/http/中间件/路由/gRPC/protobuf）、测试（go test/表驱动/基准/mock）、规范（go vet/gofmt/golangci-lint）、场景（微服务/云原生/Kubernetes/CLI） |
| relations（关系网） | 47 | goroutine→支撑并发/吞吐量；channel→支撑并发安全；context→削弱 goroutine 泄漏；互斥锁→削弱数据竞争；go mod/go.sum→支撑依赖/可预测；接口→支撑可扩展/测试 |
| scripts（脚本池） | 10 | 并发模型设计 / 错误处理规范 / 接口设计 / goroutine 泄漏排查 / 依赖管理 / Web 服务分层 / gRPC 服务设计 / 测试策略 / 性能剖析 / 微服务拆分 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-go.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-go     （命名空间切到 GO开发）
3. 推演：yihe_reason question=<Go 问题> input=<上下文> namespace=GO开发
```

**许可**：商业包——`yihe_license op=activate pack_id=pkg-dev-go key=PRO-xxxx…`（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| goroutine 泄漏怎么排查 | 「goroutine 泄漏」（context/通道路径） | 0.779 |

## 三、设计要点

- **并发是核心轴**：channel 优先消息传递（并发安全）、context 显式取消（防 goroutine 泄漏）、
  互斥锁最小化（防数据竞争）——并发决策主线完整；
- **工程链**：`go mod + go.sum → 依赖管理/可预测性`，`gofmt/golangci-lint → 代码规范`；
- **反模式显式建模**：panic/空接口/goroutine 泄漏/数据竞争 均以 state 表达；
- **自包含**：跨包意象（类型安全/资源泄漏）已补齐。

## 四、扩展定制

1. 复制本文件为 `pkg-dev-go-<your>.json`，按需增补意象/关系/脚本；
2. `relations.from/to` 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
