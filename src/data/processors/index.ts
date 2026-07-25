export type CategoryId = 'ai' | 'soc';

export interface Processor {
  id: string;
  name: string;
  category: CategoryId;
  vendor?: string;
  arch?: string; // 中央处理器（核心簇 + 最高主频）
  gpu?: string;
  tops?: string; // AI / 神经网络处理器
  process?: string;
  memory?: string;
  year?: string;
  codec?: string;
  mcu?: string;
  storage?: string;
  videoIn?: string; // 视频输入（MIPI CSI / 摄像头）
  display?: string; // 显示（视频输出与输入，含 HDMI TX / RX 等）
  pcie?: string;
  usb?: string;
  network?: string;
  wireless?: string; // 无线连接
  audio?: string;
  other?: string;
  security?: string; // 安全/可信执行
  system?: string;
  brief?: string; // 规格书
  datasheet?: string; // 数据手册
}

// 一个处理器一个配置文件：在 src/data/processors/ 下新增 *.json（含 category 字段），
// 然后在此处加一行导入即可（以文件名作为 id）。
import rockchipRk3588 from './rockchip-rk3588.json';
import rockchipRk3576 from './rockchip-rk3576.json';
import qualcommQcs6490 from './qualcomm-qcs6490.json';

export const PROCESSORS = (
  [
    {id: 'rk3588', ...rockchipRk3588},
    {id: 'rk3576', ...rockchipRk3576},
    {id: 'qcs6490', ...qualcommQcs6490},
  ] as Processor[]
).sort((a, b) => a.name.localeCompare(b.name));
