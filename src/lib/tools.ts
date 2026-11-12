export const tools = [
  {
    id: 'serial',
    keywords:
      '串口 调试 调试台 助手 serial uart com port console debugger 波特率 baud 收发 rx tx 连接 connect 115200 8n1 web serial api',
    zh: '串口助手',
    en: 'Serial Assistant',
    descZh: '通过串口收发数据',
    descEn: 'Send serial data',
    accent: '#f0b45a',
    soft: 'rgba(240, 180, 90, 0.45)',
  },
  {
    id: 'bluetooth',
    keywords: '蓝牙 连接 bluetooth ble gatt uuid 服务 特征 characteristic',
    zh: '蓝牙助手',
    en: 'Bluetooth Assistant',
    descZh: '收发蓝牙设备指令',
    descEn: 'Send BLE commands',
    accent: '#37baa7',
    soft: 'rgba(55, 186, 167, 0.45)',
  },
  {
    id: 'ai',
    keywords:
      'ai chat 对话 大模型 llm key 实验室 lab 图片 image 生成 绘画 绘图 draw 联网 搜索 web search responses chat completions openai 兼容 base url 自定义端点 custom endpoint 协议 protocol 测试连接',
    zh: 'AI 实验室',
    en: 'AI Lab',
    descZh: '与模型对话、生成图像',
    descEn: 'Chat and create images',
    accent: '#7fa8ff',
    soft: 'rgba(127, 168, 255, 0.45)',
  },
  {
    id: 'cad',
    keywords:
      'CAD 看图 STP STEP DXF 模型 图纸 三维 二维 预览 viewer model drawing',
    zh: 'CAD 看图',
    en: 'CAD Viewer',
    descZh: '预览 STEP 模型与 DXF 图纸',
    descEn: 'View STEP and DXF files',
    accent: '#77cfbc',
    soft: 'rgba(119, 207, 188, 0.45)',
  },
  {
    id: 'table',
    keywords:
      'Excel Markdown 表格 转换 工作表 xls xlsx md spreadsheet table converter',
    zh: 'Excel ⇄ Markdown',
    en: 'Excel ⇄ Markdown',
    descZh: '双向转换 Excel 与 Markdown 表格',
    descEn: 'Convert spreadsheet tables',
    accent: '#7acda1',
    soft: 'rgba(122, 205, 161, 0.45)',
  },
  {
    id: 'python',
    zh: 'Python 实验室',
    en: 'Python Lab',
    descZh: '运行 Python 笔记本与图表',
    descEn: 'Run Python notebooks',
    keywords:
      'python jupyter jupyterlab notebook ipynb matplotlib python解释器 笔记本 代码 画图 数据分析',
    accent: '#79b5ef',
    soft: 'rgba(121,181,239,.45)',
  },
] as const;

export type ToolId = (typeof tools)[number]['id'];
export const toolPath = (id: ToolId) => `/tools/${id}/`;
