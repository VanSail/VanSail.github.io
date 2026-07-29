import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Link from '@docusaurus/Link';

import styles from '@site/src/pages/index.module.css';

/* ---------- types ---------- */

export interface MenuOption {
  label: string | LText;
  to?: string | LText;
}

export interface LText {
  zh: string;
  en: string;
}

export interface CardItem {
  to: string;
  title: LText;
  desc: LText;
  icon: ReactNode;
  menu?: MenuOption[];
  numbered?: boolean;
}

/* ---------- SVG props ---------- */

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/* ---------- icons ---------- */

const aiIcon = {
  opencode: (
    <svg {...svgProps}>
      <polyline points="9 7 5 12 9 17" />
      <polyline points="15 7 19 12 15 17" />
      <line x1="13" y1="9" x2="11" y2="15" />
    </svg>
  ),
  openclaw: (
    <svg {...svgProps}>
      <path d="M10 6c-1-2-2-3-3-4" />
      <path d="M14 6c1-2 2-3 3-4" />
      <path d="M7 9c-4-1-6 2-4 5 1.5 2 5 1 5-2" />
      <path d="M17 9c4-1 6 2 4 5-1.5 2-5 1-5-2" />
      <path d="M9 7c0 4 0 8 3 11 3-3 3-7 3-11 0-1.5-6-1.5-6 0z" />
      <path d="M10 17h4" />
      <path d="M10.5 19.5h3" />
      <circle cx="10.3" cy="11" r=".8" />
      <circle cx="13.7" cy="11" r=".8" />
    </svg>
  ),
  hermes: (
    <svg {...svgProps}>
      <path d="M3 18c1-7 6-12 18-12-2 7-7 12-13 13" />
      <path d="M3 18c4-2 9-3 14-2" />
      <path d="M6 16c2-1 4-1 6 0" />
      <path d="M8 13c2-1 4-1 5 0" />
    </svg>
  ),
  openhuman: (
    <svg {...svgProps}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
      <path d="M16.5 0.5 17.2 2.8 19.5 3.5 17.2 4.2 16.5 6.5 15.8 4.2 13.5 3.5 15.8 2.8Z" />
    </svg>
  ),
};

const rosIcon = (
  <svg {...svgProps}>
    <circle cx="12" cy="3.2" r="1.6" />
    <path d="M12 4.8c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M12 9.4v5.2M9.4 12h5.2" />
    <path d="M5 8.5 3 7M5 15.5 3 17M19 8.5 21 7M19 15.5 21 17" />
    <path d="M12 21v2" />
  </svg>
);

