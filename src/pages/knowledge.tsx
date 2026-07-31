import type {ReactElement} from 'react';
import Layout from '@theme/Layout';
import {useLocation} from '@docusaurus/router';
import styles from './knowledge.module.css';
import {KNOWLEDGE_CARDS} from '@site/src/data/knowledgeCards';

/**
 * 知识卡片总览页（首页「知识卡片」区点击跳转至此）。
 * 展示所有知识卡片的中英文全称与释义，数据来自 src/data/knowledgeCards.tsx。
 */
export default function Knowledge(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';

  return (
    <Layout
      title={isZh ? '知识卡片' : 'Knowledge Cards'}
      description={
        isZh
          ? '常见软硬件技术名词与缩写释义'
          : 'Common software & hardware terms and abbreviations'
      }
    >
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {isZh ? '知识卡片' : 'Knowledge Cards'}
          </h1>
          <p className={styles.subtitle}>
            {isZh
              ? '机器人、嵌入式、AI 与协议相关技术名词的中英文释义'
              : 'Chinese & English explanations of robotics, embedded, AI and protocol terms'}
          </p>
        </header>

        <ul className={styles.grid}>
          {KNOWLEDGE_CARDS.map(tag => (
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
