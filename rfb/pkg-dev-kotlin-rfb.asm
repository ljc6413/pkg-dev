.IMAGE Kotlin
.IMAGE 空安全
.IMAGE 协程
.IMAGE 可空类型
.IMAGE 挂起函数
.IMAGE Flow
.IMAGE 结构化并发
.IMAGE 协程作用域
.IMAGE 协程调度器
.IMAGE 协程取消
.IMAGE 协程异常处理
.IMAGE 数据类
.IMAGE 密封类
.IMAGE 扩展函数
.IMAGE 委托
.IMAGE Android
.IMAGE Compose
.IMAGE Ktor
.IMAGE SpringBoot
.IMAGE 多平台
.IMAGE Gradle
.IMAGE StateFlow
.IMAGE SharedFlow
.IMAGE ViewModel
.IMAGE 依赖注入
.IMAGE Koin
.IMAGE Hilt
.IMAGE 协程测试
.FIELD 核心
.FIELD 异步
.FIELD 语法
.FIELD UI
.FIELD 后端
.FIELD 平台
.FIELD 构建
.FIELD 状态
.FIELD 架构
.FIELD 测试
IF Kotlin 空安全 .WEIGHT 0.900 .FIELD 核心
IF Kotlin 协程 .WEIGHT 0.900 .FIELD 核心
IF 空安全 可空类型 .WEIGHT 0.800 .FIELD 核心
IF 协程 挂起函数 .WEIGHT 0.800 .FIELD 异步
IF 挂起函数 Flow .WEIGHT 0.700 .FIELD 异步
IF 协程 结构化并发 .WEIGHT 0.800 .FIELD 异步
IF 结构化并发 协程作用域 .WEIGHT 0.700 .FIELD 异步
BELONG 协程 协程调度器 .WEIGHT 0.700 .FIELD 异步
BELONG 协程 协程取消 .WEIGHT 0.700 .FIELD 异步
BELONG 协程 协程异常处理 .WEIGHT 0.700 .FIELD 异步
BELONG Kotlin 数据类 .WEIGHT 0.600 .FIELD 语法
BELONG Kotlin 密封类 .WEIGHT 0.600 .FIELD 语法
BELONG Kotlin 扩展函数 .WEIGHT 0.600 .FIELD 语法
BELONG Kotlin 委托 .WEIGHT 0.600 .FIELD 语法
SUPPORT Android Compose .WEIGHT 0.700 .FIELD UI
SUPPORT Kotlin Ktor .WEIGHT 0.600 .FIELD 后端
SUPPORT Kotlin SpringBoot .WEIGHT 0.600 .FIELD 后端
BELONG Kotlin 多平台 .WEIGHT 0.600 .FIELD 平台
SUPPORT Kotlin Gradle .WEIGHT 0.600 .FIELD 构建
BELONG Flow StateFlow .WEIGHT 0.600 .FIELD 状态
BELONG Flow SharedFlow .WEIGHT 0.600 .FIELD 状态
SUPPORT Compose ViewModel .WEIGHT 0.600 .FIELD 架构
SUPPORT ViewModel 依赖注入 .WEIGHT 0.600 .FIELD 架构
BELONG 依赖注入 Koin .WEIGHT 0.500 .FIELD 架构
BELONG 依赖注入 Hilt .WEIGHT 0.500 .FIELD 架构
SUPPORT 协程 协程测试 .WEIGHT 0.600 .FIELD 测试