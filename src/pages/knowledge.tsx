import {useMemo, useState} from 'react';
import type {ReactElement} from 'react';
import Layout from '@theme/Layout';
import {useLocation} from '@docusaurus/router';
import {KNOWLEDGE_CARDS, CARD_CATS} from '@site/src/data/knowledgeCards';
import styles from './knowledge.module.css';

/**
 * 知识卡片总览页（首页「知识卡片」区点击跳转至此）。
 * 按分类分组展示所有名词：名词缩写、中英文全称、含义释义。
 * 标题下提供搜索框，可实时按缩写/中英文全称/释义过滤卡片。
 * 数据来自 src/data/knowledgeCards.tsx，新增名词只需在数组追加一项。
 */
export default function Knowledge(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return KNOWLEDGE_CARDS;
    return KNOWLEDGE_CARDS.filter(c => {
      const hay = [c.abbr, c.nameZh, c.nameEn, c.descZh, c.descEn]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  const grouped = CARD_CATS.map(meta => ({
    meta,
    cards: filtered.filter(c => c.cat === meta.id),
  })).filter(g => g.cards.length > 0);

  return (
    <Layout
      title={isZh ? '知识卡片' : 'Knowledge Cards'}
      description={
        isZh
          ? '硬件、AI、编程与嵌入式相关技术名词释义'
          : 'Hardware, AI, programming and embedded technical terms explained'
      }
    >
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {isZh ? '知识卡片' : 'Knowledge Cards'}
          </h1>

          <div className={styles.searchBox}>
            <svg
              className={styles.searchIcon}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 5 1.5-1.5-5-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
              />
            </svg>
            <input
              className={styles.searchInput}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                isZh
                  ? '搜索缩写、中英文全称或含义…'
                  : 'Search abbr, full name or meaning…'
              }
              aria-label={isZh ? '搜索知识卡片' : 'Search knowledge cards'}
            />
            {query && (
              <button
                className={styles.searchClear}
                type="button"
                onClick={() => setQuery('')}
                aria-label={isZh ? '清除' : 'Clear'}
              >
                ×
              </button>
            )}
          </div>

          {query && (
            <p className={styles.resultHint}>
              {isZh
                ? `匹配到 ${filtered.length} 张卡片`
                : `${filtered.length} card(s) matched`}
            </p>
          )}
        </header>

        {grouped.length > 1 && (
          <nav
            className={styles.toc}
            aria-label={isZh ? '分类导航' : 'Category nav'}
          >
            <span className={styles.tocLabel}>
              {isZh ? '分类' : 'Categories'}
            </span>
            <ul className={styles.tocList}>
              {grouped.map(({meta, cards}) => (
                <li key={meta.id}>
                  <a
                    className={styles.tocLink}
                    href={`#cat-${meta.id}`}
                    style={{'--cat-color': meta.color} as React.CSSProperties}
                  >
                    <span
                      className={styles.tocDot}
                      style={{background: meta.color}}
                      aria-hidden="true"
                    />
                    {isZh ? meta.label.zh : meta.label.en}
                    <span className={styles.tocCount}>{cards.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {grouped.length === 0 ? (
          <p className={styles.empty}>
            {isZh
              ? '没有匹配的卡片，换个关键词试试。'
              : 'No cards matched. Try another keyword.'}
          </p>
        ) : (
          grouped.map(({meta, cards}) => (
            <section
              className={styles.group}
              id={`cat-${meta.id}`}
              key={meta.id}
            >
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
          ))
        )}
      </main>
    </Layout>
  );
}
