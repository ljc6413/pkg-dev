.IMAGE WebAssembly
.IMAGE 线性内存
.IMAGE 导入导出
.IMAGE WASI
.IMAGE 组件模型
.IMAGE Rust编译
.IMAGE C编译
.IMAGE AssemblyScript
.IMAGE 沙箱安全
.IMAGE 性能
.IMAGE 边缘计算
.IMAGE 插件系统
.IMAGE 跨语言互操作
.IMAGE 内存管理
.IMAGE Web前端
.IMAGE 服务端
.IMAGE wasmtime
.IMAGE wasmer
.IMAGE 函数即服务
.IMAGE 启动时间
.IMAGE 体积优化
.IMAGE SIMD
.IMAGE 线程
.IMAGE 异常处理
.IMAGE WASI预览版
.IMAGE 确定性
.IMAGE 调试
.FIELD 核心
.FIELD 生态
.FIELD 语言
.FIELD 安全
.FIELD 价值
.FIELD 应用
.FIELD 运行时
.FIELD 性能
.FIELD 工具
IF WebAssembly 线性内存 .WEIGHT 0.900 .FIELD 核心
IF WebAssembly 导入导出 .WEIGHT 0.800 .FIELD 核心
BELONG WebAssembly WASI .WEIGHT 0.700 .FIELD 生态
BELONG WebAssembly 组件模型 .WEIGHT 0.700 .FIELD 生态
SUPPORT WebAssembly Rust编译 .WEIGHT 0.600 .FIELD 语言
SUPPORT WebAssembly C编译 .WEIGHT 0.600 .FIELD 语言
SUPPORT WebAssembly AssemblyScript .WEIGHT 0.500 .FIELD 语言
SUPPORT WebAssembly 沙箱安全 .WEIGHT 0.800 .FIELD 安全
SUPPORT WebAssembly 性能 .WEIGHT 0.700 .FIELD 价值
SUPPORT WASI 边缘计算 .WEIGHT 0.700 .FIELD 应用
IF 沙箱安全 插件系统 .WEIGHT 0.700 .FIELD 应用
SUPPORT 组件模型 跨语言互操作 .WEIGHT 0.600 .FIELD 生态
IF 线性内存 内存管理 .WEIGHT 0.700 .FIELD 核心
BELONG WebAssembly Web前端 .WEIGHT 0.600 .FIELD 应用
BELONG WebAssembly 服务端 .WEIGHT 0.600 .FIELD 应用
SUPPORT WebAssembly wasmtime .WEIGHT 0.600 .FIELD 运行时
SUPPORT WebAssembly wasmer .WEIGHT 0.600 .FIELD 运行时
BELONG 边缘计算 函数即服务 .WEIGHT 0.600 .FIELD 应用
IF WebAssembly 启动时间 .WEIGHT 0.500 .FIELD 性能
IF WebAssembly 体积优化 .WEIGHT 0.500 .FIELD 性能
BELONG WebAssembly SIMD .WEIGHT 0.500 .FIELD 性能
BELONG WebAssembly 线程 .WEIGHT 0.500 .FIELD 核心
BELONG WebAssembly 异常处理 .WEIGHT 0.500 .FIELD 核心
IF WASI WASI预览版 .WEIGHT 0.500 .FIELD 生态
SUPPORT WebAssembly 确定性 .WEIGHT 0.600 .FIELD 价值
IF WebAssembly 调试 .WEIGHT 0.500 .FIELD 工具