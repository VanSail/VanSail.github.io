import ToolPage from '../../../components/ToolPage';

const COPY = {
  zh: {
    title: 'CAD 看图 · VanSail 网页工具',
    desc: '在浏览器本地打开 STP、STEP 模型和 DXF 图纸。',
    frameTitle: 'CAD 看图',
  },
  en: {
    title: 'CAD Viewer · VanSail Tools',
    desc: 'Preview STP, STEP and DXF files locally in your browser.',
    frameTitle: 'CAD Viewer',
  },
};

export default function Page() {
  return <ToolPage id="cad" copy={COPY} />;
}
