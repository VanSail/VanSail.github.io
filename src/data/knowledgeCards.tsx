/**
 * 知识卡片数据（首页底部「知识卡片」区与 /knowledge 总页共用）。
 *
 * 新增卡片只需在此数组追加一项，首页与总页都会自动渲染，无需改动组件。
 * 每项包含：缩写、中文名、英文名、中文释义、英文释义，以及可选分类 cat。
 * cat 用于以后按类别（硬件/软件/AI/协议）筛选或着色，当前不强制。
 */
export type CardCat = 'hw' | 'sw' | 'ai' | 'proto';

export interface KnowledgeCard {
  /** 卡片显示的缩写，如 CPU */
  abbr: string;
  /** 中文全称，如 中央处理器 */
  nameZh: string;
  /** 英文全称，如 Central Processing Unit */
  nameEn: string;
  /** 中文释义，直接显示在卡片上 */
  descZh: string;
  /** 英文释义，直接显示在卡片上 */
  descEn: string;
  /** 可选分类：硬件 / 软件 / AI / 协议 */
  cat?: CardCat;
}

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    abbr: 'ROS',
    nameZh: '机器人操作系统',
    nameEn: 'Robot Operating System',
    descZh:
      '一套用于编写机器人软件的框架，提供硬件抽象、消息通信与丰富工具链。',
    descEn:
      'A framework for writing robot software, offering hardware abstraction, message passing and a rich toolchain.',
    cat: 'hw',
  },
  {
    abbr: 'STM32',
    nameZh: '单片机',
    nameEn: 'STM32 Microcontroller',
    descZh: '基于 ARM Cortex-M 的 32 位微控制器系列，广泛用于嵌入式与物联网。',
    descEn:
      'A family of 32-bit ARM Cortex-M microcontrollers, widely used in embedded and IoT.',
    cat: 'hw',
  },
  {
    abbr: 'MCU',
    nameZh: '微控制器',
    nameEn: 'Microcontroller Unit',
    descZh:
      '集成了处理器、内存与 IO 的单芯片微型计算机，广泛用于嵌入式控制与物联网。',
    descEn:
      'A tiny single-chip computer with processor, memory and IO, widely used in embedded control and IoT.',
    cat: 'hw',
  },
  {
    abbr: 'UART',
    nameZh: '串口通信',
    nameEn: 'Universal Asynchronous Receiver/Transmitter',
    descZh: '最常见的异步串行通信接口，常用于调试与模块间短距离通信。',
    descEn:
      'The most common async serial interface, often used for debugging and short-range module comms.',
    cat: 'proto',
  },
  {
    abbr: 'IMU',
    nameZh: '惯性测量单元',
    nameEn: 'Inertial Measurement Unit',
    descZh: '由加速度计与陀螺仪组成，测量物体的姿态、角速度与加速度。',
    descEn:
      'Combines accelerometers and gyroscopes to measure orientation, angular velocity and acceleration.',
    cat: 'hw',
  },
  {
    abbr: 'PWM',
    nameZh: '脉宽调制',
    nameEn: 'Pulse Width Modulation',
    descZh: '通过调节脉冲占空比来模拟电压，常用于电机调速与 LED 调光。',
    descEn:
      'Varies pulse duty cycle to emulate voltage — common for motor speed and LED dimming.',
    cat: 'hw',
  },
  {
    abbr: 'LiDAR',
    nameZh: '激光雷达',
    nameEn: 'Light Detection and Ranging',
    descZh: '通过激光测距构建三维点云，是机器人与自动驾驶的环境感知核心。',
    descEn:
      'Builds 3D point clouds via laser ranging — core to robot and autonomous perception.',
    cat: 'hw',
  },
  {
    abbr: 'CAN',
    nameZh: '控制器局域网',
    nameEn: 'Controller Area Network',
    descZh: '高可靠的车载/工业串行总线，支持多节点无主机通信与错误检测。',
    descEn:
      'A robust in-vehicle/industrial bus supporting multi-node host-less comms with error detection.',
    cat: 'proto',
  },
  {
    abbr: 'LLM',
    nameZh: '大语言模型',
    nameEn: 'Large Language Model',
    descZh:
      '基于海量文本训练的神经网络模型，能理解与生成自然语言，是 AI 代理的基础。',
    descEn:
      'Neural models trained on massive text, understanding and generating language — the base of AI agents.',
    cat: 'ai',
  },
  {
    abbr: 'AI Agent',
    nameZh: 'AI 代理',
    nameEn: 'AI Agent',
    descZh:
      '能感知环境、自主规划并调用工具完成目标的智能体，是当前 AI 应用的核心形态。',
    descEn:
      'An autonomous entity that perceives, plans and uses tools to reach goals — the core form of AI apps.',
    cat: 'ai',
  },
  {
    abbr: 'HTTP',
    nameZh: '超文本传输协议',
    nameEn: 'HyperText Transfer Protocol',
    descZh:
      '万维网的基础应用层协议，定义客户端与服务器之间如何请求与响应资源。',
    descEn:
      'The foundational web application-layer protocol for client-server resource requests and responses.',
    cat: 'proto',
  },
  {
    abbr: 'Docker',
    nameZh: '容器化平台',
    nameEn: 'Docker',
    descZh: '将应用及其依赖打包为轻量容器，实现跨环境一致运行与快速部署。',
    descEn:
      'Packages apps with dependencies into lightweight containers for consistent, fast cross-environment runs.',
    cat: 'sw',
  },
];
