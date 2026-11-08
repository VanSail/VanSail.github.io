import ToolPage from '../../../components/ToolPage';

const COPY = {
  zh: {
    title: '串口助手 · VanSail 网页工具',
    desc: '浏览器直连串口的交互式终端：实时收发、文本 / HEX / BIN 三种视图、可自定义波特率、暂停查看与收发字节统计。',
    frameTitle: '串口助手 · 交互式串口终端',
  },
  en: {
    title: 'Serial Assistant · VanSail Tools',
    desc: 'An interactive serial terminal in your browser: live RX/TX, text / HEX / BIN views, custom baud rates, pause and byte counters.',
    frameTitle: 'Serial Assistant · interactive serial terminal',
  },
};

export default function Page() {
  return <ToolPage id="serial" copy={COPY} />;
}
