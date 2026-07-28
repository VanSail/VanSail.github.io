import type {ReactNode} from 'react';
import CategoryPage from '@site/src/components/CategoryPage';
import {devResources} from '@site/src/data/cards';

const meta = {
  title: {zh: '软件 - VanSail', en: 'Software - VanSail'},
  desc: {zh: '开发软件与工具', en: 'Dev software & tools'},
};

export default function SoftwarePage(): ReactNode {
  return <CategoryPage heroType="software" meta={meta} items={devResources} />;
}