const toolIcon = (
  <svg {...svgProps}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

/* ---------- card data ----------
 *
 * 新增卡片 / 分类的规范（按规律填写即可，无需改组件或样式）：
 *
 * 1) 写一个图标：复用顶部 svgProps，像 aiIcon.* 那样返回一段 <svg>。
 *    const myIcon = (<svg {...svgProps}><path d="..."/></svg>);
 *
 * 2) 在对应数组里追加一个 CardItem 对象：
 *    {
 *      to:   '链接',                 // 站内用 '/docs/xxx'，站外用 'https://...'
 *      title:{zh:'中文名', en:'EN'}, // 双语
 *      desc: {zh:'中文描述', en:'EN desc'},
 *      icon: myIcon,
 *      // 可选 ↓
 *      menu:     [{label:'子项', to:'...'}], // 带下拉子菜单的卡片
 *      numbered: true,                      // 子菜单项显示序号（步骤）
 *    }
 *
 * 3) 新增一个分类页：在 src/pages/ 新建 xxx.tsx，调用 CategoryPage：
 *    <CategoryPage heroType="xxx" meta={{title,desc}} items={myList} />
 *    （heroType 需先在 PageHero.tsx 里加对应动画分支）
 *
 * 卡片宽度由 CSS 固定 3 列控制：单张卡片自动按 1/3 宽度居中，
 * 不会铺满整行，各页面视觉统一。
 * ------------------------------------------------------------ */

export const aiAgents: CardItem[] = [
  {
    to: 'https://opencode.ai/',
    title: {zh: 'OpenCode', en: 'OpenCode'},
    desc: {zh: '开源 AI 编程代理', en: 'Open-Source AI Coding Agent'},
    icon: aiIcon.opencode,
  },
  {
    to: 'https://openclaw.ai/',
    title: {zh: 'OpenClaw', en: 'OpenClaw'},
    desc: {zh: '开源个人 AI 助手', en: 'Open-Source Personal AI Assistant'},
    icon: aiIcon.openclaw,
  },
  {
    to: 'https://hermes-agent.nousresearch.com/',
    title: {zh: 'Hermes', en: 'Hermes'},
    desc: {zh: '跨平台 AI 代理', en: 'Cross-Platform AI Agent'},
    icon: aiIcon.hermes,
  },
  {
    to: 'https://tinyhumans.ai/openhuman',
    title: {zh: 'OpenHuman', en: 'OpenHuman'},
    desc: {zh: '个人 AI 超级智能', en: 'Personal AI Super Intelligence'},
    icon: aiIcon.openhuman,
  },
];

export const robots: CardItem[] = [
  {
    to: 'https://wiki.ros.org/noetic',
    title: {zh: 'ROS1', en: 'ROS1'},
    desc: {
      zh: '经典 ROS · 基于 ROS Master',
      en: 'Classic ROS · ROS Master Based',
    },
    menu: [
      {label: 'Melodic', to: 'https://wiki.ros.org/melodic'},
      {label: 'Noetic', to: 'https://wiki.ros.org/noetic'},
    ],
    icon: rosIcon,
  },
  {
    to: '/docs/ros2',
    title: {zh: 'ROS2', en: 'ROS2'},
    desc: {
      zh: '新一代 · DDS 实时跨平台',
      en: 'Next-Gen · DDS Realtime Cross-Platform',
    },
    menu: [
      {label: 'Humble', to: 'https://docs.ros.org/en/humble/'},
      {label: 'Jazzy', to: 'https://docs.ros.org/en/jazzy/'},
    ],
    icon: rosIcon,
  },
];

export const devResources: CardItem[] = [];

export const stm32Tools: CardItem[] = [
  {
    to: '/docs/stm32/dev-tools',
    title: {zh: '开发工具', en: 'Dev Tools'},
    desc: {zh: '嵌入式开发 · 工具链', en: 'Embedded Dev · Toolchain'},
    icon: toolIcon,
  },
];

/* ---------- section labels ---------- */

export const sectionLabels = {
  ai: {zh: '人工智能', en: 'Artificial Intelligence'},
  robots: {zh: '机器人', en: 'Robotics'},
  software: {zh: '软件', en: 'Software'},
  stm32: {zh: '嵌入式', en: 'Embedded Systems'},
};

/* ---------- reusable Card component ---------- */

function MenuCard({
  item,
  locale,
}: {
  item: CardItem;
  locale: 'zh' | 'en';
}): ReactNode {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const close = (focusButton = false) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close(true);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    const first =
      popoverRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onMenuKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(
      popoverRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ??
        [],
    );
    if (items.length === 0) return;
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const next =
      e.key === 'ArrowDown'
        ? (idx + 1) % items.length
        : (idx - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  return (
    <div className={styles.menuCardWrap} ref={wrapRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.card}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className={styles.cardIcon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardTitle}>{item.title[locale]}</span>
          <span className={styles.cardDesc}>{item.desc[locale]}</span>
        </span>
        <span className={styles.cardCaret} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div
          className={styles.menuPopover}
          role="menu"
          ref={popoverRef}
          onKeyDown={onMenuKeyDown}
        >
          {item.menu!.map((opt, i) => {
            const label =
              typeof opt.label === 'string' ? opt.label : opt.label[locale];
            const to =
              opt.to === undefined
                ? undefined
                : typeof opt.to === 'string'
                  ? opt.to
                  : opt.to[locale];
            const inner = (
              <>
                {item.numbered && (
                  <span className={styles.menuStep}>{i + 1}</span>
                )}
                <span className={styles.menuLabel}>{label}</span>
                {to?.startsWith('http') && (
                  <span className={styles.menuExt}>↗</span>
                )}
              </>
            );
            if (!to) {
              return (
                <span
                  key={i}
                  className={`${styles.menuItem} ${styles.menuItemStatic}`}
                  role="menuitem"
                  tabIndex={-1}
                >
                  {inner}
                </span>
              );
            }
            const ext = to.startsWith('http');
            return ext ? (
              <a
                key={i}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => close()}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={i}
                to={to}
                className={styles.menuItem}
                role="menuitem"
                onClick={() => close()}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Card({
  item,
  locale,
}: {
  item: CardItem;
  locale: 'zh' | 'en';
}): ReactNode {
  const cardClass = styles.card;
  if (item.menu) {
    return <MenuCard item={item} locale={locale} />;
  }
  const isExternal = item.to.startsWith('http');
  if (isExternal) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        <span className={styles.cardIcon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardTitle}>{item.title[locale]}</span>
          <span className={styles.cardDesc}>{item.desc[locale]}</span>
        </span>
        <span className={styles.cardExt} aria-hidden="true">
          ↗
        </span>
      </a>
    );
  }
  return (
    <Link to={item.to} className={cardClass}>
      <span className={styles.cardIcon} aria-hidden="true">
        {item.icon}
      </span>
      <span className={styles.cardBody}>
        <span className={styles.cardTitle}>{item.title[locale]}</span>
        <span className={styles.cardDesc}>{item.desc[locale]}</span>
      </span>
    </Link>
  );
}

/* ---------- AnimatedSection ---------- */

export function AnimatedSection({children}: {children: ReactNode}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0.08},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`${styles.section} ${visible ? styles.animVisible : styles.animHidden}`}
    >
      {children}
    </section>
  );
}
