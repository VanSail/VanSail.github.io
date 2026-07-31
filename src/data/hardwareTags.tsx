/**
 * 硬件名词标签数据（首页底部标签滑动区）。
 *
 * 新增标签只需在此数组追加一项，标签卡片会自动渲染，无需改动组件。
 * 每项包含：缩写、中文名、英文名、中文释义、英文释义（名称与含义直接在卡片上显示）。
 */
export interface HardwareTag {
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
}

export const HARDWARE_TAGS: HardwareTag[] = [
  {
    abbr: 'CPU',
    nameZh: '中央处理器',
    nameEn: 'Central Processing Unit',
    descZh:
      '计算机的运算与控制核心，负责执行通用指令、调度任务，是系统的“大脑”。',
    descEn:
      'The core of computation and control in a computer, executing general-purpose instructions and scheduling tasks — the "brain" of the system.',
  },
  {
    abbr: 'GPU',
    nameZh: '图形处理器',
    nameEn: 'Graphics Processing Unit',
    descZh:
      '擅长大规模并行计算的处理器，最初用于图形渲染，现为 AI 训练与推理的主力。',
    descEn:
      'A processor built for massive parallel computation, originally for graphics rendering and now the workhorse of AI training and inference.',
  },
  {
    abbr: 'NPU',
    nameZh: '神经网络处理器',
    nameEn: 'Neural Processing Unit',
    descZh: '专为神经网络推理与训练设计的加速单元，能效比远高于通用 CPU/GPU。',
    descEn:
      'An accelerator purpose-built for neural-network inference and training, far more power-efficient than general-purpose CPU/GPU.',
  },
  {
    abbr: 'SoC',
    nameZh: '片上系统',
    nameEn: 'System on a Chip',
    descZh:
      '将 CPU、GPU、NPU、内存与外设控制器集成于单颗芯片，常见于手机与嵌入式设备。',
    descEn:
      'Integrates CPU, GPU, NPU, memory and peripheral controllers onto a single chip — common in phones and embedded devices.',
  },
  {
    abbr: 'MCU',
    nameZh: '微控制器',
    nameEn: 'Microcontroller Unit',
    descZh:
      '集成了处理器、内存与 IO 的单芯片微型计算机，广泛用于嵌入式控制与物联网。',
    descEn:
      'A tiny single-chip computer with processor, memory and IO, widely used in embedded control and IoT.',
  },
  {
    abbr: 'DSP',
    nameZh: '数字信号处理器',
    nameEn: 'Digital Signal Processor',
    descZh:
      '专用于数字信号（音频、图像、通信）实时运算的处理器，擅长乘加密集型任务。',
    descEn:
      'A processor specialized for real-time digital-signal (audio, image, comms) math, excelling at multiply-accumulate-heavy tasks.',
  },
  {
    abbr: 'ISP',
    nameZh: '图像信号处理器',
    nameEn: 'Image Signal Processor',
    descZh:
      '负责相机原始 sensor 数据的降噪、色彩与曝光处理，直接决定成像质量。',
    descEn:
      'Processes raw camera-sensor data — denoising, color and exposure — directly determining image quality.',
  },
  {
    abbr: 'VPU',
    nameZh: '视觉处理器',
    nameEn: 'Vision Processing Unit',
    descZh:
      '面向机器视觉与视频分析的专用加速单元，常用于摄像头、无人机与机器人。',
    descEn:
      'A dedicated accelerator for machine vision and video analytics, often in cameras, drones and robots.',
  },
  {
    abbr: 'TPU',
    nameZh: '张量处理器',
    nameEn: 'Tensor Processing Unit',
    descZh:
      '为张量运算（矩阵乘）优化的专用 AI 加速芯片，主打大规模推理与训练吞吐。',
    descEn:
      'An AI accelerator optimized for tensor (matrix-multiply) ops, targeting large-scale inference and training throughput.',
  },
  {
    abbr: 'FPGA',
    nameZh: '现场可编程门阵列',
    nameEn: 'Field-Programmable Gate Array',
    descZh:
      '可通过编程重塑硬件电路的可重构芯片，兼具灵活性与高并行低延迟特性。',
    descEn:
      'A reconfigurable chip whose hardware can be reprogrammed, blending flexibility with high parallelism and low latency.',
  },
];
