import type {ReactElement} from 'react';
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
 *
 * 交互：
 *  - 自动匀速滚动（CSS 不可控，故用 JS 驱动 transform）
 *  - 鼠标悬停左列：暂停自动滚动，可用滚轮手动浏览
 *  - 鼠标离开：从当前位置继续自动滚动
 */
export default function ExploreSection(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';

  const N = TUTORIALS.length;
  const [activeId, setActiveId] = useState(TUTORIALS[0].id);

  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0); // 已滚动的「卡片数」（浮点）
  const pausedRef = useRef(false);
  const activeRef = useRef(0);
  // 量得的布局参数（卡片步长、scroller 高度、居中偏移）
  const stepRef = useRef(100);
  const centerOffRef = useRef(2);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;

    // 量取真实步长与居中偏移，避免与 CSS 尺寸硬编码耦合
    const kids = track.children;
    if (kids.length >= 2) {
      stepRef.current =
        (kids[1] as HTMLElement).offsetTop -
          (kids[0] as HTMLElement).offsetTop || 100;
    }
    const scrollerH = scroller.clientHeight || 420;
    centerOffRef.current = scrollerH / 2 / stepRef.current - 0.5;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // 居中卡片索引：视觉上位于 scroller 垂直中央的那张
    const centeredIndex = () => {
      const idx = Math.round(posRef.current + centerOffRef.current);
      return ((idx % N) + N) % N;
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!pausedRef.current && !reduce) {
        // 28s 走完一轮（N 张卡片）的匀速速度
        posRef.current += (N / 28) * dt;
      }
      // 应用位移（doubled 序列保证无缝）
      const p = posRef.current % N;
      track.style.transform = `translateY(${-p * stepRef.current}px)`;
      // 仅在居中卡片变化时更新右侧详情，避免每帧 setState
      const idx = centeredIndex();
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActiveId(TUTORIALS[idx].id);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // 滚轮手动浏览（非 passive，阻止页面滚动）
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      posRef.current += (e.deltaY / stepRef.current) * 0.6;
      // 归一到正数，保持循环
      while (posRef.current < 0) posRef.current += N;
    };
    scroller.addEventListener('wheel', onWheel, {passive: false});

    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener('wheel', onWheel);
    };
  }, [N]);

  const active = TUTORIALS.find(t => t.id === activeId) ?? TUTORIALS[0];
  const doubled = [...TUTORIALS, ...TUTORIALS];
  const docsPrefix = locale === 'en' ? '/en' : '';

  const resolveTo = (to: string) =>
    to.startsWith('http') ? to : `${docsPrefix}${to}`;

  // 点击某卡片 → 让其滚动到中央
  const focusCard = (i: number) => {
    const target = i - centerOffRef.current;
    posRef.current = target;
    while (posRef.current < 0) posRef.current += N;
  };

  return (
    <section
      className={styles.wrap}
      aria-label={isZh ? '探索教程' : 'Explore Tutorials'}
    >
      <h2 className={styles.headTitle}>{isZh ? '探索板块' : 'Explore'}</h2>

      <div className={styles.inner}>
        {/* 左：单列竖向滚动教程卡片 */}
        <div
          className={styles.scroller}
          ref={scrollerRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div className={styles.track} ref={trackRef}>
            {doubled.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className={`${styles.card} ${
                  t.id === activeId ? styles.cardActive : ''
                }`}
                onClick={() => focusCard(i < N ? i : i - N)}
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
