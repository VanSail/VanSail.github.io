import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';
import Divider from '@site/src/components/Divider';
import CardCarousel from '@site/src/components/CardCarousel';
import FeatureSteps from '@site/src/components/FeatureSteps';
import HardwareTags from '@site/src/components/HardwareTags';
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
        {/* 网站特点：竖向步骤条（开源可验证 / 持续更新 / 社区共建） */}
        <FeatureSteps />
        {/* 底部硬件名词标签区：3 行横向滑动，悬停显示释义 */}
        <HardwareTags />
      </main>
    </Layout>
  );
}
