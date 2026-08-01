import type {ReactElement} from 'react';
import Layout from '@theme/Layout';
import {useLocation} from '@docusaurus/router';
import {KNOWLEDGE_CARDS, CARD_CATS} from '@site/src/data/knowledgeCards';
import styles from './knowledge.module.css';

/**
 * 知识卡片总览页（首页「知识卡片」区点击跳转至此）。
 * 按分类分组展示所有名词：名词缩写、中英文全称、含义释义。
 * 数据来自 src/data/knowledgeCards.tsx，新增名词只需在数组追加一项。
 */
export default function Knowledge(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';

  const grouped = CARD_CATS.map(meta => ({
    meta,
    cards: KNOWLEDGE_CARDS.filter(c => c.cat === meta.id),
  })).filter(g => g.cards.length > 0);

  return (
    <Layout
      title={isZh ? '知识卡片' : 'Knowledge Cards'}
      description={
        isZh
          ? '机器人、嵌入式、AI 与协议相关技术名词释义'
          : 'Robotics, embedded, AI and protocol technical terms explained'
      }
    >
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {isZh ? '知识卡片' : 'Knowledge Cards'}
          </h1>
          <p className={styles.subtitle}>
            {isZh
              ? '机器人、嵌入式、AI 与协议领域常见技术名词，帮你快速建立术语体系。'
              : 'Common terms across robotics, embedded, AI and protocols — build your glossary fast.'}
          </p>
        </header>

        {grouped.map(({meta, cards}) => (
          <section className={styles.group} key={meta.id}>
            <h2 className={styles.groupTitle} style={{color: meta.color}}>
              <span
                className={styles.groupDot}
                style={{background: meta.color}}
                aria-hidden="true"
              />
              {isZh ? meta.label.zh : meta.label.en}
              <span className={styles.groupCount}>{cards.length}</span>
            </h2>

            <ul className={styles.grid}>
              {cards.map(tag => (
                <li
                  className={styles.item}
                  id={tag.abbr}
                  key={tag.abbr}
                  style={{
                    borderTopColor: meta.color,
                  }}
                >
                  <div className={styles.itemHead}>
                    <span
                      className={styles.catTag}
                      style={{color: meta.color, borderColor: meta.color}}
                    >
                      {isZh ? meta.tag.zh : meta.tag.en}
                    </span>
                    <span className={styles.abbr}>{tag.abbr}</span>
                  </div>

                  <dl className={styles.fields}>
                    <div className={styles.field}>
                      <dt>{isZh ? '全称' : 'Full name'}</dt>
                      <dd>{isZh ? tag.nameZh : tag.nameEn}</dd>
                    </div>
                    <div className={styles.field}>
                      <dt>{isZh ? '含义' : 'Meaning'}</dt>
                      <dd>{isZh ? tag.descZh : tag.descEn}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </Layout>
  );
}
