import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import JoinSteps from '@site/src/components/JoinSteps';
import styles from '@site/src/pages/index.module.css';

const meta = {
  title: {zh: '加入我们 - VanSail', en: 'Join Us - VanSail'},
  desc: {
    zh: '参与 VanSail 的完整贡献流程',
    en: 'The full contribution flow for VanSail',
  },
};

const cta = {
  zh: '继续阅读：文档指南',
  en: 'Read the docs guide',
};

export default function JoinPage(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const docPath = locale === 'en' ? '/en/docs/guide' : '/docs/guide';

  return (
    <Layout title={meta.title[locale]} description={meta.desc[locale]}>
      <main
        style={{
          background: 'var(--ifm-background-color)',
          minHeight: '100vh',
          isolation: 'isolate',
        }}
      >
        <div className={styles.page}>
          <JoinSteps locale={locale} />
          <div className={styles.cta}>
            <Link to={docPath} className={styles.ctaLink}>
              {cta[locale]} →
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
