/**
 * 知识卡片数据（首页底部「知识卡片」区与 /knowledge 总页共用）。
 *
 * 新增卡片只需在此数组追加一项，首页与总页都会自动渲染，无需改动组件。
 * 每项包含：缩写、中文名、英文名、中文释义、英文释义，以及可选分类 cat。
 * cat 用于以后按类别（硬件/软件/AI/协议）筛选或着色，当前不强制。
 */
export type CardCat =
  'hardware' | 'ai' | 'programming' | 'embedded' | 'robotics' | 'protocol';

/** 分类元信息：决定分组顺序、标题与配色，新增分类只需在此追加一项 */
export interface CardCatMeta {
  id: CardCat;
  label: {zh: string; en: string};
  /** 卡片左上角小标签文案 */
  tag: {zh: string; en: string};
  /** 主题色（用于分类标题与卡片描边点缀） */
  color: string;
}

export const CARD_CATS: CardCatMeta[] = [
  {
    id: 'hardware',
    label: {zh: '硬件', en: 'Hardware'},
    tag: {zh: '硬件', en: 'Hardware'},
    color: '#34c08b',
  },
  {
    id: 'ai',
    label: {zh: 'AI', en: 'AI'},
    tag: {zh: 'AI', en: 'AI'},
    color: '#b07cff',
  },
  {
    id: 'programming',
    label: {zh: '编程', en: 'Programming'},
    tag: {zh: '编程', en: 'Programming'},
    color: '#5bc0eb',
  },
  {
    id: 'embedded',
    label: {zh: '嵌入式', en: 'Embedded'},
    tag: {zh: '嵌入式', en: 'Embedded'},
    color: '#34c08b',
  },
  {
    id: 'robotics',
    label: {zh: '机器人', en: 'Robotics'},
    tag: {zh: '机器人', en: 'Robotics'},
    color: '#4f9dff',
  },
  {
    id: 'protocol',
    label: {zh: '协议', en: 'Protocol'},
    tag: {zh: '协议', en: 'Protocol'},
    color: '#f0a070',
  },
];

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
  /** 分类：机器人 / 嵌入式 / AI / 协议，用于分组展示 */
  cat: CardCat;
}

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  // ===================== 硬件 hardware（来自 AISystem 仓库 02Hardware） =====================
  {
    abbr: 'CPU',
    nameZh: '中央处理器',
    nameEn: 'Central Processing Unit',
    descZh:
      '执行指令与计算、控制计算机所有组件的处理器，基于冯·诺依曼架构，擅长通用与低延迟任务。',
    descEn:
      'The processor that executes instructions and controls all components, based on the von Neumann architecture; strong at general-purpose, low-latency tasks.',
    cat: 'hardware',
  },
  {
    abbr: 'GPU',
    nameZh: '图形处理器',
    nameEn: 'Graphics Processing Unit',
    descZh:
      '负责图形与图像处理的部件，拥有大量并行计算单元（ALU），如今也是深度学习与科学计算的主力加速器。',
    descEn:
      'The component for graphics and image processing, packed with parallel ALUs; now also the main accelerator for deep learning and HPC.',
    cat: 'hardware',
  },
  {
    abbr: 'NPU',
    nameZh: '神经网络处理器',
    nameEn: 'Neural Processing Unit',
    descZh:
      '面向深度学习的 AI 专用处理器（DSA），以大量 AI Core 高效完成矩阵乘加，能效优于通用 CPU/GPU。',
    descEn:
      'A deep-learning-specific processor (DSA) with many AI Cores for efficient MACs, more energy-efficient than general CPUs/GPUs.',
    cat: 'hardware',
  },
  {
    abbr: 'TPU',
    nameZh: '张量处理器',
    nameEn: 'Tensor Processing Unit',
    descZh:
      '谷歌设计的机器学习专用集成电路（ASIC），采用脉动阵列与低精度计算加速矩阵运算，含多代迭代与 Edge TPU 等。',
    descEn:
      'Google’s ML-specific ASIC using systolic arrays and low-precision compute to accelerate matrix math, with several generations plus Edge TPU.',
    cat: 'hardware',
  },
  {
    abbr: 'OPS',
    nameZh: '每秒操作数',
    nameEn: 'Operations Per Second',
    descZh:
      '衡量芯片算力的最基本单位，表示每秒可执行的操作次数；衍生指标 OPS/W 表示每瓦特运算性能。',
    descEn:
      'The base unit of compute throughput — operations executed per second; OPS/W extends it to operations per watt.',
    cat: 'hardware',
  },
  {
    abbr: 'MACs',
    nameZh: '乘加累计操作',
    nameEn: 'Multiply-Accumulate Operations',
    descZh:
      '一次乘加操作，包含一个乘法与一个加法，通常 1 MACs = 2 FLOPs；是评估模型计算量与芯片算力的基本单元。',
    descEn:
      'One multiply-accumulate step = one multiply plus one add; conventionally 1 MACs = 2 FLOPs — the basic unit for model and chip compute.',
    cat: 'hardware',
  },
  {
    abbr: 'FLOPs',
    nameZh: '浮点运算次数',
    nameEn: 'Floating Point Operations',
    descZh:
      '衡量模型计算复杂度的指标（如卷积层 FLOPs = 2·H·W·Cin·K·K·Cout），常作为神经网络速度与硬件算力的间接参照。',
    descEn:
      'A measure of model compute complexity (e.g. conv FLOPs = 2·H·W·Cin·K·K·Cout), often used as an indirect proxy for network speed and hardware capacity.',
    cat: 'hardware',
  },
  {
    abbr: 'TOPS',
    nameZh: '每秒万亿次操作',
    nameEn: 'Tera Operations Per Second',
    descZh:
      '处理器算力指标，1 TOPS 表示每秒进行 10¹² 次操作；TOPS/W 用于评价 1W 功耗下的运算能力。',
    descEn:
      'A compute metric where 1 TOPS = 10¹² operations per second; TOPS/W rates operations per watt of power.',
    cat: 'hardware',
  },
  {
    abbr: 'Tensor Core',
    nameZh: '张量核心',
    nameEn: 'Tensor Core',
    descZh:
      '英伟达 GPU 中专用于 AI 与 HPC 的硬件核心，以混合精度高效完成 D=A×B+C 形式的矩阵乘加，加速深度学习训练与推理。',
    descEn:
      'NVIDIA GPU units specialized for mixed-precision matrix MACs; one Tensor Core does a 4×4×4 D=A×B+C multiply-add per clock, speeding up deep learning.',
    cat: 'hardware',
  },
  {
    abbr: 'NVLink',
    nameZh: '英伟达高速互联',
    nameEn: 'NVLink',
    descZh:
      '英伟达推出的 GPU 间高速点对点互联技术，带宽远高于 PCIe，用于多卡训练时的高吞吐通信。',
    descEn:
      'NVIDIA’s high-speed GPU-to-GPU interconnect, far wider than PCIe, enabling high-throughput comms in multi-card training.',
    cat: 'hardware',
  },
  {
    abbr: 'Accuracy',
    nameZh: '精度',
    nameEn: 'Accuracy',
    descZh:
      '两重含义：计算精度指支持的计算位宽（如 FP32/FP16）；模型效果精度指输出与真实结果的接近程度（如 ImageNet 准确率）。',
    descEn:
      'Two senses: compute precision = supported bit-width (e.g. FP32/FP16); model accuracy = how close outputs are to ground truth (e.g. ImageNet top-1).',
    cat: 'hardware',
  },
  {
    abbr: 'Throughput',
    nameZh: '吞吐量',
    nameEn: 'Throughput',
    descZh:
      '芯片在单位时间内能处理的数据量；多核心可并行处理更多任务，吞吐量更高。',
    descEn:
      'The amount of data a chip processes per unit time; more cores enable more parallel work and higher throughput.',
    cat: 'hardware',
  },
  {
    abbr: 'Latency',
    nameZh: '时延',
    nameEn: 'Latency',
    descZh:
      '从输入数据传入到输出结果产生的时间间隔；自动驾驶等场景要求低推理时延。',
    descEn:
      'The time interval from input entering the chip to the result emerging; autonomous driving demands low inference latency.',
    cat: 'hardware',
  },
  {
    abbr: 'Energy',
    nameZh: '能耗',
    nameEn: 'Energy',
    descZh:
      '执行 AI 任务时芯片消耗的能量，受架构、工艺、负载与优化影响；移动/物联网设备需权衡性能与能效。',
    descEn:
      'Energy a chip consumes running AI tasks, shaped by architecture, process, workload and optimization; edge/IoT must trade performance vs efficiency.',
    cat: 'hardware',
  },
  {
    abbr: 'BitWidth',
    nameZh: '计算位宽',
    nameEn: 'Bit Width',
    descZh:
      '参与运算的数据比特数（如 INT8/FP16/FP32）；位宽越小计算越快、越省电，但可能损失精度。',
    descEn:
      'The number of bits per operand (e.g. INT8/FP16/FP32); narrower widths are faster and cheaper but may lose accuracy.',
    cat: 'hardware',
  },
  {
    abbr: 'SIMD',
    nameZh: '单指令多数据',
    nameEn: 'Single Instruction Multiple Data',
    descZh:
      '一条指令同时对多个数据执行相同操作，利用数据级并行；CPU 向量化与 GPU 并行均基于此思想。',
    descEn:
      'One instruction operates on multiple data at once, exploiting data-level parallelism; the basis of CPU vectorization and GPU parallelism.',
    cat: 'hardware',
  },
  {
    abbr: 'SIMT',
    nameZh: '单指令多线程',
    nameEn: 'Single Instruction Multiple Threads',
    descZh:
      '英伟达 GPU 的执行模型：多个线程执行同一指令但各有独立上下文，是 CUDA 编程的核心抽象。',
    descEn:
      'NVIDIA GPU’s execution model: many threads run one instruction with independent contexts — the core abstraction of CUDA programming.',
    cat: 'hardware',
  },
  {
    abbr: 'DSA',
    nameZh: '领域特定架构',
    nameEn: 'Domain-Specific Architecture',
    descZh:
      '为特定领域（如深度学习）定制的加速器架构，相比通用 CPU 可大幅提升性能与能效；NPU/TPU 均属此类。',
    descEn:
      'An accelerator architecture tailored to a domain (e.g. deep learning), far more efficient than general CPUs; NPU/TPU are examples.',
    cat: 'hardware',
  },
  {
    abbr: 'CUDA',
    nameZh: '统一计算架构',
    nameEn: 'Compute Unified Device Architecture',
    descZh:
      '英伟达的 GPU 通用并行编程平台，让开发者直接用 C/C++ 编写核函数调用 GPU 大规模并行算力。',
    descEn:
      'NVIDIA’s general GPU parallel programming platform; developers write kernels in C/C++ to harness massive GPU parallelism.',
    cat: 'hardware',
  },
  {
    abbr: 'Roofline',
    nameZh: '屋顶线模型',
    nameEn: 'Roofline Model',
    descZh:
      '性能可视化模型：P = min(峰值算力, 算术强度×带宽)，用于判断程序受算力墙还是内存墙限制。',
    descEn:
      'A performance model: P = min(peak compute, arithmetic intensity × bandwidth), showing whether a workload is compute- or memory-bound.',
    cat: 'hardware',
  },
  {
    abbr: 'Cortex-A',
    nameZh: 'Cortex-A 处理器',
    nameEn: 'ARM Cortex-A',
    descZh:
      'ARM 面向应用处理器的微架构（基于 ARMv7-A/ARMv8），支持 MMU 与虚拟内存，常运行 Linux/Android 等富操作系统；区别于侧重控制的 Cortex-M。',
    descEn:
      'ARM’s application-processor microarchitecture (ARMv7-A/v8) with MMU and virtual memory, running Linux/Android; distinct from control-oriented Cortex-M.',
    cat: 'hardware',
  },
  {
    abbr: 'Endianness',
    nameZh: '字节序',
    nameEn: 'Endianness',
    descZh:
      '多字节数据在内存中的存放顺序：小端（little-endian）低字节在低地址，大端（big-endian）反之。跨平台/网络传输时需统一字节序以免解析错误。',
    descEn:
      'Byte order of multi-byte data: little-endian puts the low byte at the low address, big-endian the reverse; align it across platforms/networks.',
    cat: 'hardware',
  },
  {
    abbr: 'MMU',
    nameZh: '内存管理单元',
    nameEn: 'Memory Management Unit',
    descZh:
      '把虚拟地址转换为物理地址的硬件，支撑多任务隔离、虚拟内存与按需分页；运行 Linux 等操作系统通常依赖 MMU。',
    descEn:
      'Hardware translating virtual to physical addresses, enabling task isolation, virtual memory and demand paging — required by Linux-class OSes.',
    cat: 'hardware',
  },
  {
    abbr: 'Cache',
    nameZh: '高速缓存',
    nameEn: 'Cache',
    descZh:
      '贴近 CPU、容量小但极快的存储器，缓存最近访问的数据副本，利用程序局部性加速访存。对程序员透明，但多核下可能引发缓存一致性问题。',
    descEn:
      'A small, fast memory near the CPU caching recent data copies, exploiting locality to speed access; transparent but raises coherency issues on multicore.',
    cat: 'hardware',
  },
  {
    abbr: 'Pipeline',
    nameZh: '指令流水线',
    nameEn: 'Pipeline',
    descZh:
      'RISC 处理器让取指、译码、执行等多条指令重叠工作的技术，像汽车生产线并行处理各阶段以提升吞吐；分支跳转会打断流水线。',
    descEn:
      'A RISC technique overlapping fetch/decode/execute of multiple instructions like an assembly line to raise throughput; branches stall it.',
    cat: 'hardware',
  },
  {
    abbr: 'AMBA',
    nameZh: 'ARM 片上总线',
    nameEn: 'AMBA (AXI/AHB/APB)',
    descZh:
      'ARM 制定的片上总线规范，连接 CPU 与外设。AXI 面向高性能（突发、乱序），AHB 面向高带宽系统，APB 面向低功耗低速外设。',
    descEn:
      'ARM’s on-chip bus spec linking CPU and peripherals: AXI for high-performance (burst, out-of-order), AHB for high-bandwidth subsystems, APB for low-power slow slaves.',
    cat: 'hardware',
  },
  {
    abbr: 'LPDDR5',
    nameZh: '低功耗 DDR5 内存',
    nameEn: 'LPDDR5',
    descZh:
      '低功耗 DDR SDRAM 家族一员（JEDEC 2019 标准），面向手机/笔记本等移动设备；与 DDR5 是独立标准、版本号不表示同源。峰值速率 6400 MT/s，较 LPDDR4 翻倍。',
    descEn:
      'A Low-Power DDR SDRAM (JEDEC 2019) for phones/laptops. Independent from DDR5 — same version number, different standard. Peaks at 6400 MT/s, 2× LPDDR4.',
    cat: 'hardware',
  },
  {
    abbr: 'MT/s',
    nameZh: '百万次传输每秒',
    nameEn: 'MT/s',
    descZh:
      '衡量总线有效传输率的指标：每秒百万次数据传输操作。DDR 在时钟双沿均传输，故 MT/s 常高于内部时钟 MHz；内存带宽 = MT/s × 位宽 ÷ 8。',
    descEn:
      'Megatransfers per second: effective bus transfers per second. With DDR (data on both clock edges) MT/s exceeds the internal clock MHz; bandwidth = MT/s × width ÷ 8.',
    cat: 'hardware',
  },
  {
    abbr: 'eMMC',
    nameZh: '嵌入式多媒体卡',
    nameEn: 'eMMC',
    descZh:
      '将 NAND 闪存与控制器集成于单颗 BGA 封装、焊接在主板上的固态存储，不可插拔；8 位并行半双工。曾广泛用于手机/入门设备，速率低于 UFS/NVMe。',
    descEn:
      'NAND flash + controller in one soldered BGA package (non-removable), 8-bit parallel half-duplex. Common in phones/budget devices; slower than UFS/NVMe.',
    cat: 'hardware',
  },
  {
    abbr: 'UFS',
    nameZh: '通用闪存存储',
    nameEn: 'UFS',
    descZh:
      '面向手机等移动设备的闪存规范，用 MIPI M-PHY 串行全双工接口，基于 SCSI 命令队列；速率与扩展性优于 eMMC 的并行半双工方案（如 UFS 4.0 达 5.8 GB/s）。',
    descEn:
      'Flash spec for mobiles using MIPI M-PHY serial full-duplex with SCSI command queuing; faster and more scalable than eMMC (UFS 4.0 ≈ 5.8 GB/s).',
    cat: 'hardware',
  },
  {
    abbr: 'NVMe',
    nameZh: '高速固态硬盘协议',
    nameEn: 'NVMe SSD',
    descZh:
      '基于 PCIe 的非易失存储接口协议，充分发挥 SSD 低延迟与内部并行性；多队列、全双工，带宽远超 SATA/AHCI（后者为机械硬盘设计）。常见于 M.2 形态。',
    descEn:
      'A PCIe-based SSD interface exploiting low latency and internal parallelism with deep queues and full-duplex, far faster than SATA/AHCI; usually M.2.',
    cat: 'hardware',
  },
  {
    abbr: 'MIPI CSI',
    nameZh: '摄像头串行接口',
    nameEn: 'MIPI CSI',
    descZh:
      'MIPI 联盟制定的摄像头串行接口规范，连接图像传感器/摄像头模组与处理器（SoC），是手机、平板等移动设备的主流摄像头接口。',
    descEn:
      'The MIPI Alliance camera serial interface linking image sensors/modules to the SoC; the mainstream camera interface in phones and tablets.',
    cat: 'hardware',
  },
  {
    abbr: 'MIPI DSI',
    nameZh: '显示串行接口',
    nameEn: 'MIPI DSI',
    descZh:
      'MIPI 联盟制定的显示串行接口规范，连接处理器（SoC）与显示屏模组，是移动设备液晶/OLED 屏的主流高速显示接口。',
    descEn:
      'The MIPI Alliance display serial interface linking the SoC to display panels; the mainstream high-speed screen interface in mobile devices.',
    cat: 'hardware',
  },

  // ===================== AI（编译 / 推理 / 框架，来自 AISystem 仓库 03-05 模块） =====================
  {
    abbr: 'AI Compiler',
    nameZh: 'AI 编译器',
    nameEn: 'AI Compiler',
    descZh:
      '将神经网络模型转换为高效底层代码的编译器，含前端图优化与后端 Kernel/AutoTuning 优化。',
    descEn:
      'A compiler that turns neural models into efficient low-level code, with frontend graph passes and backend kernel/auto-tuning.',
    cat: 'ai',
  },
  {
    abbr: 'IR',
    nameZh: '中间表示',
    nameEn: 'Intermediate Representation',
    descZh:
      '编译器在前后端之间传递的程序抽象表示，使优化与硬件映射解耦，是 AI 编译器的核心。',
    descEn:
      'The abstract program form passed between compiler frontend and backend, decoupling optimization from hardware mapping — core to AI compilers.',
    cat: 'ai',
  },
  {
    abbr: 'OP Fusion',
    nameZh: '算子融合',
    nameEn: 'Operator Fusion',
    descZh:
      '将多个相邻算子合并为一个 Kernel 的前端优化，减少内存读写与调度开销，提升推理性能。',
    descEn:
      'A frontend pass that merges adjacent operators into one kernel, cutting memory traffic and launch overhead to boost inference.',
    cat: 'ai',
  },
  {
    abbr: 'Quantization',
    nameZh: '量化',
    nameEn: 'Quantization',
    descZh:
      '将模型权重/激活从高精度（FP32）映射到低位宽（INT8 等）的压缩技术，降低存储与计算开销。',
    descEn:
      'Mapping weights/activations from high precision (FP32) to low bit-width (INT8 etc.) to shrink storage and compute cost.',
    cat: 'ai',
  },
  {
    abbr: 'Pruning',
    nameZh: '剪枝',
    nameEn: 'Pruning',
    descZh:
      '移除模型中不重要的连接或通道以压缩模型、加速推理，是模型压缩「四件套」之一。',
    descEn:
      'Removing unimportant connections or channels to compress the model and speed inference — one of the model-compression "four essentials".',
    cat: 'ai',
  },
  {
    abbr: 'Distillation',
    nameZh: '知识蒸馏',
    nameEn: 'Knowledge Distillation',
    descZh:
      '用大模型（教师）指导小模型（学生）训练，使小模型在压缩后保留接近大模型的效果。',
    descEn:
      'Training a small "student" under a large "teacher" so the compact model keeps near-teacher quality.',
    cat: 'ai',
  },
  {
    abbr: 'Model Compression',
    nameZh: '模型压缩',
    nameEn: 'Model Compression',
    descZh:
      '通过量化、剪枝、蒸馏、二值化等手段减小模型体积与计算量，便于在端侧与嵌入式部署。',
    descEn:
      'Shrinking model size and compute via quantization, pruning, distillation and binarization for edge/embedded deployment.',
    cat: 'ai',
  },
  {
    abbr: 'AutoDiff',
    nameZh: '自动微分',
    nameEn: 'Automatic Differentiation',
    descZh:
      '框架自动计算梯度的方式（前向/反向模式），是训练神经网络、更新参数的基础能力。',
    descEn:
      'How frameworks compute gradients automatically (forward/reverse mode) — the foundation of neural-network training.',
    cat: 'ai',
  },
  {
    abbr: 'Compute Graph',
    nameZh: '计算图',
    nameEn: 'Compute Graph',
    descZh:
      '用图表示神经网络的算子与数据流，支持图优化、图执行与控制流，是 AI 框架的核心抽象。',
    descEn:
      'A graph representing operators and data flow of a network, enabling graph optimization, execution and control flow — the core abstraction of AI frameworks.',
    cat: 'ai',
  },
  {
    abbr: 'Data Parallel',
    nameZh: '数据并行',
    nameEn: 'Data Parallelism',
    descZh:
      '多设备各持完整模型、切分不同数据 batch 训练的分布式策略，是最常用的并行方式。',
    descEn:
      'Each device holds the full model and trains on a different data batch — the most common distributed strategy.',
    cat: 'ai',
  },
  {
    abbr: 'Tensor Parallel',
    nameZh: '张量并行',
    nameEn: 'Tensor Parallelism',
    descZh:
      '将单层权重矩阵切分到多设备并协同计算的并行策略，用于突破单卡显存与算力上限。',
    descEn:
      'Splitting a layer’s weight matrix across devices that compute together, breaking single-card memory and compute limits.',
    cat: 'ai',
  },
  {
    abbr: 'Pipeline Parallel',
    nameZh: '流水线并行',
    nameEn: 'Pipeline Parallelism',
    descZh:
      '按层将模型切分到不同设备、以微批次流水线方式执行的并行策略，提升大模型训练设备利用率。',
    descEn:
      'Splitting the model by layers across devices and executing micro-batches as a pipeline, raising device utilization for large models.',
    cat: 'ai',
  },
  {
    abbr: 'Inference Engine',
    nameZh: '推理引擎',
    nameEn: 'Inference Engine',
    descZh:
      '将训练好的模型部署到硬件并高效执行推理的运行时系统（如 MindIE、TensorRT），含转换、优化与调度。',
    descEn:
      'A runtime that deploys trained models and runs inference efficiently on hardware (e.g. MindIE, TensorRT), with conversion, optimization and scheduling.',
    cat: 'ai',
  },
  {
    abbr: 'RKNN',
    nameZh: '瑞芯微神经网络工具链',
    nameEn: 'Rockchip Neural Network',
    descZh:
      '瑞芯微（Rockchip）NPU 的推理工具链与运行时：RKNN-Toolkit2 将 PyTorch/TensorFlow 等模型转为 .rknn，再于板端 librknn 运行时高效执行推理，覆盖 RK356X/RK3588 等 SoC。',
    descEn:
      'Rockchip’s NPU inference toolkit and runtime: RKNN-Toolkit2 converts PyTorch/TensorFlow models to .rknn, then the on-board librknn runtime runs inference efficiently on SoCs like RK356X/RK3588.',
    cat: 'ai',
  },
  {
    abbr: 'RKNN-Toolkit2',
    nameZh: '瑞芯微模型转换与量化工具',
    nameEn: 'RKNN-Toolkit2',
    descZh:
      '瑞芯微官方 Python 工具包，负责把 PyTorch/TensorFlow/ONNX 等模型转为 .rknn，并提供量化（INT8/INT4）、精度评估与性能分析，最终在板端 librknn 运行时部署到 RK356X/RK3588 等 NPU。',
    descEn:
      'Rockchip’s official Python toolkit that converts PyTorch/TensorFlow/ONNX models to .rknn, with quantization (INT8/INT4), accuracy evaluation and profiling, then deploys on RK356X/RK3588 NPUs via the on-board librknn runtime.',
    cat: 'ai',
  },
  {
    abbr: 'ZeRO',
    nameZh: '零冗余优化器',
    nameEn: 'Zero Redundancy Optimizer',
    descZh:
      '微软提出的数据并行显存优化技术，将优化器状态/梯度/参数分片到各卡，消除冗余副本以训练超大模型。',
    descEn:
      'Microsoft’s memory-efficient data-parallel technique that shards optimizer/gradient/parameter across devices, removing redundant copies to train huge models.',
    cat: 'ai',
  },
  {
    abbr: 'Mixed Precision',
    nameZh: '混合精度',
    nameEn: 'Mixed Precision',
    descZh:
      '在前向/反向用 FP16/BF16、累加用 FP32 的混合数值格式训练，兼顾速度与稳定性、降低显存占用。',
    descEn:
      'Training with FP16/BF16 for forward/backward and FP32 for accumulation — balancing speed, stability and memory.',
    cat: 'ai',
  },
  {
    abbr: 'Winograd',
    nameZh: '维诺格拉德卷积',
    nameEn: 'Winograd Convolution',
    descZh:
      '通过多项式变换减少乘法次数的卷积加速算法，在 3×3 卷积上可显著降低计算量。',
    descEn:
      'A convolution-speedup algorithm using polynomial transforms to cut multiplications, notably cheaper for 3×3 convolutions.',
    cat: 'ai',
  },
  {
    abbr: 'Im2col',
    nameZh: '图像转列',
    nameEn: 'Image to Columns',
    descZh:
      '将卷积的局部窗口展平为列、把卷积转为矩阵乘法的经典优化，便于复用高效 GEMM 库。',
    descEn:
      'Flattens convolution windows into columns to turn conv into a GEMM — a classic trick reusing fast matrix-multiply libraries.',
    cat: 'ai',
  },
  {
    abbr: 'MindSpore',
    nameZh: '昇思框架',
    nameEn: 'MindSpore',
    descZh:
      '华为开源的全场景 AI 框架，支持端边云协同、动静态图统一与自动并行，对标 PyTorch/TensorFlow。',
    descEn:
      'Huawei’s open full-scenario AI framework with device-edge-cloud synergy, unified eager/graph mode and auto-parallel — rival to PyTorch/TensorFlow.',
    cat: 'ai',
  },
  {
    abbr: 'CANN',
    nameZh: '异构计算架构',
    nameEn: 'Compute Architecture for Neural Networks',
    descZh:
      '华为昇腾的软件栈，衔接上层框架与底层芯片，提供算子库、图引擎与运行时，类似英伟达的 CUDA 生态。',
    descEn:
      'Huawei Ascend’s software stack bridging frameworks and chips — operator libs, graph engine and runtime, akin to NVIDIA’s CUDA ecosystem.',
    cat: 'ai',
  },
  {
    abbr: 'AscendC',
    nameZh: '昇腾算子开发',
    nameEn: 'AscendC',
    descZh:
      '基于 C/C++ 的昇腾算子编程语言，提供矢量/矩阵/搬移 API，让开发者在 NPU 上高效实现自定义算子。',
    descEn:
      'Huawei’s C/C++ operator programming language for Ascend, with vector/matrix/copy APIs to write efficient custom NPU operators.',
    cat: 'ai',
  },
  {
    abbr: 'MobileNet',
    nameZh: 'MobileNet 网络',
    nameEn: 'MobileNet',
    descZh:
      '谷歌为移动与嵌入式视觉设计的轻量卷积网络系列，以深度可分离卷积大幅削减参数量与算力，兼顾精度与端侧实时性。',
    descEn:
      'Google’s lightweight CNN family for mobile and embedded vision; depthwise separable convolutions slash params and compute while keeping accuracy and on-device real-time speed.',
    cat: 'ai',
  },

  // ===================== 编程 programming（来自《C Primer Plus 第6版》C 语言核心概念） =====================
  {
    abbr: 'C',
    nameZh: 'C 语言',
    nameEn: 'C Language',
    descZh:
      '1972 年由 Dennis Ritchie 开发的通用过程式编程语言，贴近硬件且可移植，是 C++/Java/Python 等语言的基础。',
    descEn:
      'A general-purpose procedural language created by Dennis Ritchie in 1972 — close to hardware yet portable, and the root of C++/Java/Python.',
    cat: 'programming',
  },
  {
    abbr: 'Data Type',
    nameZh: '数据类型',
    nameEn: 'Data Type',
    descZh:
      '规定变量所占内存与可进行的运算，C 基本类型含 int、char、float、double 及 _Bool、_Complex 等。',
    descEn:
      'Defines a variable’s memory layout and allowed operations; C basics include int, char, float, double plus _Bool, _Complex, etc.',
    cat: 'programming',
  },
  {
    abbr: 'Array',
    nameZh: '数组',
    nameEn: 'Array',
    descZh:
      '由同类型元素在连续内存中顺序排列而成的聚合类型，通过下标访问；数组名常退化为指向首元素的指针。',
    descEn:
      'A contiguous sequence of same-type elements accessed by index; an array name often decays to a pointer to its first element.',
    cat: 'programming',
  },
  {
    abbr: 'Pointer',
    nameZh: '指针',
    nameEn: 'Pointer',
    descZh:
      '存放内存地址的变量，是 C 的核心；支持间接访问（*）、取地址（&）与指针算术，是数组与函数参数的基础。',
    descEn:
      'A variable holding a memory address — central to C; enables dereference (*), address-of (&) and pointer arithmetic, underpinning arrays and params.',
    cat: 'programming',
  },
  {
    abbr: 'Function',
    nameZh: '函数',
    nameEn: 'Function',
    descZh:
      '完成特定任务的独立代码块，含返回类型、名、形参与体；通过 return 返回值，是 C 程序的基本组织单位。',
    descEn:
      'A self-contained block with return type, name, parameters and body; returns via return — the basic unit of a C program.',
    cat: 'programming',
  },
  {
    abbr: 'Struct',
    nameZh: '结构体',
    nameEn: 'Structure',
    descZh:
      '把不同类型成员聚合为一个整体的自定义类型；用 . 访问成员，指针用 -> 访问，是组织复杂数据的核心。',
    descEn:
      'A user type bundling members of different types; access with . (or -> via pointer) — core for organizing complex data.',
    cat: 'programming',
  },
  {
    abbr: 'Union',
    nameZh: '联合体',
    nameEn: 'Union',
    descZh:
      '与结构体类似但所有成员共享同一段内存，同一时刻只存一个成员，常用于节省空间或类型重解释。',
    descEn:
      'Like a struct but all members share one memory region, holding one at a time — used to save space or reinterpret bits.',
    cat: 'programming',
  },
  {
    abbr: 'Control Flow',
    nameZh: '控制流',
    nameEn: 'Control Flow',
    descZh:
      '决定语句执行顺序的结构：分支 if/else/switch 与循环 for/while/do-while，以及 break/continue/goto 跳转。',
    descEn:
      'Structures that decide execution order: branches if/else/switch and loops for/while/do-while, plus break/continue/goto jumps.',
    cat: 'programming',
  },
  {
    abbr: 'Preprocessor',
    nameZh: '预处理器',
    nameEn: 'Preprocessor',
    descZh:
      '编译前对源码做文本处理的阶段，常见指令 #define、#include、#ifdef/#endif 与宏展开、条件编译。',
    descEn:
      'A text-processing stage before compilation: directives like #define, #include, #ifdef/#endif for macro expansion and conditional compilation.',
    cat: 'programming',
  },
  {
    abbr: 'Macro',
    nameZh: '宏',
    nameEn: 'Macro',
    descZh:
      '由 #define 定义的文本替换规则，可带参数；在预处理阶段展开，常用于常量、内联小函数与跨平台兼容。',
    descEn:
      'A textual substitution rule defined by #define, optionally parameterized; expanded at preprocessing for constants, tiny inline code and portability.',
    cat: 'programming',
  },
  {
    abbr: 'Storage Class',
    nameZh: '存储类别',
    nameEn: 'Storage Class',
    descZh:
      '决定变量作用域与生命期的属性：auto、static、extern、register，以及 C11 的 _Thread_local、_Atomic。',
    descEn:
      'Attributes deciding a variable’s scope and lifetime: auto, static, extern, register, plus C11’s _Thread_local and _Atomic.',
    cat: 'programming',
  },
  {
    abbr: 'Memory Mgmt',
    nameZh: '内存管理',
    nameEn: 'Memory Management',
    descZh:
      '程序运行时在堆上用 malloc/calloc 分配、free 释放内存；需手动配对以防内存泄漏与悬空指针。',
    descEn:
      'Allocating on the heap with malloc/calloc and freeing with free at runtime; must be paired manually to avoid leaks and dangling pointers.',
    cat: 'programming',
  },
  {
    abbr: 'String',
    nameZh: '字符串',
    nameEn: 'String',
    descZh:
      'C 中字符串是以 `\0` 结尾的 char 数组，<string.h> 提供 strlen/strcpy/strcmp 等处理函数。',
    descEn:
      "In C a string is a '\\0'-terminated char array; <string.h> offers strlen/strcpy/strcmp and friends.",
    cat: 'programming',
  },
  {
    abbr: 'File I/O',
    nameZh: '文件输入输出',
    nameEn: 'File Input/Output',
    descZh:
      '用 FILE* 与 fopen/fclose 打开关闭文件，配合 fscanf/fprintf/fseek 等读写，实现程序与外存的数据交换。',
    descEn:
      'Uses FILE* with fopen/fclose and fscanf/fprintf/fseek to read/write, exchanging data between program and storage.',
    cat: 'programming',
  },
  {
    abbr: 'Bitwise Op',
    nameZh: '位运算',
    nameEn: 'Bitwise Operation',
    descZh:
      '直接对整数逐位操作：按位与 &、或 |、异或 ^、取反 ~，以及移位 <<、>>，常用于底层与标志位控制。',
    descEn:
      'Operates on integer bits directly: AND &, OR |, XOR ^, NOT ~, and shifts <<, >> — common in low-level and flag control.',
    cat: 'programming',
  },
  {
    abbr: 'Header File',
    nameZh: '头文件',
    nameEn: 'Header File',
    descZh:
      '以 .h 结尾、用 #include 引入的文件，通常含函数原型、宏与类型定义，便于模块化与代码复用。',
    descEn:
      'A .h file pulled in via #include, typically holding prototypes, macros and type definitions for modularity and reuse.',
    cat: 'programming',
  },
  {
    abbr: 'Python',
    nameZh: 'Python 语言',
    nameEn: 'Python',
    descZh:
      '1991 年由 Guido van Rossum 发布的解释型、动态类型、强类型高级语言，以缩进定义代码块，语法简洁、库生态庞大。',
    descEn:
      'An interpreted, dynamically- and strongly-typed high-level language released by Guido van Rossum in 1991; uses indentation for blocks and has a huge library ecosystem.',
    cat: 'programming',
  },
  {
    abbr: 'List',
    nameZh: '列表',
    nameEn: 'List',
    descZh:
      'Python 可变的序列类型，元素有序可重复、可异构，支持切片、增删改与列表推导式。',
    descEn:
      'Python’s mutable sequence — ordered, repeatable, heterogeneous elements with slicing, mutation and comprehensions.',
    cat: 'programming',
  },
  {
    abbr: 'Dict',
    nameZh: '字典',
    nameEn: 'Dictionary',
    descZh:
      'Python 的键值对映射类型（哈希表实现），键须可哈希且唯一，3.7 起保持插入顺序，查找近乎 O(1)。',
    descEn:
      'Python’s key-value mapping (hash table); keys must be hashable and unique, insertion order kept since 3.7, lookup ~O(1).',
    cat: 'programming',
  },
  {
    abbr: 'Tuple',
    nameZh: '元组',
    nameEn: 'Tuple',
    descZh:
      'Python 不可变的序列类型，常作函数返回多个值的容器，亦可用作字典的键。',
    descEn:
      'Python’s immutable sequence, often used to return multiple values from a function and as dictionary keys.',
    cat: 'programming',
  },
  {
    abbr: 'Set',
    nameZh: '集合',
    nameEn: 'Set',
    descZh:
      'Python 无序、元素唯一的可变容器（基于哈希），常用于去重与成员测试、集合运算。',
    descEn:
      'Python’s unordered, unique-element mutable container (hash-based), handy for de-dup, membership tests and set algebra.',
    cat: 'programming',
  },
  {
    abbr: 'Comprehension',
    nameZh: '推导式',
    nameEn: 'Comprehension',
    descZh:
      '用简洁语法从可迭代对象生成新序列（列表/字典/集合/生成器），如 [x*2 for x in xs if x>0]。',
    descEn:
      'Concise syntax building a new sequence from an iterable, e.g. [x*2 for x in xs if x>0] for lists/dicts/sets/generators.',
    cat: 'programming',
  },
  {
    abbr: 'Class',
    nameZh: '类与对象',
    nameEn: 'Class & Object',
    descZh:
      'Python 面向对象的核心：class 定义数据与行为的模板，实例化得到对象，支持继承、封装与多态。',
    descEn:
      'The core of Python OOP: a class templates data and behavior; instances are objects supporting inheritance, encapsulation and polymorphism.',
    cat: 'programming',
  },
  {
    abbr: 'Exception',
    nameZh: '异常',
    nameEn: 'Exception',
    descZh:
      '程序运行时的错误信号；用 try/except/finally 捕获处理，raise 主动抛出，避免程序崩溃。',
    descEn:
      'A runtime error signal; handled with try/except/finally and raised via raise to avoid crashing the program.',
    cat: 'programming',
  },
  {
    abbr: 'Module',
    nameZh: '模块与包',
    nameEn: 'Module & Package',
    descZh:
      'module 是单个 .py 文件，package 是用 __init__.py 组织的目录；import 复用代码，pip 安装第三方包。',
    descEn:
      'A module is one .py file; a package is a directory with __init__.py. import reuses code; pip installs third-party packages.',
    cat: 'programming',
  },
  {
    abbr: 'Regex',
    nameZh: '正则表达式',
    nameEn: 'Regular Expression',
    descZh:
      '用模式串描述文本规则，re 模块提供匹配/查找/替换；常用于校验、提取与批量文本处理。',
    descEn:
      'A pattern language for text rules; the re module matches/searches/substitutes — used for validation, extraction and batch text ops.',
    cat: 'programming',
  },
  {
    abbr: 'Iterator',
    nameZh: '迭代器与生成器',
    nameEn: 'Iterator & Generator',
    descZh:
      '迭代器逐次返回元素；生成器用 yield 惰性产出，节省内存，适合大数据流与无限序列。',
    descEn:
      'An iterator yields elements one by one; a generator uses yield to produce lazily, saving memory for big or infinite streams.',
    cat: 'programming',
  },
  {
    abbr: 'Decorator',
    nameZh: '装饰器',
    nameEn: 'Decorator',
    descZh:
      '接收函数并返回包装函数的高阶结构，用 @ 语法在不改动原函数的情况下添加日志、缓存等行为。',
    descEn:
      'A higher-order construct taking a function and returning a wrapped one; @ syntax adds logging/caching without touching the original.',
    cat: 'programming',
  },
  {
    abbr: 'Lambda',
    nameZh: '匿名函数',
    nameEn: 'Lambda',
    descZh:
      '用 lambda 关键字定义的无名单行小函数，常用于排序 key、map/filter 等作为回调的场合。',
    descEn:
      'A single-line anonymous function via lambda, often passed as a callback to sort key, map or filter.',
    cat: 'programming',
  },
  {
    abbr: 'Virtual Env',
    nameZh: '虚拟环境',
    nameEn: 'Virtual Environment',
    descZh:
      '用 venv 为项目隔离依赖的目录，配合 pip 管理包版本，避免不同项目间的库冲突。',
    descEn:
      'A venv-isolated per-project dependency dir, used with pip to manage package versions and avoid cross-project conflicts.',
    cat: 'programming',
  },

  // ===================== 嵌入式 embedded（来自《STM32单片机应用与全案例实践》） =====================
  {
    abbr: 'STM32',
    nameZh: 'STM32 单片机',
    nameEn: 'STM32 Microcontroller',
    descZh:
      '意法半导体基于 ARM Cortex-M 内核的 32 位微控制器系列，外设丰富、生态成熟，广泛用于嵌入式与物联网。',
    descEn:
      'STMicroelectronics’ 32-bit ARM Cortex-M microcontrollers with rich peripherals and mature ecosystem, popular in embedded and IoT.',
    cat: 'embedded',
  },
  {
    abbr: 'Cortex-M',
    nameZh: 'Cortex-M 内核',
    nameEn: 'ARM Cortex-M',
    descZh:
      'ARM 面向微控制器的低功耗内核家族（如 M3/M4），主打实时性与能效，是 STM32 等 MCU 的计算核心。',
    descEn:
      'ARM’s low-power MCU core family (e.g. M3/M4) focused on real-time and efficiency — the compute core of STM32-class MCUs.',
    cat: 'embedded',
  },
  {
    abbr: 'GPIO',
    nameZh: '通用输入输出',
    nameEn: 'General-Purpose I/O',
    descZh:
      '可软件配置为输入或输出的引脚，支持上拉/下拉与复用功能，是按键、LED 等最基础的接口。',
    descEn:
      'Pins configurable in software as input or output, with pull-up/down and alternate functions — the basis for keys, LEDs and more.',
    cat: 'embedded',
  },
  {
    abbr: 'TIMER',
    nameZh: '定时器',
    nameEn: 'Timer',
    descZh:
      '按计数产生定时/中断的外设，可输出 PWM、测频与输入捕获，是电机调速与波形发生的关键。',
    descEn:
      'A peripheral that counts to generate timing/interrupts; can output PWM, measure frequency and capture inputs — key to motor control and waveforms.',
    cat: 'embedded',
  },
  {
    abbr: 'PWM',
    nameZh: '脉宽调制',
    nameEn: 'Pulse Width Modulation',
    descZh:
      '由定时器输出的方波，通过调节占空比等效改变电压，常用于电机调速、舵机与 LED 调光。',
    descEn:
      'A timer-generated square wave whose duty cycle emulates voltage — common for motor speed, servos and LED dimming.',
    cat: 'embedded',
  },
  {
    abbr: 'USART',
    nameZh: '通用异步收发器',
    nameEn: 'Universal Synchronous/Asynchronous Receiver-Transmitter',
    descZh:
      '可同步/异步收发的串行通信模块，常作 UART 与 PC 或其他模块异步通信，是调试与数据交换的常用接口。',
    descEn:
      'A serial module supporting sync/async transfer, typically used as UART to talk async with a PC or other modules — a common debug and data interface.',
    cat: 'embedded',
  },
  {
    abbr: 'SPI',
    nameZh: '串行外设接口',
    nameEn: 'Serial Peripheral Interface',
    descZh:
      '高速全双工同步串行总线（SCK/MOSI/MISO/SS），用于连接 OLED、Flash 等外设，速率高于 I2C。',
    descEn:
      'A fast full-duplex synchronous bus (SCK/MOSI/MISO/SS) for OLED, Flash, etc.; faster than I2C.',
    cat: 'embedded',
  },
  {
    abbr: 'ADC',
    nameZh: '模数转换器',
    nameEn: 'Analog-to-Digital Converter',
    descZh:
      '将连续模拟电压采样为数字量的外设，用于读取传感器信号；多通道 ADC 可轮流采集。',
    descEn:
      'A peripheral sampling continuous analog voltage into digital values for sensors; multi-channel ADCs scan channels in turn.',
    cat: 'embedded',
  },
  {
    abbr: 'DAC',
    nameZh: '数模转换器',
    nameEn: 'Digital-to-Analog Converter',
    descZh: '将数字量转换为模拟电压输出的外设，用于产生波形、音频等连续信号。',
    descEn:
      'A peripheral turning digital values into analog voltage, used to generate waveforms, audio and other continuous signals.',
    cat: 'embedded',
  },
  {
    abbr: 'DMA',
    nameZh: '直接内存访问',
    nameEn: 'Direct Memory Access',
    descZh:
      '在外设与内存间搬运数据而无需 CPU 干预的控制器，减轻内核负担、提升吞吐，常与 ADC/USART 配合。',
    descEn:
      'A controller moving data between peripherals and memory without CPU involvement, offloading the core and boosting throughput — often with ADC/USART.',
    cat: 'embedded',
  },
  {
    abbr: 'Clock Tree',
    nameZh: '时钟树',
    nameEn: 'Clock Tree',
    descZh:
      'MCU 内部由振荡器经分频/倍频给各外设供时钟的层级结构，正确配置是系统稳定与外设工作的前提。',
    descEn:
      'An MCU’s hierarchy distributing clocks (via osc/divider/PLL) to peripherals; correct config is required for a stable, working system.',
    cat: 'embedded',
  },
  {
    abbr: 'Peripheral',
    nameZh: '片上外设',
    nameEn: 'Peripheral',
    descZh:
      '集成在 MCU 内部、专司特定功能的硬件模块（GPIO/TIMER/USART/ADC 等），通过寄存器配置使用。',
    descEn:
      'On-chip hardware modules for specific tasks (GPIO/TIMER/USART/ADC etc.), configured through registers.',
    cat: 'embedded',
  },
  {
    abbr: 'Firmware Lib',
    nameZh: '固件库',
    nameEn: 'Standard Peripheral Library',
    descZh:
      '芯片厂商提供的外设驱动函数集合（如 STM32 标准外设库），以 API 封装寄存器操作，降低开发门槛。',
    descEn:
      'Vendor-supplied peripheral driver libraries (e.g. STM32 SPL) that wrap register ops in APIs, lowering the development barrier.',
    cat: 'embedded',
  },
  {
    abbr: 'OLED',
    nameZh: 'OLED 显示模块',
    nameEn: 'OLED Display',
    descZh:
      '自发光的点阵显示屏，常通过 SPI/I2C 与 MCU 接口，用于菜单与数据可视化。',
    descEn:
      'A self-emissive dot-matrix display, usually interfaced via SPI/I2C for menus and visualization.',
    cat: 'embedded',
  },
  {
    abbr: 'ARM Exception',
    nameZh: '处理器异常',
    nameEn: 'ARM Exception',
    descZh:
      '打断 CPU 正常执行流、转入特定处理程序的机制。ARM 有 7 类异常（复位、数据中止、FIQ、IRQ、预取中止、软中断、未定义指令），入口集中在向量表。',
    descEn:
      'A mechanism that interrupts the CPU’s normal flow to run a handler. ARM defines 7 exception types, whose entry points live in the vector table.',
    cat: 'embedded',
  },
  {
    abbr: 'FIQ/IRQ',
    nameZh: '快/慢中断',
    nameEn: 'FIQ / IRQ',
    descZh:
      'ARM 的两级外部中断：FIQ 优先级更高、拥有更多私有Banked寄存器以减少现场保护开销，适合低延迟实时响应；IRQ 为普通外部中断。',
    descEn:
      'ARM’s two external interrupt levels: FIQ (higher priority, more banked registers for fast response) and IRQ (normal external interrupt).',
    cat: 'embedded',
  },
  {
    abbr: 'CPSR',
    nameZh: '当前程序状态寄存器',
    nameEn: 'CPSR',
    descZh:
      'ARM 状态寄存器，保存 ALU 标志位、当前处理器模式、中断使能与处理器状态；进入异常时由 SPSR 备份，返回时恢复。',
    descEn:
      'The ARM status register holding ALU flags, current mode, interrupt enables and processor state; an SPSR backs it up on exception entry.',
    cat: 'embedded',
  },
  {
    abbr: 'Watchdog',
    nameZh: '看门狗定时器',
    nameEn: 'Watchdog Timer',
    descZh:
      '周期性需被软件“喂狗”复位的硬件定时器；若系统跑飞未及时喂狗，看门狗触发复位以恢复系统，提升嵌入式可靠性。',
    descEn:
      'A hardware timer that must be periodically reset (“fed”) by software; if the system hangs, it resets the chip to recover.',
    cat: 'embedded',
  },
  {
    abbr: 'I2C',
    nameZh: 'I²C 总线',
    nameEn: 'I²C Bus',
    descZh:
      '由 SCL（时钟）与 SDA（数据）两线构成的串行总线，主机寻址从机、多主可仲裁；常用于连接传感器、EEPROM 与显示屏等低速外设。',
    descEn:
      'A 2-wire serial bus (SCL clock, SDA data) where a master addresses slaves; multi-master arbitration supports sensors, EEPROMs and displays.',
    cat: 'embedded',
  },
  {
    abbr: 'Flash',
    nameZh: '闪存存储器',
    nameEn: 'NOR / NAND Flash',
    descZh:
      '非易失存储器。NOR 可片内执行、随机读取快，适合存代码；NAND 容量大、按页读写、成本低，适合存大容量数据（如文件系统）。',
    descEn:
      'Non-volatile memory. NOR allows in-place execution and fast random read (code); NAND is denser, page-addressed and cheaper (data/file systems).',
    cat: 'embedded',
  },
  {
    abbr: 'Thumb-2',
    nameZh: 'Thumb-2 指令集',
    nameEn: 'Thumb-2',
    descZh:
      'ARM 的混合 16/32 位指令集，兼具 Thumb 的紧凑与 ARM 的性能，无需在两种状态间切换；Cortex-M 与 Cortex-A/R 均使用。',
    descEn:
      'ARM’s mixed 16/32-bit instruction set combining Thumb density with ARM performance, no state switching; used by Cortex-M/A/R.',
    cat: 'embedded',
  },
  {
    abbr: 'RTC',
    nameZh: '实时时钟',
    nameEn: 'Real-Time Clock',
    descZh:
      '由独立低速晶振与备份电池供电的时钟电路，主电源掉电后仍持续计时，为系统提供日期/时间戳与定时唤醒。',
    descEn:
      'A clock circuit powered by a slow crystal and backup battery that keeps time during main-power loss, giving date/time and wake-up alarms.',
    cat: 'embedded',
  },
  {
    abbr: 'Addressing Mode',
    nameZh: '寻址方式',
    nameEn: 'Addressing Mode',
    descZh:
      '指令取得操作数的方法。ARM 数据处理指令含立即数、寄存器、寄存器移位寻址；访存指令含基址加偏移、前/后变址、批量 Load/Store 等 9 种方式。',
    descEn:
      'How an instruction obtains its operands. ARM data-processing uses immediate, register and register-shifted addressing; memory access adds base+offset, pre/post-indexed and block Load/Store modes.',
    cat: 'embedded',
  },
  {
    abbr: 'CP15',
    nameZh: '系统控制协处理器',
    nameEn: 'CP15',
    descZh:
      'ARM 的协处理器 15，用于系统控制：配置 MMU/Cache、内存保护、时钟与异常基址等。其寄存器（c0–c15）只能经 MRC/MCR 指令访问。',
    descEn:
      'ARM coprocessor 15 for system control: configures MMU/Cache, memory protection, clocks and exception base. Its c0–c15 registers are reached only via MRC/MCR.',
    cat: 'embedded',
  },

  // ===================== 芯片参数术语（来自工具箱「芯片参数」对比工具） =====================
  {
    abbr: 'Process Node',
    nameZh: '工艺制程',
    nameEn: 'Process Node',
    descZh:
      '芯片制造的光刻线宽指标（如 7nm / 5nm / 3nm），代表晶体管最小特征尺寸；数值越小通常功耗越低、集成度越高，是 SoC 选型的关键能效参考。',
    descEn:
      'The lithography feature size of a chip (e.g. 7nm / 5nm / 3nm), the smallest transistor dimension; smaller nodes generally mean lower power and higher density — a key efficiency metric for SoC selection.',
    cat: 'embedded',
  },
  {
    abbr: 'ISA',
    nameZh: '指令集架构',
    nameEn: 'Instruction Set Architecture',
    descZh:
      '处理器软硬件间的接口规范，定义可执行的指令、寄存器与内存模型（如 ARMv8、x86、RISC-V）；它决定软件能否跨芯片运行，与具体微架构实现解耦。',
    descEn:
      'The contract between software and hardware — the instructions, registers and memory model a CPU exposes (e.g. ARMv8, x86, RISC-V); it governs software portability, independent of the microarchitecture.',
    cat: 'embedded',
  },

  // ===================== 指令集架构（ISA）体系：ARM / RISC-V / x86 =====================
  {
    abbr: 'ARM',
    nameZh: 'ARM 架构',
    nameEn: 'ARM Architecture',
    descZh:
      '由 Arm 公司设计的精简指令集（RISC）处理器架构，以低功耗、高能效著称，广泛用于手机、嵌入式与服务器。常见系列：Cortex-A（应用）、Cortex-M（微控制）、Cortex-R（实时）；当前主流为 ARMv8-A 64 位与 ARMv9。',
    descEn:
      'A RISC processor architecture by Arm, known for low power and high efficiency, dominant in phones, embedded and servers. Families: Cortex-A (application), Cortex-M (MCU), Cortex-R (real-time); today mainly ARMv8-A 64-bit and ARMv9.',
    cat: 'embedded',
  },
  {
    abbr: 'RISC-V',
    nameZh: 'RISC-V 架构',
    nameEn: 'RISC-V',
    descZh:
      '开放、免费、模块化的精简指令集架构，由加州大学伯克利分校发起。指令集分基础整数集（如 RV32I/RV64I）与可选扩展（M/A/F/D/C…），无授权费、可自由定制，正快速进入嵌入式与高性能领域。',
    descEn:
      'An open, free, modular RISC ISA started at UC Berkeley. It splits a base integer set (RV32I/RV64I) from optional extensions (M/A/F/D/C…); no license fee and fully customizable, rapidly entering embedded and HPC.',
    cat: 'embedded',
  },
  {
    abbr: 'x86',
    nameZh: 'x86 架构',
    nameEn: 'x86 Architecture',
    descZh:
      '由 Intel（1978 年 8086）开创、AMD 等延续的复杂指令集（CISC）架构，向后兼容性强。包含 32 位 x86（IA-32）与 64 位 x86-64（AMD64）；主导桌面、笔记本与服务器，与 ARM 的能效路线形成对比。',
    descEn:
      'The CISC architecture pioneered by Intel (1978, 8086) and continued by AMD, with strong backward compatibility. Covers 32-bit x86 (IA-32) and 64-bit x86-64 (AMD64); dominant in desktops, laptops and servers, contrasting ARM’s efficiency focus.',
    cat: 'embedded',
  },
  {
    abbr: 'Codec',
    nameZh: '编解码器',
    nameEn: 'Codec',
    descZh:
      '对音视频数据压缩与解压缩的算法或硬件模块（如 H.265 / VP9 / AV1）；硬件 Codec 用固定电路加速编解码，比纯软件更省电，是多媒体 SoC 的核心指标。',
    descEn:
      'An algorithm or hardware block that encodes/decodes audio/video (e.g. H.265 / VP9 / AV1); a hardware codec offloads compression to fixed logic, saving far more power than software — central to multimedia SoCs.',
    cat: 'embedded',
  },
  {
    abbr: 'Package',
    nameZh: '芯片封装',
    nameEn: 'Chip Package',
    descZh:
      '把裸片（die）封装为保护外壳并提供引脚/焊球的工艺（如 BGA / QFN / LGA）；它决定引脚数、散热与可焊接性，和芯片内部电路同样影响板级设计与尺寸。',
    descEn:
      'The process of housing a bare die in a protective shell with pins/balls (e.g. BGA / QFN / LGA); it sets pin count, thermal and solderability traits — as design-critical as the die itself for board layout.',
    cat: 'embedded',
  },
  {
    abbr: 'PCIe',
    nameZh: 'PCI Express',
    nameEn: 'PCI Express',
    descZh:
      '主板上的高速串行扩展总线（如 PCIe 4.0/5.0 ×8/×16），用于 CPU 与 GPU、网卡、SSD 等外设互联；带宽随代际与通道数倍增，是 SoC 扩展能力的关键指标。',
    descEn:
      'The high-speed serial expansion bus on a board (e.g. PCIe 4.0/5.0 ×8/×16) linking CPU to GPUs, NICs, SSDs; bandwidth scales with generation and lane count — a key SoC expandability metric.',
    cat: 'embedded',
  },

  // ===================== 机器人 robotics（来自《ROS2 机器人开发：从入门到实践》） =====================
  {
    abbr: 'ROS2',
    nameZh: '机器人操作系统二代',
    nameEn: 'Robot Operating System 2',
    descZh:
      '面向机器人应用的分布式通信框架，基于 DDS 中间件，支持实时、多语言与跨平台，是 ROS 的重构升级。',
    descEn:
      'A distributed robotics framework built on DDS, with real-time, multi-language and cross-platform support — the rebuilt successor to ROS.',
    cat: 'robotics',
  },
  {
    abbr: 'Node',
    nameZh: '节点',
    nameEn: 'Node',
    descZh:
      'ROS 2 中执行单一职责的进程，是计算的基本单元；一个机器人系统通常由多个相互通信的节点组成。',
    descEn:
      'A ROS 2 process with one responsibility — the basic unit of computation; a robot is a set of communicating nodes.',
    cat: 'robotics',
  },
  {
    abbr: 'Topic',
    nameZh: '话题',
    nameEn: 'Topic',
    descZh:
      '基于发布/订阅的异步通信机制：发布者广播消息，订阅者接收；适合传感器流等一对多持续数据。',
    descEn:
      'Async pub/sub communication: publishers broadcast messages, subscribers receive — ideal for one-to-many streaming data like sensors.',
    cat: 'robotics',
  },
  {
    abbr: 'Service',
    nameZh: '服务',
    nameEn: 'Service',
    descZh:
      '基于请求/响应的同步通信机制，客户端发请求、服务端回结果，适合偶尔触发、需确认的任务。',
    descEn:
      'Sync request/response communication: a client calls, a server replies — suited to occasional, confirmed tasks.',
    cat: 'robotics',
  },
  {
    abbr: 'Parameter',
    nameZh: '参数',
    nameEn: 'Parameter',
    descZh:
      '节点运行期可动态读写的配置值（全局字典），无需改代码即可调节节点行为。',
    descEn:
      'A node’s runtime-readable/writable config values (a global dictionary) to tune behavior without code changes.',
    cat: 'robotics',
  },
  {
    abbr: 'Interface',
    nameZh: '通信接口',
    nameEn: 'Communication Interface',
    descZh:
      '定义消息结构的文件：.msg（话题）、.srv（服务）、.action（动作），是节点间数据交换的契约。',
    descEn:
      'Files defining message structure: .msg (topic), .srv (service), .action (action) — the contract for node data exchange.',
    cat: 'robotics',
  },
  {
    abbr: 'Package',
    nameZh: '功能包',
    nameEn: 'Package',
    descZh:
      'ROS 2 组织代码的基本单元（含源码、配置与依赖），用 Colcon 构建，是可分发的最小软件模块。',
    descEn:
      'The basic unit organizing ROS 2 code (source, config, deps), built by Colcon — the smallest distributable software module.',
    cat: 'robotics',
  },
  {
    abbr: 'Workspace',
    nameZh: '工作空间',
    nameEn: 'Workspace',
    descZh:
      '用 Colcon 管理的目录，汇集多个功能包统一编译与安装，是开发 ROS 2 项目的根环境。',
    descEn:
      'A Colcon-managed directory gathering packages for unified build/install — the root environment of a ROS 2 project.',
    cat: 'robotics',
  },
  {
    abbr: 'DDS',
    nameZh: '数据分发服务',
    nameEn: 'Data Distribution Service',
    descZh:
      'ROS 2 底层采用的实时发布/订阅通信中间件标准，提供发现、QoS 与跨语言传输能力。',
    descEn:
      'The real-time pub/sub middleware standard under ROS 2, providing discovery, QoS and cross-language transport.',
    cat: 'robotics',
  },
  {
    abbr: 'QoS',
    nameZh: '服务质量',
    nameEn: 'Quality of Service',
    descZh:
      'DDS 的通信策略（如历史、可靠性、存活时间），控制消息的传递保证与资源占用，需双方兼容才连通。',
    descEn:
      'DDS communication policies (history, reliability, liveliness…) controlling delivery guarantees and resource use; both ends must be compatible.',
    cat: 'robotics',
  },
  {
    abbr: 'TF',
    nameZh: '坐标变换',
    nameEn: 'Transform',
    descZh:
      '维护机器人各坐标系间变换关系的工具，可发布/查询任意两坐标系的相对位姿，是定位与感知的基础。',
    descEn:
      'A tool tracking transforms between robot coordinate frames, publishing/querying relative poses — the basis of localization and perception.',
    cat: 'robotics',
  },
  {
    abbr: 'URDF',
    nameZh: '机器人描述格式',
    nameEn: 'Unified Robot Description Format',
    descZh:
      '用 XML 描述机器人连杆、关节、碰撞与可视几何的格式，可被 RViz、Gazebo 解析以显示与仿真。',
    descEn:
      'An XML format describing links, joints, collision and visual geometry; parsed by RViz and Gazebo for display and simulation.',
    cat: 'robotics',
  },
  {
    abbr: 'Xacro',
    nameZh: '宏化机器人描述',
    nameEn: 'Xacro',
    descZh:
      'URDF 的宏扩展语言，支持变量、常量与复用，用来简化冗长重复的机器人模型定义。',
    descEn:
      'A macro language extending URDF with variables, constants and reuse, simplifying long, repetitive robot models.',
    cat: 'robotics',
  },
  {
    abbr: 'Gazebo',
    nameZh: 'Gazebo 仿真器',
    nameEn: 'Gazebo',
    descZh:
      '开源三维物理仿真器，可加载 URDF 机器人并模拟传感器与动力学，用于算法验证而无需实体硬件。',
    descEn:
      'An open 3D physics simulator that loads URDF robots and emulates sensors and dynamics — for testing algorithms without real hardware.',
    cat: 'robotics',
  },
  {
    abbr: 'SLAM',
    nameZh: '同步定位与建图',
    nameEn: 'Simultaneous Localization and Mapping',
    descZh:
      '机器人在未知环境中一边估计自身位姿、一边构建地图的过程，是自主导航的前提。',
    descEn:
      'A robot estimating its pose while building a map in an unknown environment — the prerequisite of autonomous navigation.',
    cat: 'robotics',
  },
  {
    abbr: 'Nav2',
    nameZh: '导航框架',
    nameEn: 'Navigation 2',
    descZh:
      'ROS 2 的导航系统，集成规划、控制、代价地图与恢复行为，支持单点/路点导航与动态避障。',
    descEn:
      'ROS 2’s navigation stack integrating planning, control, costmaps and recovery behaviors; supports goal/waypoint nav and dynamic avoidance.',
    cat: 'robotics',
  },
  {
    abbr: 'RViz',
    nameZh: '三维可视化工具',
    nameEn: 'RViz',
    descZh:
      'ROS 官方三维可视化工具，可显示机器人模型、坐标系、点云、地图与话题数据，便于调试与观测。',
    descEn:
      'ROS’s 3D visualization tool showing robot models, frames, point clouds, maps and topic data for debugging and inspection.',
    cat: 'robotics',
  },
  {
    abbr: 'micro-ROS',
    nameZh: '微控制器 ROS',
    nameEn: 'micro-ROS',
    descZh:
      '将 ROS 2 通信带到 MCU（如 STM32）的轻量客户端，使嵌入式设备作为节点接入 ROS 2 网络。',
    descEn:
      'A lightweight ROS 2 client for MCUs (e.g. STM32), letting embedded devices join the ROS 2 network as nodes.',
    cat: 'robotics',
  },
  {
    abbr: 'LiDAR',
    nameZh: '激光雷达',
    nameEn: 'Light Detection and Ranging',
    descZh:
      '通过发射激光并测量回波时间/相位获取距离，生成三维点云的传感器，是机器人与自动驾驶环境感知的核心。',
    descEn:
      'A sensor emitting laser and measuring return time/phase to get distance, building 3D point clouds — core to robot and autonomous perception.',
    cat: 'robotics',
  },
  {
    abbr: 'Depth Camera',
    nameZh: '深度相机',
    nameEn: 'Depth Camera',
    descZh:
      '除彩色图像外还能输出每个像素深度信息的相机（如 RGB-D、ToF、结构光），常用于避障、抓取与三维重建。',
    descEn:
      'A camera that also outputs per-pixel depth (e.g. RGB-D, ToF, structured light), used for obstacle avoidance, grasping and 3D reconstruction.',
    cat: 'robotics',
  },
  {
    abbr: 'Action',
    nameZh: '动作通信',
    nameEn: 'Action',
    descZh:
      'ROS 的第三种通信机制：类似服务但服务端可连续反馈进度、客户端可中途取消，适合导航等耗时任务。ROS 1 靠 actionlib，ROS 2 原生内置。',
    descEn:
      'The third ROS communication primitive: like a service but the server streams feedback and the client can cancel — for long tasks like navigation. ROS 1 uses actionlib; ROS 2 has it natively.',
    cat: 'robotics',
  },
  {
    abbr: 'pluginlib',
    nameZh: 'ROS 插件库',
    nameEn: 'pluginlib',
    descZh:
      'ROS 1 的 C++ 库，可在运行期从功能包动态加载/卸载插件（类），无需在编译期显式链接，便于扩展算法与功能模块。',
    descEn:
      'A ROS 1 C++ library to dynamically load/unload plugins (classes) from packages at runtime without compile-time linking — easing algorithm and module extension.',
    cat: 'robotics',
  },
  {
    abbr: 'Nodelet',
    nameZh: '节点容器',
    nameEn: 'Nodelet',
    descZh:
      'ROS 1 机制：把多个节点放入同一进程，进程内消息零拷贝传递，避免 TCP 跨进程开销，适合高带宽（如图像）通信。ROS 2 用组件容器替代。',
    descEn:
      'A ROS 1 mechanism running multiple nodes in one process with zero-copy intra-process messages, avoiding TCP overhead for high-bandwidth (e.g. image) data; ROS 2 uses component containers instead.',
    cat: 'robotics',
  },
  {
    abbr: 'Dynamic Reconfigure',
    nameZh: '动态参数配置',
    nameEn: 'Dynamic Reconfigure',
    descZh:
      'ROS 1 机制：运行期在不重启节点的前提下实时调整参数（如 PID 增益、滤波器系数），弥补参数服务器只能启动前设置的局限。ROS 2 用参数事件替代。',
    descEn:
      'A ROS 1 mechanism to tune parameters at runtime (e.g. PID gains, filter coeffs) without restarting nodes, fixing the parameter server’s start-time-only limit; ROS 2 uses parameter events instead.',
    cat: 'robotics',
  },
  {
    abbr: 'rosbag',
    nameZh: 'ROS 数据录制',
    nameEn: 'rosbag',
    descZh:
      'ROS 自带的消息录制/回放工具：把话题数据按时间顺序存为 .bag 文件，便于离线调试、算法复现与数据回灌，ROS 1/2 均支持。',
    descEn:
      'The ROS message record/replay tool: writes topic data to a .bag file for offline debugging, reproducible tests and data replay; available in ROS 1 and 2.',
    cat: 'robotics',
  },
  {
    abbr: 'rqt',
    nameZh: 'ROS 可视化工具框架',
    nameEn: 'rqt',
    descZh:
      '基于 Qt 的 ROS 图形化工具框架，以插件方式提供话题监视、节点图、日志查看、参数编辑等界面，替代分散的旧版 ROS 可视化小工具。',
    descEn:
      'A Qt-based ROS GUI framework offering topic monitors, node graphs, log viewers and parameter editors as plugins, replacing scattered legacy ROS tools.',
    cat: 'robotics',
  },
  {
    abbr: 'MoveIt',
    nameZh: '机械臂运动规划框架',
    nameEn: 'MoveIt',
    descZh:
      'ROS 中用于机械臂（移动操作）的运动规划框架，提供运动学、路径规划、碰撞检测、抓取与执行管理，多用于工业/服务机器人臂。',
    descEn:
      'The ROS framework for manipulator motion planning: kinematics, path planning, collision checking, grasping and execution management for robot arms.',
    cat: 'robotics',
  },

  // ===================== 硬件补充（处理器与芯片级） =====================
  {
    abbr: 'SoC',
    nameZh: '片上系统',
    nameEn: 'System on a Chip',
    descZh:
      '将 CPU、GPU/NPU、内存控制器与外设集成到单一芯片的集成电路，手机与嵌入式设备的主流形态。',
    descEn:
      'An IC integrating CPU, GPU/NPU, memory controller and peripherals on one chip — the dominant form in phones and embedded devices.',
    cat: 'hardware',
  },
  {
    abbr: 'Processor',
    nameZh: '处理器',
    nameEn: 'Processor',
    descZh:
      '执行指令、完成运算的芯片统称，涵盖 CPU、GPU、NPU、DSP 等，是各类计算设备的核心部件。',
    descEn:
      'The general term for chips that execute instructions and compute, including CPU, GPU, NPU, DSP — the core of computing devices.',
    cat: 'hardware',
  },
];
