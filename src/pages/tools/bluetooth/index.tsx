import ToolPage from '../../../components/ToolPage';

const COPY = {
  zh: {
    title: '蓝牙助手 · VanSail 网页工具',
    desc: '连接低功耗蓝牙设备，探索 GATT 服务与特征。',
    frameTitle: '蓝牙助手 · BLE 设备连接',
  },
  en: {
    title: 'Bluetooth Assistant · VanSail Tools',
    desc: 'Connect to Bluetooth Low Energy devices and explore GATT services and characteristics.',
    frameTitle: 'Bluetooth Assistant · BLE device connection',
  },
};

export default function Page() {
  return <ToolPage id="bluetooth" copy={COPY} />;
}
