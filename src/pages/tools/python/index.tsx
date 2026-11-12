import ToolPage from '../../../components/ToolPage';

const copy = {
  zh: {
    title: 'Python 实验室 · VanSail 网页工具',
    desc: '在浏览器中编辑和运行 Python 笔记本，查看数据和图表。',
    frameTitle: 'Python 实验室',
  },
  en: {
    title: 'Python Lab · VanSail Tools',
    desc: 'Edit and run Python notebooks in your browser and explore data and plots.',
    frameTitle: 'Python Lab',
  },
};
export default function Page() {
  return <ToolPage id="python" copy={copy} />;
}
