import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from '@site/src/pages/index.module.css';

interface ToolEntry {
  title: {zh: string; en: string};
  desc: {zh: string; en: string};
  to: string;
  external?: boolean;
}

const TOOLS: ToolEntry[] = [
  {
    title: {zh: 'Docker 使用', en: 'Docker'},
    desc: {
      zh: '容器化平台教程，将应用与依赖打包成轻量可移植的镜像，一次构建处处运行。',
      en: 'Containerization tutorials — package apps and deps into portable images.',
    },
    to: '/docs/docker',
  },
  {
    title: {zh: '思维导图', en: 'Mind Map'},
    desc: {
      zh: '基于 Markdown 的实时思维导图工具，支持导出 SVG / PNG / Markdown。',
      en: 'Markdown-driven mind map tool with SVG / PNG / Markdown export.',
    },
    to: '/mindmap',
  },
];

function ToolboxInner(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const prefix = locale === 'en' ? '/en' : '';

  return (
    <Layout
      title={locale === 'en' ? 'Toolbox - VanSail' : '工具箱 - VanSail'}
      description={
        locale === 'en'
          ? 'Software and tooling usage tutorials — Docker, Mind Map and more.'
          : '软件与工具使用教程 —— Docker、思维导图等。'
      }
    >
      <main className={styles.page}>
        <BrowserOnly fallback={<div />}>
          {() => (
            <section className={styles.grid}>
              {TOOLS.map(tool => {
                const href = tool.external ? tool.to : `${prefix}${tool.to}`;
                return (
                  <a
                    key={tool.to}
                    href={href}
                    className={styles.toolCard}
                    target={tool.external ? '_blank' : undefined}
                    rel={tool.external ? 'noreferrer' : undefined}
                  >
                    <h3 className={styles.toolTitle}>{tool.title[locale]}</h3>
                    <p className={styles.toolDesc}>{tool.desc[locale]}</p>
                  </a>
                );
              })}
            </section>
          )}
        </BrowserOnly>
      </main>
    </Layout>
  );
}

export default function ToolboxPage(): ReactNode {
  return <ToolboxInner />;
}
