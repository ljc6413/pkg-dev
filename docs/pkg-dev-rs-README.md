# YiHe Rust 系统编程子包（pkg-dev-rs）

> 版本：1.0.0 · 命名空间：**RS开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：Rust 语言栈专用子包——所有权/借用/生命周期、错误处理（Result/Option）、
> 并发（Arc/Mutex/通道/tokio）、unsafe 审计、trait 设计、cargo workspace、
> 性能剖析、FFI 集成。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 68 | 内存模型（所有权/借用/生命周期/借用检查器/unsafe）、错误（Result/Option/错误处理）、抽象（trait/泛型/特征对象/pub 接口）、并发（Arc/Mutex/通道/异步/tokio/数据竞争）、工程（cargo/workspace/Cargo.lock）、规范（clippy/rustfmt）、测试（cargo test/单元/集成/基准）、场景（FFI/嵌入式/系统编程/WebAssembly） |
| relations（关系网） | 54 | 所有权→支撑内存安全→支撑可靠性；unsafe→削弱内存安全→导致缺陷；Option→削弱空指针；Mutex/通道→削弱数据竞争；cargo/clippy→支撑工程/规范 |
| scripts（脚本池） | 10 | 所有权重构 / 错误处理策略 / 并发选型 / unsafe 审计 / trait 设计 / cargo workspace 组织 / 宏设计 / 性能剖析 / 测试策略 / FFI 集成 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-rs.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-rs     （命名空间切到 RS开发）
3. 推演：yihe_reason question=<Rust 问题> input=<上下文> namespace=RS开发
```

**许可**：商业包——`yihe_license op=activate pack_id=pkg-dev-rs key=PRO-xxxx…`（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| 多线程共享计数器用 Arc 还是 channel | 「Arc」（Arc+Mutex 路径） | 0.779 |
| 脚本匹配「并发选型」 | 命中 1 个 | — |

## 三、设计要点

- **内存安全是核心轴**：`所有权 → 支撑内存安全 → 支撑可靠性`，`unsafe → 削弱内存安全`
  形成"为什么 Rust 安全 / 为什么 unsafe 要审计"的决策主线；
- **并发双路径**：共享状态（Arc+Mutex）vs 消息传递（通道）——数据竞争编译期拦截；
- **反模式显式建模**：unsafe/循环引用/数据竞争 均以 state + causal/undermine 表达；
- **自包含**：跨包意象（测试/代码规范/模块化）已补齐。

## 四、扩展定制

1. 复制本文件为 `pkg-dev-rs-<your>.json`，按需增补意象/关系/脚本；
2. `relations.from/to` 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
