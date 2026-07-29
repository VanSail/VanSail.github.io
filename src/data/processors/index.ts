export type CategoryId = 'ai' | 'soc';

/** 双语文本：zh 中文 / en 英文 */
export interface LText {
  zh: string;
  en: string;
}

export interface Processor {
  id: string;
  name: LText;
  category: CategoryId;
  process?: LText; // 工艺制程
  arch?: LText; // 中央处理器（核心簇 + 最高主频）
  isa?: LText; // 指令集架构
  gpu?: LText; // 图形处理器
  mcu?: LText; // 微处理器
  tops?: LText; // AI 算力
  memory?: LText; // 内存
  storage?: LText; // 存储
  codec?: LText; // 编解码
  videoIn?: LText; // 视频输入（MIPI CSI / 摄像头）
  display?: LText; // 显示输出
  audio?: LText; // 音频
  pcie?: LText; // PCIe
  usb?: LText; // USB
  network?: LText; // 网络
  other?: LText; // GPIO / 通用外设接口
  pkg?: LText; // 封装
  size?: LText; // 尺寸
  system?: LText; // 操作系统
  temp?: LText; // 工作温度
  lifecycle?: LText; // 生命周期（预计停产年份）
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
    .filter(p => p.name && p.name.zh)
    .sort((a, b) => a.name.zh.localeCompare(b.name.zh));
}

export const PROCESSORS: Processor[] = loadProcessors();
