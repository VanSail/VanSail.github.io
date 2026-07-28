import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';

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
      </main>
    </Layout>
  );
}
