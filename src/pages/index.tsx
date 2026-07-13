import {useEffect, useRef, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Hero3D from '@site/src/components/Hero3D';

import styles from './index.module.css';

interface MenuOption {
  label: string;
  to?: string;
}

interface CardItem {
  to: string;
  title: string;
  desc: string;
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

const aiAgents: CardItem[] = [
  {
    to: 'https://opencode.ai/',
    title: 'OpenCode',
    desc: '开源 AI 编程代理',
    icon: (
      <svg {...svgProps}>
        <polyline points="9 7 5 12 9 17" />
        <polyline points="15 7 19 12 15 17" />
        <line x1="13" y1="9" x2="11" y2="15" />
      </svg>
    ),
  },
  {
    to: 'https://openclaw.ai/',
    title: 'OpenClaw',
    desc: '开源个人 AI 助手',
    icon: (
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
  },
  {
    to: 'https://hermes-agent.nousresearch.com/',
    title: 'Hermes',
    desc: '跨平台 AI 代理',
    icon: (
      <svg {...svgProps}>
        <path d="M3 18c1-7 6-12 18-12-2 7-7 12-13 13" />
        <path d="M3 18c4-2 9-3 14-2" />
        <path d="M6 16c2-1 4-1 6 0" />
        <path d="M8 13c2-1 4-1 5 0" />
      </svg>
    ),
  },
  {
    to: 'https://tinyhumans.ai/openhuman',
    title: 'OpenHuman',
    desc: '个人 AI 超级智能',
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7" />
        <path d="M16.5 0.5 17.2 2.8 19.5 3.5 17.2 4.2 16.5 6.5 15.8 4.2 13.5 3.5 15.8 2.8Z" />
      </svg>
    ),
  },
];

const robots: CardItem[] = [
  {
    to: 'https://wiki.ros.org/noetic',
    title: 'ROS1',
    desc: '经典 ROS · 基于 ROS Master',
    menu: [
      {label: 'Noetic', to: 'https://wiki.ros.org/noetic'},
      {label: 'Melodic', to: 'https://wiki.ros.org/melodic'},
    ],
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="3.2" r="1.6" />
        <path d="M12 4.8c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" />
        <circle cx="12" cy="12" r="2.6" />
        <path d="M12 9.4v5.2M9.4 12h5.2" />
        <path d="M5 8.5 3 7M5 15.5 3 17M19 8.5 21 7M19 15.5 21 17" />
        <path d="M12 21v2" />
      </svg>
    ),
  },
  {
    to: '/docs/ros2',
    title: 'ROS2',
    desc: '新一代 · DDS 实时跨平台',
    menu: [
      {label: 'Humble', to: 'https://docs.ros.org/en/humble/'},
      {label: 'Jazzy', to: 'https://docs.ros.org/en/jazzy/'},
    ],
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="3.2" r="1.6" />
        <path d="M12 4.8c-4 0-7 3-7 7s3 7 7 7 7-3 7-7-3-7-7-7z" />
        <circle cx="12" cy="12" r="2.6" />
        <path d="M12 9.4v5.2M9.4 12h5.2" />
        <path d="M5 8.5 3 7M5 15.5 3 17M19 8.5 21 7M19 15.5 21 17" />
        <path d="M12 21v2" />
      </svg>
    ),
  },
];

const tools: CardItem[] = [
  {
    to: '/serial-monitor',
    title: '串口监视器',
    desc: '网页串口调试 · 免驱动',
    icon: (
      <svg {...svgProps}>
        <path d="M5 8.5 7 6h10l2 2.5v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
        <path d="M8.5 11h7M8.5 13.5h7M8.5 16h7" />
      </svg>
    ),
  },
  {
    to: '/docs/zsh',
    title: 'Z Shell',
    desc: '现代终端 · 插件化增强',
    numbered: true,
    menu: [
      {label: '安装 Zsh'},
      {label: '安装 Oh My Zsh', to: 'https://ohmyz.sh/'},
      {label: '安装终端建议插件', to: 'https://github.com/zsh-users/zsh-autosuggestions'},
    ],
    icon: (
      <svg {...svgProps}>
        <path d="M6 5h12" />
        <path d="M17 5 7 19" />
        <path d="M6 19h12" />
        <circle cx="17" cy="5" r="1.5" />
        <circle cx="7" cy="19" r="1.5" />
      </svg>
    ),
  },
  {
    to: 'https://nodejs.org/',
    title: 'Node.js',
    desc: 'JavaScript 运行时',
    icon: (
      <svg {...svgProps}>
        <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9z" />
        <path d="M9.5 14c0 1.2 1 1.8 2.4 1.8 1.6 0 2.6-.7 2.6-2.1V9.5h-1.7v3.7c0 .7-.4 1-1.1 1-.6 0-1-.3-1-1V9.5H9.5z" />
      </svg>
    ),
  },
];

function Card({item}: {item: CardItem}): ReactNode {
  if (item.menu) {
    return <MenuCard item={item} />;
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
          <span className={styles.cardTitle}>{item.title}</span>
          <span className={styles.cardDesc}>{item.desc}</span>
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
        <span className={styles.cardTitle}>{item.title}</span>
        <span className={styles.cardDesc}>{item.desc}</span>
      </span>
    </Link>
  );
}

function MenuCard({item}: {item: CardItem}): ReactNode {
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
          <span className={styles.cardTitle}>{item.title}</span>
          <span className={styles.cardDesc}>{item.desc}</span>
        </span>
        <span className={styles.cardCaret} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className={styles.menuPopover} role="menu">
          {item.menu!.map((opt, i) => {
            const inner = (
              <>
                {item.numbered && (
                  <span className={styles.menuStep}>{i + 1}</span>
                )}
                <span className={styles.menuLabel}>{opt.label}</span>
                {opt.to?.startsWith('http') && (
                  <span className={styles.menuExt}>↗</span>
                )}
              </>
            );
            if (!opt.to) {
              return (
                <span
                  key={opt.label}
                  className={`${styles.menuItem} ${styles.menuItemStatic}`}
                  role="menuitem">
                  {inner}
                </span>
              );
            }
            const ext = opt.to.startsWith('http');
            return ext ? (
              <a
                key={opt.label}
                href={opt.to}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => setOpen(false)}>
                {inner}
              </a>
            ) : (
              <Link
                key={opt.label}
                to={opt.to}
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
  return (
    <div
      style={{background: 'var(--ifm-background-color)', minHeight: '100vh'}}>
      <Layout title="VanSail" description="教程文档与实用工具">
        <main className={styles.page}>
          <section className={styles.section}>
            <Hero3D />
            <h2 className={styles.sectionTitle}>AI 智能体</h2>
            <div className={styles.grid}>
              {aiAgents.map(item => (
                <Card key={item.to} item={item} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>机器人操作系统</h2>
            <div className={styles.grid}>
              {robots.map(item => (
                <Card key={item.to} item={item} />
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>实用工具</h2>
            <div className={styles.grid}>
              {tools.map(item => (
                <Card key={item.to} item={item} />
              ))}
            </div>
          </section>
        </main>
      </Layout>
    </div>
  );
}
