import {useLayoutEffect, useMemo, useRef, useState} from 'react';
import type {ReactElement} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {KNOWLEDGE_CARDS} from '@site/src/data/knowledgeCards';

/** 固定滚动速度（像素/秒）。改这个值即可统一调整快慢，与卡片数量无关 */
const SCROLL_SPEED = 60;

/**
 * 首页底部「知识卡片」区：顶部居中标题 + 2 行横向无缝流动卡片。
 * 点击任意卡片跳转 /knowledge 总页。每行序列复制一份配合 CSS translateX(-50%) 实现无缝循环。
 * 速度固定：用 JS 测量轨道实际宽度，按 SCROLL_SPEED 反推动画时长，
 * 因此无论有多少张卡片、卡片多宽，滚动速度都一致。
 */
export default function KnowledgeCards(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';
  const cardsPath = locale === 'en' ? '/en/knowledge' : '/knowledge';

  // 按奇偶索引交错分配到两行，保证两行标签集合互斥、互不重复
  const rows: (typeof KNOWLEDGE_CARDS)[] = useMemo(
    () => [0, 1].map(r => KNOWLEDGE_CARDS.filter((_, i) => i % 2 === r)),
    [],
  );

  // 每行 track 的 DOM 引用与按固定速度算出的动画时长
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [durations, setDurations] = useState<number[]>([]);

  useLayoutEffect(() => {
    const calc = () => {
      const next = rows.map((_, r) => {
        const el = trackRefs.current[r];
        if (!el) return 0;
        // 轨道走完 50% 即完成一次循环，可滚动距离 = 实际宽度 / 2
        const scrollWidth = el.scrollWidth / 2;
        return scrollWidth / SCROLL_SPEED; // 时长(s) = 距离 / 速度
      });
      setDurations(next);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [rows]);

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
                ref={el => {
                  trackRefs.current[r] = el;
                }}
                className={`${styles.track} ${reversed ? styles.reverse : ''}`}
                style={
                  {
                    '--row-index': String(r),
                    animationDuration: `${durations[r] ?? 0}s`,
                  } as React.CSSProperties
                }
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
