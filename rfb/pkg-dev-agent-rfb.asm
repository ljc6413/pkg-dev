.IMAGE 智能体
.IMAGE Agent
.IMAGE 多智能体系统
.IMAGE 智能体编排
.IMAGE 主管-从属模式
.IMAGE 黑板模式
.IMAGE 议长模式
.IMAGE 工具调用
.IMAGE 函数调用
.IMAGE 工具集
.IMAGE 自主循环
.IMAGE ReAct模式
.IMAGE 规划-执行
.IMAGE 反思
.IMAGE 自省
.IMAGE 记忆
.IMAGE 短期记忆
.IMAGE 长期记忆
.IMAGE 情景记忆
.IMAGE 语义记忆
.IMAGE 向量记忆
.IMAGE 记忆检索
.IMAGE 记忆写入
.IMAGE 记忆遗忘
.IMAGE 上下文管理
.IMAGE Token预算
.IMAGE 上下文压缩
.IMAGE 提示工程
.IMAGE 工具注册
.IMAGE 工具发现
.IMAGE 工具选择
.IMAGE 工具执行
.IMAGE 工具结果
.IMAGE 错误重试
.IMAGE 超时处理
.IMAGE 循环检测
.IMAGE 最大步数
.IMAGE 智能体崩溃
.IMAGE 人机协作
.IMAGE 人工审批
.IMAGE 安全护栏
.IMAGE 权限边界
.IMAGE 工具白名单
.IMAGE 提示注入
.IMAGE 安全
.IMAGE 越狱
.IMAGE 数据泄露
.IMAGE 可观测性
.IMAGE 轨迹追踪
.IMAGE 可解释性
.IMAGE 成本核算
.IMAGE 绩效评估
.IMAGE 智能体评测
.IMAGE 评估基准
.IMAGE LangGraph
.IMAGE 智能体框架
.IMAGE 图状态机
.IMAGE 状态转移
.IMAGE 工作流
.IMAGE 顺序工作流
.IMAGE 并行工作流
.IMAGE 路由
.IMAGE 子任务分解
.IMAGE 任务优先级
.IMAGE 动态重规划
.IMAGE 意图识别
.IMAGE 目标管理
.IMAGE 可靠性
.IMAGE 可预测性
.IMAGE 可维护性
.IMAGE 代码可读性
.IMAGE 测试
.IMAGE 缺陷
.FIELD AGENT
.FIELD 协作
.FIELD 编排
.FIELD 能力
.FIELD 循环
.FIELD 记忆
.FIELD LLM
.FIELD 工具
.FIELD 鲁棒
.FIELD 治理
.FIELD 安全
.FIELD 运营
.FIELD 框架
.FIELD 模式
.FIELD 规划
.FIELD 理解
.FIELD 价值
.FIELD 质量
ENTAIL 智能体 Agent .WEIGHT 0.900 .FIELD AGENT
SUPPORT 智能体 多智能体系统 .WEIGHT 0.800 .FIELD AGENT
IF 多智能体系统 智能体编排 .WEIGHT 0.800 .FIELD 协作
SUPPORT 智能体编排 主管-从属模式 .WEIGHT 0.700 .FIELD 编排
SUPPORT 智能体编排 黑板模式 .WEIGHT 0.600 .FIELD 编排
SUPPORT 智能体编排 议长模式 .WEIGHT 0.600 .FIELD 编排
IF Agent 工具调用 .WEIGHT 0.800 .FIELD 能力
SUPPORT 工具调用 函数调用 .WEIGHT 0.800 .FIELD 能力
IF 工具集 工具调用 .WEIGHT 0.800 .FIELD 能力
IF Agent 自主循环 .WEIGHT 0.800 .FIELD 循环
SUPPORT 自主循环 ReAct模式 .WEIGHT 0.800 .FIELD 循环
SUPPORT 自主循环 规划-执行 .WEIGHT 0.800 .FIELD 循环
SUPPORT 自主循环 反思 .WEIGHT 0.700 .FIELD 循环
SUPPORT 反思 自省 .WEIGHT 0.800 .FIELD 循环
IF Agent 记忆 .WEIGHT 0.800 .FIELD 记忆
BELONG 短期记忆 记忆 .WEIGHT 0.800 .FIELD 记忆
BELONG 长期记忆 记忆 .WEIGHT 0.800 .FIELD 记忆
BELONG 情景记忆 长期记忆 .WEIGHT 0.700 .FIELD 记忆
BELONG 语义记忆 长期记忆 .WEIGHT 0.700 .FIELD 记忆
SUPPORT 向量记忆 长期记忆 .WEIGHT 0.800 .FIELD 记忆
SUPPORT 记忆检索 记忆 .WEIGHT 0.800 .FIELD 记忆
SUPPORT 记忆写入 记忆 .WEIGHT 0.800 .FIELD 记忆
SUPPORT 记忆遗忘 记忆 .WEIGHT 0.600 .FIELD 记忆
IF 上下文管理 Token预算 .WEIGHT 0.800 .FIELD LLM
SUPPORT 上下文压缩 上下文管理 .WEIGHT 0.800 .FIELD LLM
SUPPORT 提示工程 上下文管理 .WEIGHT 0.700 .FIELD LLM
SUPPORT 工具注册 工具发现 .WEIGHT 0.800 .FIELD 工具
SUPPORT 工具发现 工具选择 .WEIGHT 0.800 .FIELD 工具
SUPPORT 工具选择 工具执行 .WEIGHT 0.800 .FIELD 工具
IF 工具执行 工具结果 .WEIGHT 0.800 .FIELD 工具
SUPPORT 错误重试 工具执行 .WEIGHT 0.700 .FIELD 鲁棒
SUPPORT 超时处理 工具执行 .WEIGHT 0.700 .FIELD 鲁棒
SUPPORT 循环检测 自主循环 .WEIGHT 0.700 .FIELD 鲁棒
SUPPORT 最大步数 自主循环 .WEIGHT 0.700 .FIELD 鲁棒
UNDERMINE 智能体崩溃 自主循环 .WEIGHT 0.700 .FIELD 鲁棒
SUPPORT 人机协作 人工审批 .WEIGHT 0.800 .FIELD 治理
SUPPORT 安全护栏 人工审批 .WEIGHT 0.800 .FIELD 治理
SUPPORT 权限边界 安全护栏 .WEIGHT 0.800 .FIELD 治理
SUPPORT 工具白名单 权限边界 .WEIGHT 0.800 .FIELD 治理
UNDERMINE 提示注入 安全 .WEIGHT 0.800 .FIELD 安全
UNDERMINE 越狱 安全 .WEIGHT 0.800 .FIELD 安全
UNDERMINE 数据泄露 安全 .WEIGHT 0.800 .FIELD 安全
IF 可观测性 轨迹追踪 .WEIGHT 0.800 .FIELD 运营
SUPPORT 轨迹追踪 可解释性 .WEIGHT 0.800 .FIELD 运营
SUPPORT 成本核算 可观测性 .WEIGHT 0.700 .FIELD 运营
SUPPORT 绩效评估 智能体评测 .WEIGHT 0.800 .FIELD 运营
SUPPORT 评估基准 智能体评测 .WEIGHT 0.800 .FIELD 运营
SUPPORT LangGraph 智能体框架 .WEIGHT 0.800 .FIELD 框架
SUPPORT 图状态机 LangGraph .WEIGHT 0.800 .FIELD 框架
IF 状态转移 图状态机 .WEIGHT 0.800 .FIELD 框架
BELONG 工作流 顺序工作流 .WEIGHT 0.800 .FIELD 模式
BELONG 工作流 并行工作流 .WEIGHT 0.800 .FIELD 模式
SUPPORT 路由 工作流 .WEIGHT 0.700 .FIELD 模式
SUPPORT 子任务分解 规划-执行 .WEIGHT 0.800 .FIELD 规划
IF 任务优先级 子任务分解 .WEIGHT 0.700 .FIELD 规划
SUPPORT 动态重规划 规划-执行 .WEIGHT 0.700 .FIELD 规划
SUPPORT 意图识别 目标管理 .WEIGHT 0.800 .FIELD 理解
SUPPORT 目标管理 规划-执行 .WEIGHT 0.700 .FIELD 理解
SUPPORT 可解释性 可靠性 .WEIGHT 0.700 .FIELD 价值
SUPPORT 安全 可靠性 .WEIGHT 0.700 .FIELD 价值
SUPPORT 可靠性 可预测性 .WEIGHT 0.600 .FIELD 价值
SUPPORT 可维护性 代码可读性 .WEIGHT 0.600 .FIELD 价值
UNDERMINE 测试 缺陷 .WEIGHT 0.600 .FIELD 质量