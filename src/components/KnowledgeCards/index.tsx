import type {ReactElement} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {KNOWLEDGE_CARDS} from '@site/src/data/knowledgeCards';

/**
 * 首页底部「知识卡片」区：顶部居中标题 + 2 行横向无缝流动卡片。
 * 点击任意卡片跳转 /knowledge 总页。每行序列复制一份配合 CSS translateX(-50%) 实现无缝循环。
 * 内容来自 knowledgeCards.tsx。
 */
export default function KnowledgeCards(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';
  const cardsPath = locale === 'en' ? '/en/knowledge' : '/knowledge';

  // 按奇偶索引交错分配到两行，保证两行标签集合互斥、互不重复
  const rows: (typeof KNOWLEDGE_CARDS)[] = [0, 1].map(r =>
    KNOWLEDGE_CARDS.filter((_, i) => i % 2 === r),
  );

  return (
    <section
      className={styles.wrap}
      aria-label={isZh ? '知识卡片' : 'Knowledge Cards'}
    >
      <h2 className={styles.headTitle}>
        {isZh ? '知识卡片' : 'Knowledge Cards'}
      </h2>

      <div className={styles.rows}>
        {rows.map((row, r) => {
          // 偶数行反向滚动，形成交错流动感
          const reversed = r % 2 === 1;
          const seq = reversed ? [...row].reverse() : row;
          const doubled = [...seq, ...seq];
          return (
            <div className={styles.row} key={r}>
              <div
                className={`${styles.track} ${reversed ? styles.reverse : ''}`}
                style={{'--row-index': String(r)} as React.CSSProperties}
              >
                {doubled.map((tag, i) => (
                  <Link
                    className={styles.card}
                    to={`${cardsPath}#${tag.abbr}`}
                    key={`${tag.abbr}-${i}`}
                    aria-label={isZh ? tag.nameZh : tag.nameEn}
                  >
                    <div className={styles.cardHead}>
                      <span className={styles.abbr}>{tag.abbr}</span>
                      <span className={styles.fullName}>
                        {isZh ? tag.nameZh : tag.nameEn}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
