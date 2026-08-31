.IMAGE 编译器
.IMAGE 词法分析
.IMAGE 语法分析
.IMAGE 抽象语法树
.IMAGE 类型检查
.IMAGE 中间表示
.IMAGE 优化
.IMAGE 代码生成
.IMAGE LLVM
.IMAGE 寄存器分配
.IMAGE 指令选择
.IMAGE 数据流分析
.IMAGE 控制流图
.IMAGE SSA形式
.IMAGE 递归下降
.IMAGE 正则表达式
.IMAGE 语法错误恢复
.IMAGE 解释器
.IMAGE JIT编译
.IMAGE 字节码
.IMAGE 虚拟机
.IMAGE 内联
.IMAGE 死代码消除
.IMAGE 常量折叠
.IMAGE 循环优化
.IMAGE 语义分析
.IMAGE 链接
.IMAGE 编译期错误
.FIELD 前端
.FIELD 中端
.FIELD 后端
.FIELD 工具链
.FIELD 词法
.FIELD 运行时
.FIELD 解释器
.FIELD 优化
IF 编译器 词法分析 .WEIGHT 0.900 .FIELD 前端
IF 词法分析 语法分析 .WEIGHT 0.900 .FIELD 前端
CAUSE 语法分析 抽象语法树 .WEIGHT 0.800 .FIELD 前端
IF 抽象语法树 类型检查 .WEIGHT 0.800 .FIELD 前端
CAUSE 类型检查 中间表示 .WEIGHT 0.900 .FIELD 中端
IF 中间表示 优化 .WEIGHT 0.900 .FIELD 中端
CAUSE 优化 代码生成 .WEIGHT 0.800 .FIELD 后端
SUPPORT 中间表示 LLVM .WEIGHT 0.700 .FIELD 工具链
BELONG 代码生成 寄存器分配 .WEIGHT 0.700 .FIELD 后端
BELONG 代码生成 指令选择 .WEIGHT 0.700 .FIELD 后端
IF 优化 数据流分析 .WEIGHT 0.600 .FIELD 中端
IF 中间表示 控制流图 .WEIGHT 0.600 .FIELD 中端
IF 中间表示 SSA形式 .WEIGHT 0.700 .FIELD 中端
BELONG 语法分析 递归下降 .WEIGHT 0.500 .FIELD 前端
SUPPORT 词法分析 正则表达式 .WEIGHT 0.600 .FIELD 词法
SUPPORT 语法分析 语法错误恢复 .WEIGHT 0.500 .FIELD 前端
BELONG 解释器 JIT编译 .WEIGHT 0.600 .FIELD 运行时
IF 解释器 字节码 .WEIGHT 0.600 .FIELD 解释器
IF 字节码 虚拟机 .WEIGHT 0.600 .FIELD 运行时
BELONG 优化 内联 .WEIGHT 0.700 .FIELD 优化
BELONG 优化 死代码消除 .WEIGHT 0.700 .FIELD 优化
BELONG 优化 常量折叠 .WEIGHT 0.700 .FIELD 优化
BELONG 优化 循环优化 .WEIGHT 0.600 .FIELD 优化
SUPPORT 类型检查 语义分析 .WEIGHT 0.700 .FIELD 前端
CAUSE 代码生成 链接 .WEIGHT 0.600 .FIELD 后端
CAUSE 语义分析 编译期错误 .WEIGHT 0.600 .FIELD 前端