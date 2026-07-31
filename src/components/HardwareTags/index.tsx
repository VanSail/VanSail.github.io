import type {ReactElement} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {HARDWARE_TAGS} from '@site/src/data/hardwareTags';

/**
 * 首页底部硬件名词标签区：2 行横向无缝滑动卡片，术语第一行、解释第二行起。
 * 顶部一行左侧为板块标题、右侧为"查看更多"入口。标签内容来自 hardwareTags.tsx。
 *
 * 每行的标签序列复制一份，配合 CSS translateX(-50%) 实现无缝循环。
 */
export default function HardwareTags(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const glossaryPath =
    locale === 'en' ? '/en/hardware-glossary' : '/hardware-glossary';
  const isZh = locale === 'zh';

  // 把标签均分为 2 行
  const perRow = Math.ceil(HARDWARE_TAGS.length / 2);
  const rows: (typeof HARDWARE_TAGS)[] = [
    HARDWARE_TAGS.slice(0, perRow),
    HARDWARE_TAGS.slice(perRow, perRow * 2),
  ];

  return (
    <section
      className={styles.wrap}
      aria-label={isZh ? '硬件名词' : 'Hardware terms'}
    >
      <div className={styles.head}>
        <span className={styles.headTitle}>
          {isZh ? '硬件名词' : 'Hardware Terms'}
        </span>
        <Link className={styles.moreLink} to={glossaryPath}>
          {isZh ? '查看更多 ›' : 'View all ›'}
        </Link>
      </div>

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
                  <article className={styles.card} key={`${tag.abbr}-${i}`}>
                    <div className={styles.cardHead}>
                      <span className={styles.abbr}>{tag.abbr}</span>
                      <span className={styles.fullName}>
                        {isZh ? tag.nameZh : tag.nameEn}
                      </span>
                    </div>
                    <p className={styles.desc}>
                      {isZh ? tag.descZh : tag.descEn}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
