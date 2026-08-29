.IMAGE 软件测试
.IMAGE 测试金字塔
.IMAGE 单元测试
.IMAGE 集成测试
.IMAGE 端到端测试
.IMAGE 测试
.IMAGE 契约测试
.IMAGE 测试自动化
.IMAGE 回归测试
.IMAGE 测试框架
.IMAGE 断言
.IMAGE Mock
.IMAGE 测试替身
.IMAGE Stub
.IMAGE Fake
.IMAGE 测试隔离
.IMAGE 测试覆盖率
.IMAGE 分支覆盖
.IMAGE 变异测试
.IMAGE 缺陷
.IMAGE 冒烟测试
.IMAGE 探索性测试
.IMAGE 测试数据管理
.IMAGE 测试环境
.IMAGE 并行测试
.IMAGE 测试稳定性
.IMAGE Flaky测试
.IMAGE 可预测性
.IMAGE 测试代码
.IMAGE 可维护性
.IMAGE 行为驱动开发
.IMAGE 验收测试
.IMAGE 测试驱动开发
.IMAGE 红绿重构
.IMAGE 性能测试
.IMAGE 负载测试
.IMAGE 压测
.IMAGE 基准测试
.IMAGE 性能瓶颈
.IMAGE 并发测试
.IMAGE 安全测试
.IMAGE 渗透测试
.IMAGE 漏洞扫描
.IMAGE 模糊测试
.IMAGE 兼容性测试
.IMAGE 可用性测试
.IMAGE 可访问性测试
.IMAGE 缺陷管理
.IMAGE 缺陷密度
.IMAGE 测试报告
.IMAGE 质量门禁
.IMAGE 测试计划
.IMAGE 测试用例
.IMAGE 用例设计
.IMAGE 边界值分析
.IMAGE 等价类划分
.IMAGE 决策表
.IMAGE 状态转换测试
.IMAGE 持续集成
.IMAGE 持续交付
.IMAGE 可靠性
.IMAGE 代码可读性
.FIELD 测试
.FIELD 自动化
.FIELD 工具
.FIELD 替身
.FIELD 度量
.FIELD 策略
.FIELD 数据
.FIELD 环境
.FIELD 性能
.FIELD 反模式
.FIELD 工程
.FIELD 方法论
.FIELD 专项
.FIELD 安全
.FIELD 流程
.FIELD 用例
.FIELD 价值
ENTAIL 软件测试 测试金字塔 .WEIGHT 0.800 .FIELD 测试
SUPPORT 测试金字塔 单元测试 .WEIGHT 0.800 .FIELD 测试
SUPPORT 测试金字塔 集成测试 .WEIGHT 0.700 .FIELD 测试
IF 测试金字塔 端到端测试 .WEIGHT 0.600 .FIELD 测试
BELONG 单元测试 测试 .WEIGHT 0.900 .FIELD 测试
BELONG 集成测试 测试 .WEIGHT 0.900 .FIELD 测试
BELONG 端到端测试 测试 .WEIGHT 0.900 .FIELD 测试
SUPPORT 契约测试 集成测试 .WEIGHT 0.700 .FIELD 测试
SUPPORT 测试自动化 回归测试 .WEIGHT 0.800 .FIELD 自动化
SUPPORT 测试自动化 测试 .WEIGHT 0.800 .FIELD 自动化
SUPPORT 测试框架 测试自动化 .WEIGHT 0.800 .FIELD 工具
SUPPORT 断言 测试框架 .WEIGHT 0.700 .FIELD 工具
BELONG Mock 测试替身 .WEIGHT 0.800 .FIELD 替身
BELONG Stub 测试替身 .WEIGHT 0.800 .FIELD 替身
BELONG Fake 测试替身 .WEIGHT 0.800 .FIELD 替身
SUPPORT 测试替身 测试隔离 .WEIGHT 0.700 .FIELD 替身
SUPPORT 测试覆盖率 测试 .WEIGHT 0.600 .FIELD 度量
SUPPORT 分支覆盖 测试覆盖率 .WEIGHT 0.700 .FIELD 度量
SUPPORT 变异测试 测试覆盖率 .WEIGHT 0.700 .FIELD 度量
UNDERMINE 回归测试 缺陷 .WEIGHT 0.800 .FIELD 策略
SUPPORT 冒烟测试 回归测试 .WEIGHT 0.700 .FIELD 策略
UNDERMINE 探索性测试 缺陷 .WEIGHT 0.600 .FIELD 策略
SUPPORT 测试数据管理 测试隔离 .WEIGHT 0.700 .FIELD 数据
SUPPORT 测试环境 测试隔离 .WEIGHT 0.700 .FIELD 环境
UNDERMINE 并行测试 测试稳定性 .WEIGHT 0.600 .FIELD 性能
UNDERMINE Flaky测试 测试稳定性 .WEIGHT 0.800 .FIELD 反模式
UNDERMINE Flaky测试 可预测性 .WEIGHT 0.600 .FIELD 反模式
SUPPORT 测试代码 可维护性 .WEIGHT 0.600 .FIELD 工程
SUPPORT 行为驱动开发 验收测试 .WEIGHT 0.700 .FIELD 方法论
ENTAIL 测试驱动开发 红绿重构 .WEIGHT 0.900 .FIELD 方法论
SUPPORT 红绿重构 测试 .WEIGHT 0.800 .FIELD 方法论
BELONG 验收测试 测试 .WEIGHT 0.700 .FIELD 方法论
SUPPORT 性能测试 负载测试 .WEIGHT 0.800 .FIELD 专项
SUPPORT 压测 负载测试 .WEIGHT 0.800 .FIELD 性能
IF 基准测试 性能瓶颈 .WEIGHT 0.700 .FIELD 性能
SUPPORT 并发测试 压测 .WEIGHT 0.700 .FIELD 性能
SUPPORT 安全测试 渗透测试 .WEIGHT 0.800 .FIELD 安全
SUPPORT 渗透测试 漏洞扫描 .WEIGHT 0.700 .FIELD 安全
SUPPORT 模糊测试 安全测试 .WEIGHT 0.600 .FIELD 安全
BELONG 兼容性测试 测试 .WEIGHT 0.700 .FIELD 专项
BELONG 可用性测试 测试 .WEIGHT 0.600 .FIELD 专项
BELONG 可访问性测试 测试 .WEIGHT 0.600 .FIELD 专项
UNDERMINE 测试 缺陷 .WEIGHT 0.800 .FIELD 测试
SUPPORT 缺陷管理 缺陷密度 .WEIGHT 0.600 .FIELD 流程
SUPPORT 测试报告 质量门禁 .WEIGHT 0.700 .FIELD 流程
SUPPORT 测试计划 测试用例 .WEIGHT 0.700 .FIELD 流程
SUPPORT 用例设计 测试用例 .WEIGHT 0.800 .FIELD 流程
SUPPORT 边界值分析 用例设计 .WEIGHT 0.800 .FIELD 用例
SUPPORT 等价类划分 用例设计 .WEIGHT 0.800 .FIELD 用例
SUPPORT 决策表 用例设计 .WEIGHT 0.700 .FIELD 用例
SUPPORT 状态转换测试 用例设计 .WEIGHT 0.700 .FIELD 用例
SUPPORT 持续集成 测试自动化 .WEIGHT 0.800 .FIELD 工程
IF 质量门禁 持续交付 .WEIGHT 0.700 .FIELD 工程
SUPPORT 可靠性 可预测性 .WEIGHT 0.600 .FIELD 价值
SUPPORT 可维护性 代码可读性 .WEIGHT 0.600 .FIELD 价值