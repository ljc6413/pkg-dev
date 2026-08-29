# YiHe TypeScript 全栈开发子包（pkg-dev-ts）

> 版本：1.0.0 · 命名空间：**TS开发** · 行业：软件开发 · tier：**pro**（license_required）· owner：developer
> 用途：在 pkg-dev（通用编程）之上的**语言栈专用子包**——用 `yihe_reason` 做
> TypeScript/Node 全栈开发决策：类型设计、严格模式升级、异步并发、依赖管理、
> React 状态管理、Node 分层、编译错误排查、内存泄漏、Monorepo、ESLint 治理。

## 一、包内容

| 维度 | 数量 | 覆盖 |
|---|---|---|
| imagos（意象库） | 88 | TS 类型系统（类型安全/泛型/联合类型/收窄/unknown/any 反模式/严格模式/tsconfig）、运行时（事件循环/异步/Promise/回调地狱/并发/内存泄漏）、工程（npm/依赖管理/lockfile/Monorepo/构建）、前端（React/组件/Hooks/状态管理/SSR）、后端（Express/中间件/ORM/Prisma/迁移）、质量（ESLint/Prettier/tsc/Vitest/Jest） |
| relations（关系网） | 69 | 类型链（any→削弱类型安全；严格模式/tsc→支撑类型安全；非空断言→导致空指针）、异步链（async/await→削弱回调地狱；事件监听→导致内存泄漏）、工程链（lockfile/语义化版本→支撑可预测性/兼容性；Monorepo→支撑模块化）、框架链（Hooks→支撑状态管理；Express→中间件/路由） |
| scripts（脚本池） | 10 | TS 类型设计 / 升级严格模式 / 异步并发控制 / npm 依赖升级 / React 状态管理选型 / Node 服务分层 / TS 编译错误排查 / 前端内存泄漏排查 / Monorepo 拆分 / ESLint 规则治理 |

## 二、使用流程

```text
1. 导入：yihe_pack op=import content=<yihe-packs/pkg-dev-ts.json 的内容>
2. 激活：yihe_pack op=activate id=pkg-dev-ts     （命名空间切到 TS开发）
3. 推演：yihe_reason question=<TS 开发问题> input=<上下文> namespace=TS开发
```

**许可**：商业包——`yihe_license op=activate pack_id=pkg-dev-ts key=PRO-xxxx…`（DSH 重启后生效）。

### 实测示例（v1.0.0 验证通过）

| 问题 | 决策 | 置信 |
|---|---|---|
| 项目 any 泛滥，要不要开严格模式 | 「严格模式」 | 0.695 |
| Node 异步回调地狱怎么改造 | 「异步」 | 0.779 |

> 决策轨迹：dec-8xx-49b0 系列（命名空间 TS开发）。

## 三、设计要点

- **反模式显式建模**：`any / 类型体操 / 双重断言 / 冗余类型标注 / 回调地狱 / 副作用`
  均以 `kind=state` + 关系（undermine/causal）表达"为什么该避免"；
- **类型安全是核心价值轴**：类型系统/严格模式/tsc/声明文件 → support → 类型安全 →
  可预测性，形成决策主链；
- **自包含**：引用跨包意象（模块化/可扩展性/数据迁移等）已在包内补齐，导入零悬空。

## 四、扩展定制

1. 复制本文件为 `pkg-dev-ts-<your>.json`，按需增补意象/关系/脚本；
2. `relations.from/to` 必须写意象 content；引用缺失意象的关系会被静默跳过；
3. 重新导入（同 id 覆盖/增量合并）并激活。
