.IMAGE 逆向工程
.IMAGE 反汇编
.IMAGE 反编译
.IMAGE 机器码
.IMAGE 汇编语言
.IMAGE 调用约定
.IMAGE 栈帧
.IMAGE 静态分析
.IMAGE 动态分析
.IMAGE 调试器
.IMAGE 断点
.IMAGE 符号表
.IMAGE 脱壳
.IMAGE 加固
.IMAGE 混淆
.IMAGE 固件分析
.IMAGE 恶意软件分析
.IMAGE 漏洞分析
.IMAGE 协议逆向
.IMAGE Ghidra
.IMAGE IDAPro
.IMAGE objdump
.IMAGE readelf
.IMAGE 进程内存
.IMAGE 补丁
.IMAGE 调用图
.IMAGE 数据流分析
.FIELD 方法
.FIELD 基础
.FIELD 调试
.FIELD 对抗
.FIELD 应用
.FIELD 工具
BELONG 逆向工程 反汇编 .WEIGHT 0.800 .FIELD 方法
BELONG 逆向工程 反编译 .WEIGHT 0.800 .FIELD 方法
IF 反汇编 机器码 .WEIGHT 0.900 .FIELD 基础
IF 机器码 汇编语言 .WEIGHT 0.800 .FIELD 基础
IF 汇编语言 调用约定 .WEIGHT 0.700 .FIELD 基础
IF 调用约定 栈帧 .WEIGHT 0.700 .FIELD 基础
BELONG 逆向工程 静态分析 .WEIGHT 0.700 .FIELD 方法
BELONG 逆向工程 动态分析 .WEIGHT 0.700 .FIELD 方法
IF 调试器 断点 .WEIGHT 0.700 .FIELD 调试
SUPPORT 静态分析 符号表 .WEIGHT 0.600 .FIELD 方法
BELONG 逆向工程 脱壳 .WEIGHT 0.600 .FIELD 方法
BELONG 加固 混淆 .WEIGHT 0.600 .FIELD 对抗
BUT 加固 脱壳 .WEIGHT 0.500 .FIELD 对抗
BELONG 逆向工程 固件分析 .WEIGHT 0.700 .FIELD 应用
BELONG 逆向工程 恶意软件分析 .WEIGHT 0.700 .FIELD 应用
BELONG 逆向工程 漏洞分析 .WEIGHT 0.700 .FIELD 应用
BELONG 逆向工程 协议逆向 .WEIGHT 0.600 .FIELD 应用
SUPPORT 反编译 Ghidra .WEIGHT 0.600 .FIELD 工具
SUPPORT 反汇编 IDAPro .WEIGHT 0.600 .FIELD 工具
SUPPORT 反汇编 objdump .WEIGHT 0.500 .FIELD 工具
SUPPORT 静态分析 readelf .WEIGHT 0.500 .FIELD 工具
IF 动态分析 进程内存 .WEIGHT 0.600 .FIELD 基础
BELONG 逆向工程 补丁 .WEIGHT 0.500 .FIELD 方法
SUPPORT 静态分析 调用图 .WEIGHT 0.600 .FIELD 方法
SUPPORT 静态分析 数据流分析 .WEIGHT 0.600 .FIELD 方法