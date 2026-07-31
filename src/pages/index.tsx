import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';
import Divider from '@site/src/components/Divider';
import CardCarousel from '@site/src/components/CardCarousel';
import SectionPlaceholder from '@site/src/components/SectionPlaceholder';
import Testimonials from '@site/src/components/Testimonials';
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
        {/* 两行反向流动的卡片 */}
        <CardCarousel
          items={[...homeTools, ...aiAgents, ...robots, ...stm32Tools]}
        />
        {/* 卡片与标签之间的占位区块（后续替换为实际模块） */}
        <SectionPlaceholder />
        {/* 参考 What People Say 的流动评价卡片框 */}
        <Testimonials />
      </main>
    </Layout>
  );
}
