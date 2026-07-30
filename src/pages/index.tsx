import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';
import Divider from '@site/src/components/Divider';
import CardCarousel from '@site/src/components/CardCarousel';
import {homeTools, aiAgents, robots, stm32Tools} from '@site/src/data/cards';

const meta = {
  title: {zh: 'VanSail', en: 'VanSail'},
  desc: {zh: '教程文档与开发工具', en: 'Tutorials & dev tools'},
};

export default function Home(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  return (
    <Layout title={meta.title[locale]} description={meta.desc[locale]}>
      <main
        style={{
          background: 'var(--ifm-background-color)',
          minHeight: '100vh',
        }}
      >
        <Hero3D />
        <Divider />
        {/* 首页卡片导航：思维导图/串口助手 + 导航分类卡片，自动横向滚动展示 */}
        <CardCarousel
          items={[...homeTools, ...aiAgents, ...robots, ...stm32Tools]}
        />
      </main>
    </Layout>
  );
}
