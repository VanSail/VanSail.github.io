import type {ReactElement, CSSProperties} from 'react';
import {useEffect, useRef, useState} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {TUTORIALS, type TutorialIcon} from '@site/src/data/tutorials';

/** 各教程对应的内联图标 */
function TutorialIconSvg({kind}: {kind: TutorialIcon}): ReactElement {
  const common = {
    viewBox: '0 0 48 48',
    className: styles.iconSvg,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.4,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };
  switch (kind) {
    case 'book':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M24 11C19 7 11 7 7 9v28c4-2 12-2 17 2z" />
          <path d="M24 11c5-4 13-4 17-2v28c-4-2-12-2-17 2z" />
          <line x1="24" y1="11" x2="24" y2="40" />
        </svg>
      );
    case 'mcu':
      return (
        <svg {...common} aria-hidden="true">
          <rect x="12" y="12" width="24" height="24" rx="3" />
          <line x1="12" y1="20" x2="8" y2="20" />
          <line x1="12" y1="28" x2="8" y2="28" />
          <line x1="36" y1="20" x2="40" y2="20" />
          <line x1="36" y1="28" x2="40" y2="28" />
          <line x1="20" y1="12" x2="20" y2="8" />
          <line x1="28" y1="12" x2="28" y2="8" />
          <line x1="20" y1="36" x2="20" y2="40" />
          <line x1="28" y1="36" x2="28" y2="40" />
          <circle cx="24" cy="24" r="4" />
        </svg>
      );
    case 'ros':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="18" cy="24" r="9" />
          <circle cx="30" cy="24" r="9" />
          <line x1="24" y1="15" x2="24" y2="33" />
        </svg>
      );
    case 'ai':
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="24" cy="24" r="9" />
          <line x1="24" y1="6" x2="24" y2="13" />
          <line x1="24" y1="35" x2="24" y2="42" />
          <line x1="6" y1="24" x2="13" y2="24" />
          <line x1="35" y1="24" x2="42" y2="24" />
          <circle cx="24" cy="24" r="3" />
        </svg>
      );
  }
}

/**
 * 首页「探索」联动区：左侧单列竖向无缝滚动的教程卡片，
 * 当某张卡片滚动到中央时，右侧详情区切换为该教程（logo + 简介 + 目录）。
 */
export default function ExploreSection(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';

  const [activeId, setActiveId] = useState(TUTORIALS[0].id);
  const listRef = useRef<HTMLDivElement>(null);

  // 用 IntersectionObserver 检测哪张卡片进入左列垂直中央
  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[data-tut-id]'),
    );
    // 只观察原始序列（避免复制份重复触发）
    const originals = items.filter(el => el.dataset.origin === '1');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset.tutId;
            if (id) setActiveId(id);
          }
        });
      },
      // 把激活区压缩为左列垂直中央一条
      {root, rootMargin: '-45% 0px -45% 0px', threshold: 0},
    );
    originals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const active = TUTORIALS.find(t => t.id === activeId) ?? TUTORIALS[0];
  const doubled = [...TUTORIALS, ...TUTORIALS];
  const docsPrefix = locale === 'en' ? '/en' : '';

  const resolveTo = (to: string) =>
    to.startsWith('http') ? to : `${docsPrefix}${to}`;

  return (
    <section
      className={styles.wrap}
      aria-label={isZh ? '探索教程' : 'Explore Tutorials'}
    >
      <h2 className={styles.headTitle}>{isZh ? '探索板块' : 'Explore'}</h2>

      <div className={styles.inner}>
        {/* 左：单列竖向滚动教程卡片 */}
        <div className={styles.scroller} ref={listRef}>
          <div className={styles.track}>
            {doubled.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                data-tutId={t.id}
                data-origin={i < TUTORIALS.length ? '1' : '0'}
                className={`${styles.card} ${
                  t.id === activeId ? styles.cardActive : ''
                }`}
                onClick={() => setActiveId(t.id)}
              >
                <span className={styles.cardIcon}>
                  <TutorialIconSvg kind={t.icon} />
                </span>
                <span className={styles.cardTitle}>
                  {isZh ? t.title.zh : t.title.en}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 右：随居中卡片切换的详情区 */}
        <div className={styles.detail} key={active.id}>
          <div className={styles.detailHead}>
            <div className={styles.logoBox}>
              <TutorialIconSvg kind={active.icon} />
            </div>
            <div>
              <h3 className={styles.detailTitle}>
                {isZh ? active.title.zh : active.title.en}
              </h3>
              <p className={styles.detailDesc}>
                {isZh ? active.desc.zh : active.desc.en}
              </p>
            </div>
          </div>

          <div className={styles.catalogBox}>
            {active.groups.map((g, gi) => (
              <div className={styles.group} key={gi}>
                <span className={styles.groupTitle}>
                  {isZh ? g.label.zh : g.label.en}
                </span>
                <ul className={styles.list}>
                  {g.links.map((link, li) => (
                    <li key={li}>
                      <Link className={styles.item} to={resolveTo(link.to)}>
                        {isZh ? link.label.zh : link.label.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Link className={styles.allLink} to={resolveTo(active.entry)}>
            {isZh ? '查看全部 ›' : 'View all ›'}
          </Link>
        </div>
      </div>
    </section>
  );
}
