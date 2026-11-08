import ToolPage from '../../../components/ToolPage';

const COPY = {
  zh: {
    title: '蓝牙探针 · VanSail 网页工具',
    desc: '连接低功耗蓝牙设备，探索 GATT 服务与特征。',
    frameTitle: '蓝牙探针 · BLE 设备连接',
  },
  en: {
    title: 'BLE Explorer · VanSail Tools',
    desc: 'Connect to Bluetooth Low Energy devices and explore GATT services and characteristics.',
    frameTitle: 'BLE Explorer · BLE device connection',
  },
};

export default function Page() {
  return <ToolPage id="bluetooth" copy={COPY} />;
}
