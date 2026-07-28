import type {ReactNode} from 'react';
import CategoryPage from '@site/src/components/CategoryPage';
import {aiAgents} from '@site/src/data/cards';

const meta = {
  title: {zh: '人工智能 - VanSail', en: 'AI - VanSail'},
  desc: {zh: '开源 AI 代理与工具', en: 'Open-source AI agents & tools'},
};

export default function AiPage(): ReactNode {
  return <CategoryPage heroType="ai" meta={meta} items={aiAgents} />;
}
