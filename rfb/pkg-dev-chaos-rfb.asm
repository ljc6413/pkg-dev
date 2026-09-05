.IMAGE 混沌工程
.IMAGE 故障注入
.IMAGE 爆炸半径
.IMAGE 稳态假设
.IMAGE 实验假设
.IMAGE 混沌实验
.IMAGE 故障模式
.IMAGE 延迟注入
.IMAGE 进程终止
.IMAGE 网络分区
.IMAGE 资源耗尽
.IMAGE 可观测性
.IMAGE 监控告警
.IMAGE 韧性
.IMAGE 自动恢复
.IMAGE ChaosMonkey
.IMAGE Litmus
.IMAGE 故障演练平台
.IMAGE 生产环境
.IMAGE 预发环境
.IMAGE 演练
.IMAGE 游戏日
.IMAGE 红队演练
.IMAGE 回滚
.IMAGE 降级
.IMAGE 限流熔断
.IMAGE 故障成本
.FIELD 方法
.FIELD 原则
.FIELD 故障
.FIELD 前提
.FIELD 价值
.FIELD 工具
.FIELD 环境
.FIELD 实践
.FIELD 恢复
.FIELD 评估
IF 混沌工程 故障注入 .WEIGHT 0.900 .FIELD 方法
IF 混沌工程 爆炸半径 .WEIGHT 0.900 .FIELD 原则
IF 混沌工程 稳态假设 .WEIGHT 0.800 .FIELD 原则
IF 混沌工程 实验假设 .WEIGHT 0.800 .FIELD 原则
BELONG 混沌工程 混沌实验 .WEIGHT 0.700 .FIELD 方法
BELONG 故障注入 故障模式 .WEIGHT 0.700 .FIELD 方法
BELONG 故障模式 延迟注入 .WEIGHT 0.700 .FIELD 故障
BELONG 故障模式 进程终止 .WEIGHT 0.700 .FIELD 故障
BELONG 故障模式 网络分区 .WEIGHT 0.700 .FIELD 故障
BELONG 故障模式 资源耗尽 .WEIGHT 0.700 .FIELD 故障
IF 混沌工程 可观测性 .WEIGHT 0.800 .FIELD 前提
IF 可观测性 监控告警 .WEIGHT 0.700 .FIELD 前提
SUPPORT 混沌工程 韧性 .WEIGHT 0.700 .FIELD 价值
SUPPORT 韧性 自动恢复 .WEIGHT 0.600 .FIELD 价值
SUPPORT 混沌工程 ChaosMonkey .WEIGHT 0.600 .FIELD 工具
SUPPORT 混沌工程 Litmus .WEIGHT 0.600 .FIELD 工具
SUPPORT 混沌工程 故障演练平台 .WEIGHT 0.600 .FIELD 工具
IF 混沌实验 生产环境 .WEIGHT 0.500 .FIELD 环境
SUPPORT 混沌实验 预发环境 .WEIGHT 0.500 .FIELD 环境
BELONG 演练 游戏日 .WEIGHT 0.600 .FIELD 实践
BELONG 演练 红队演练 .WEIGHT 0.600 .FIELD 实践
BELONG 自动恢复 回滚 .WEIGHT 0.500 .FIELD 恢复
BELONG 自动恢复 降级 .WEIGHT 0.500 .FIELD 恢复
BELONG 自动恢复 限流熔断 .WEIGHT 0.500 .FIELD 恢复
IF 混沌工程 故障成本 .WEIGHT 0.500 .FIELD 评估