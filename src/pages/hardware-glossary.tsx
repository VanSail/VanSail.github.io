import type {ReactElement} from 'react';
import Layout from '@theme/Layout';
import {useLocation} from '@docusaurus/router';
import styles from './hardware-glossary.module.css';
import {HARDWARE_TAGS} from '@site/src/data/hardwareTags';

/**
 * 硬件名词总览页（首页标签区"查看更多"跳转至此）。
 * 展示所有硬件名词的中英文全称与释义，数据来自 src/data/hardwareTags.tsx。
 */
export default function HardwareGlossary(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <Layout
      title={isZh ? '硬件名词表' : 'Hardware Glossary'}
      description={
        isZh
          ? '常见硬件名词与缩写释义'
          : 'Common hardware terms and abbreviations'
      }
    >
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {isZh ? '硬件名词表' : 'Hardware Glossary'}
          </h1>
          <p className={styles.subtitle}>
            {isZh
              ? '常见处理器与芯片名词的中英文释义'
              : 'Chinese & English explanations of common processor and chip terms'}
          </p>
        </header>

        <ul className={styles.grid}>
          {HARDWARE_TAGS.map(tag => (
            <li className={styles.item} key={tag.abbr}>
              <div className={styles.itemHead}>
                <span className={styles.abbr}>{tag.abbr}</span>
                <span className={styles.fullName}>
                  {isZh ? tag.nameZh : tag.nameEn}
                </span>
              </div>
              <p className={styles.desc}>{isZh ? tag.descZh : tag.descEn}</p>
            </li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}
