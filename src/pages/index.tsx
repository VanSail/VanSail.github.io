import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';
import Divider from '@site/src/components/Divider';
import CardCarousel from '@site/src/components/CardCarousel';
import GuidePreview from '@site/src/components/GuidePreview';
import KnowledgeCards from '@site/src/components/KnowledgeCards';
import {homeTools, aiAgents, robots, stm32Tools} from '@site/src/data/cards';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="VanSail — 开源硬件、嵌入式开发与 AI 教程平台"
    >
      <main
        style={{
          background: 'var(--ifm-background-color)',
          minHeight: '100vh',
        }}
      >
        {/* 3D 地球视觉 */}
        <Hero3D />
        <Divider />
        {/* 一行 3 张、自动无缝横向滚动的卡片导航 */}
        <CardCarousel
          items={[...homeTools, ...aiAgents, ...robots, ...stm32Tools]}
        />
        {/* 中段文档指南预览：左教程 logo + 右文档目录 */}
        <GuidePreview />
        {/* 底部知识卡片区：居中网格，点击跳转 /knowledge 总页 */}
        <KnowledgeCards />
      </main>
    </Layout>
  );
}
