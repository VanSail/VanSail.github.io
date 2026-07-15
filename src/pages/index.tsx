import {useEffect, useRef, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero3D from '@site/src/components/Hero3D';

import styles from './index.module.css';

interface MenuOption {
  label: string | LText;
  to?: string | LText;
}

interface LText {
  zh: string;
  en: string;
}

interface CardItem {
  to: string;
  title: LText;
  desc: LText;
  icon: ReactNode;
  menu?: MenuOption[];
  numbered?: boolean;
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

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

const serialIcon = (
  <svg {...svgProps}>
    <path d="M5 8.5 7 6h10l2 2.5v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
    <path d="M8.5 11h7M8.5 13.5h7M8.5 16h7" />
  </svg>
);

const calcIcon = (
  <svg {...svgProps}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <line x1="8" y1="7" x2="16" y2="7" />
    <circle cx="9" cy="13" r="1" />
    <circle cx="13" cy="13" r="1" />
    <circle cx="15" cy="13" r="1" />
    <circle cx="9" cy="16" r="1" />
    <circle cx="13" cy="16" r="1" />
    <circle cx="15" cy="16" r="1" />
  </svg>
);

const baseIcon = (
  <svg {...svgProps}>
    <path d="M4 8h13l-3-3" />
    <path d="M20 16H7l3 3" />
  </svg>
);

const zshIcon = (
  <svg {...svgProps}>
    <path d="M6 5h12" />
    <path d="M17 5 7 19" />
    <path d="M6 19h12" />
    <circle cx="17" cy="5" r="1.5" />
    <circle cx="7" cy="19" r="1.5" />
  </svg>
);

const nodeIcon = (
  <svg {...svgProps}>
    <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9z" />
    <path d="M9.5 14c0 1.2 1 1.8 2.4 1.8 1.6 0 2.6-.7 2.6-2.1V9.5h-1.7v3.7c0 .7-.4 1-1.1 1-.6 0-1-.3-1-1V9.5H9.5z" />
  </svg>
);

const gitIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1.27a11 11 0 0 0-3.48 21.45c.55.1.75-.24.75-.53v-1.85c-3.06.67-3.71-1.47-3.71-1.47-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.67.07-.67 1.1.08 1.69 1.14 1.69 1.14.98 1.68 2.58 1.19 3.21.91.1-.71.38-1.19.7-1.46-2.45-.28-5.02-1.22-5.02-5.44 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.01.75 2.04v3.03c0 .3.2.64.76.53A11 11 0 0 0 12 1.27Z" />
  </svg>
);

const aiAgents: CardItem[] = [
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

const robots: CardItem[] = [
  {
    to: 'https://wiki.ros.org/noetic',
    title: {zh: 'ROS1', en: 'ROS1'},
    desc: {zh: '经典 ROS · 基于 ROS Master', en: 'Classic ROS · ROS Master Based'},
    menu: [
      {label: 'Melodic', to: 'https://wiki.ros.org/melodic'},
      {label: 'Noetic', to: 'https://wiki.ros.org/noetic'},
    ],
    icon: rosIcon,
  },
  {
    to: '/docs/ros2',
    title: {zh: 'ROS2', en: 'ROS2'},
    desc: {zh: '新一代 · DDS 实时跨平台', en: 'Next-Gen · DDS Realtime Cross-Platform'},
    menu: [
      {label: 'Humble', to: 'https://docs.ros.org/en/humble/'},
      {label: 'Jazzy', to: 'https://docs.ros.org/en/jazzy/'},
    ],
    icon: rosIcon,
  },
];

// 网页内运行的小工具
const webTools: CardItem[] = [
  {
    to: '/serial-monitor',
    title: {zh: '串口监视器', en: 'Serial Monitor'},
    desc: {zh: '网页串口调试 · 免驱动', en: 'Web Serial Monitor · Driver-Free'},
    icon: serialIcon,
  },
  {
    to: '/calculator',
    title: {zh: '计算器', en: 'Calculator'},
    desc: {zh: '科学计算 · 实时计算', en: 'Scientific Calc · Live Results'},
    icon: calcIcon,
  },
  {
    to: '/base-converter',
    title: {zh: '进制转换', en: 'Base Converter'},
    desc: {zh: '二/八/十/十六进制互转', en: 'Binary/Octal/Dec/Hex Convert'},
    icon: baseIcon,
  },
];

// 外部开发资源 / 文档
const devResources: CardItem[] = [
  {
    to: '/docs/zsh',
    title: {zh: 'Z Shell', en: 'Z Shell'},
    desc: {zh: '现代终端 · 插件化增强', en: 'Modern Shell · Plugin Enhanced'},
    numbered: true,
    menu: [
      {label: '安装 Zsh'},
      {label: '安装 Oh My Zsh', to: 'https://ohmyz.sh/'},
      {label: '安装终端建议插件', to: 'https://github.com/zsh-users/zsh-autosuggestions'},
    ],
    icon: zshIcon,
  },
  {
    to: 'https://nodejs.org/',
    title: {zh: 'Node.js', en: 'Node.js'},
    desc: {zh: 'JavaScript 运行时', en: 'JavaScript Runtime'},
    icon: nodeIcon,
  },
  {
    to: 'https://git-scm.com/',
    title: {zh: 'Git', en: 'Git'},
    desc: {zh: '分布式版本控制系统', en: 'Distributed Version Control'},
    icon: gitIcon,
    menu: [
      {label: {zh: 'Git 官网', en: 'Git Website'}, to: 'https://git-scm.com/'},
      {
        label: {zh: 'Git 文档', en: 'Git Documentation'},
        to: {zh: 'https://git-scm.com/book/zh/v2', en: 'https://git-scm.com/book/en/v2'},
      },
    ],
  },
];

const sections = {
  ai: {zh: 'AI 智能体', en: 'AI Agents'},
  robots: {zh: '机器人操作系统', en: 'Robot Operating System'},
  web: {zh: '网页工具', en: 'Web Tools'},
  software: {zh: '软件工具', en: 'Software Tools'},
};

const meta = {
  title: {zh: 'VanSail', en: 'VanSail'},
  desc: {zh: '教程文档与网页工具', en: 'Tutorials & web tools'},
};

function Card({item, locale}: {item: CardItem; locale: 'zh' | 'en'}): ReactNode {
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
        className={styles.card}>
        <span className={styles.cardIcon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={styles.cardBody}>
          <span className={styles.cardTitle}>{item.title[locale]}</span>
          <span className={styles.cardDesc}>{item.desc[locale]}</span>
        </span>
      </a>
    );
  }
  return (
    <Link to={item.to} className={styles.card}>
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

function MenuCard({item, locale}: {item: CardItem; locale: 'zh' | 'en'}): ReactNode {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  return (
    <div className={styles.menuCardWrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.card}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu">
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
        <div className={styles.menuPopover} role="menu">
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
                  key={label}
                  className={`${styles.menuItem} ${styles.menuItemStatic}`}
                  role="menuitem">
                  {inner}
                </span>
              );
            }
            const ext = to.startsWith('http');
            return ext ? (
              <a
                key={label}
                href={to}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => setOpen(false)}>
                {inner}
              </a>
            ) : (
              <Link
                key={label}
                to={to}
                className={styles.menuItem}
                role="menuitem"
                onClick={() => setOpen(false)}>
                {inner}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  return (
    <div
      style={{background: 'var(--ifm-background-color)', minHeight: '100vh'}}>
      <Layout title={meta.title[locale]} description={meta.desc[locale]}>
        <main className={styles.page}>
          <section className={styles.section}>
            <Hero3D />
            <h2 className={styles.sectionTitle}>{sections.ai[locale]}</h2>
            <div className={styles.grid}>
              {aiAgents.map(item => (
                <Card key={item.to} item={item} locale={locale} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{sections.robots[locale]}</h2>
            <div className={styles.grid}>
              {robots.map(item => (
                <Card key={item.to} item={item} locale={locale} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{sections.web[locale]}</h2>
            <div className={styles.grid}>
              {webTools.map(item => (
                <Card key={item.to} item={item} locale={locale} />
              ))}
            </div>
            <h2 className={`${styles.sectionTitle} ${styles.sectionGap}`}>
              {sections.software[locale]}
            </h2>
            <div className={styles.grid}>
              {devResources.map(item => (
                <Card key={item.to} item={item} locale={locale} />
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </div>
  );
}
