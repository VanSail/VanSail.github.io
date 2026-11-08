import ToolPage from '../../../components/ToolPage';

const COPY = {
  zh: {
    title: 'Excel ⇄ Markdown · VanSail 网页工具',
    desc: '在浏览器中双向转换 Excel 和 Markdown 表格。',
    frameTitle: 'Excel ⇄ Markdown',
  },
  en: {
    title: 'Excel ⇄ Markdown · VanSail Tools',
    desc: 'Convert Excel and Markdown tables locally in your browser.',
    frameTitle: 'Excel ⇄ Markdown',
  },
};

export default function Page() {
  return <ToolPage id="table" copy={COPY} />;
}
