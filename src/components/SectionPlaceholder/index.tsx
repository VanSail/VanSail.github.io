import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './styles.module.css';

/** 栏目页占位：产品中心与未来的产品文档；文档语法教程在 /docs，由首页按钮进入。 */
export type SectionKey = 'products' | 'productDocs';

const SECTION_COPY: Record<
  SectionKey,
  {zh: string; en: string; eyebrow: string; zhNote: string; enNote: string}
> = {
  products: {
    zh: '产品中心',
    en: 'Products',
    eyebrow: 'PRODUCTS',
    zhNote: '栏目建设中，敬请期待。',
    enNote: 'This section is coming soon.',
  },
  productDocs: {
    zh: '产品文档',
    en: 'Docs',
    eyebrow: 'PRODUCT DOCS',
    zhNote: '产品文档将随产品上线同步开放，敬请期待。',
    enNote: 'Product documentation will be available with the product launch.',
  },
};

export default function SectionPlaceholder({
  section,
}: {
  section: SectionKey;
}): ReactNode {
  const {
    siteConfig,
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const isEn = currentLocale === 'en';
  const copy = SECTION_COPY[section];
  // baseUrl 在英文构建里本身已带 /en/
  const homeHref = `${siteConfig.baseUrl.replace(/\/$/, '')}/`;

  return (
    <Layout
      title={isEn ? copy.en : copy.zh}
      description={isEn ? copy.enNote : copy.zhNote}
      noFooter
      wrapperClassName={styles.wrapper}
    >
      <main className={styles.main}>
        <p className={styles.eyebrow}>
          VANSAIL / {isEn ? copy.en.toUpperCase() : copy.eyebrow}
        </p>
        <h1 className={styles.title}>{isEn ? copy.en : copy.zh}</h1>
        <p className={styles.note}>{isEn ? copy.enNote : copy.zhNote}</p>
        <a className={styles.back} href={homeHref}>
          {isEn ? '← Back to home' : '← 返回首页'}
        </a>
      </main>
    </Layout>
  );
}
