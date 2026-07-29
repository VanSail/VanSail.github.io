export type CategoryId = 'ai' | 'soc';

export interface Processor {
  id: string;
  name: string;
  category: CategoryId;
  process?: string; // 工艺制程
  arch?: string; // 中央处理器（核心簇 + 最高主频）
  isa?: string; // 指令集架构
  gpu?: string; // 图形处理器
  mcu?: string; // 微处理器
  tops?: string; // AI 算力
  memory?: string; // 内存
  storage?: string; // 存储
  codec?: string; // 编解码
  videoIn?: string; // 视频输入（MIPI CSI / 摄像头）
  display?: string; // 显示输出
  audio?: string; // 音频
  pcie?: string; // PCIe
  usb?: string; // USB
  network?: string; // 网络
  other?: string; // GPIO / 通用外设接口
  pkg?: string; // 封装
  size?: string; // 尺寸
  system?: string; // 操作系统
  temp?: string; // 工作温度
  lifecycle?: string; // 生命周期（预计停产年份）
  page?: string; // 官方页面
  brief?: string; // 规格书
  datasheet?: string; // 数据手册
}

// 自动加载：src/data/processors/ 目录下任意 *.json（含 category 字段）都会被自动识别并展示，
// 新增处理器只需复制 _template.json、改名、填参数即可，无需改动本文件或其它代码。
// 下划线开头的文件（如 _template.json）会被忽略，仅作模板用途。
const ctx = require.context('.', false, /\.json$/);

function loadProcessors(): Processor[] {
  return ctx
    .keys()
    .filter(path => !path.startsWith('./_'))
    .map(path => {
      const id = path.replace(/^\.\//, '').replace(/\.json$/, '');
      const mod = ctx(path) as Record<string, unknown> & {
        default?: Record<string, unknown>;
      };
      const data = (mod.default ?? mod) as Record<string, unknown>;
      return {id, ...data} as Processor;
    })
    .filter(p => p.name)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export const PROCESSORS: Processor[] = loadProcessors();
