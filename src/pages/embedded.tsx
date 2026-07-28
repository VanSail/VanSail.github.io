import type {ReactNode} from 'react';
import CategoryPage from '@site/src/components/CategoryPage';
import {stm32Tools} from '@site/src/data/cards';

const meta = {
  title: {zh: '嵌入式 - VanSail', en: 'Embedded - VanSail'},
  desc: {zh: '嵌入式开发工具', en: 'Embedded development tools'},
};

export default function EmbeddedPage(): ReactNode {
  return <CategoryPage heroType="embedded" meta={meta} items={stm32Tools} />;
}
