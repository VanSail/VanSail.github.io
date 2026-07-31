import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';
import Divider from '@site/src/components/Divider';
import ExploreSection from '@site/src/components/ExploreSection';
import KnowledgeCards from '@site/src/components/KnowledgeCards';

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
        {/* 中段探索联动区：左竖向滚动教程卡片，右详情随居中卡片切换 */}
        <ExploreSection />
        {/* 底部知识卡片区：居中网格，点击跳转 /knowledge 总页 */}
        <KnowledgeCards />
      </main>
    </Layout>
  );
}
