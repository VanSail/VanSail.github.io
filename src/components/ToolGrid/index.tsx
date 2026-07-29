import {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/* ---------- 图标 ---------- */
function GuideIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function MindmapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="5" rx="1.5" />
      <rect x="3" y="16" width="6" height="5" rx="1.5" />
      <rect x="15" y="16" width="6" height="5" rx="1.5" />
      <path d="M12 8v4M12 12H6v4M12 12h6v4" />
    </svg>
  );
}

function SerialIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}

/* ---------- 数据 ---------- */
interface Tool {
  to: (locale: 'zh' | 'en') => string;
  icon: ReactNode;
  name: {zh: string; en: string};
  desc: {zh: string; en: string};
  tags: {zh: string[]; en: string[]};
}

const TOOLS: Tool[] = [
  {
    to: l => (l === 'en' ? '/en/docs/guide/' : '/docs/guide/'),
    icon: <GuideIcon />,
    name: {zh: '文档语法', en: 'Docs & Syntax'},
    desc: {
      zh: '从零搭建环境，系统学习语法',
      en: 'Set up the env, learn the syntax',
    },
    tags: {
      zh: ['教程', '环境搭建', '语法参考'],
      en: ['Tutorials', 'Setup', 'Syntax'],
    },
  },
  {
    to: l => (l === 'en' ? '/en/mindmap' : '/mindmap'),
    icon: <MindmapIcon />,
    name: {zh: '思维导图', en: 'Mind Map'},
    desc: {zh: '在线绘制与整理思维结构', en: 'Sketch and organize your ideas'},
    tags: {
      zh: ['可视化', '在线编辑', '导出'],
      en: ['Visual', 'Online', 'Export'],
    },
  },
  {
    to: l => (l === 'en' ? '/en/serial-monitor' : '/serial-monitor'),
    icon: <SerialIcon />,
    name: {zh: '串口助手', en: 'Serial Monitor'},
    desc: {
      zh: 'Web Serial 实时收发与调试',
      en: 'Debug over Web Serial in real time',
    },
    tags: {
      zh: ['Web Serial', '实时', '调试'],
      en: ['Web Serial', 'Realtime', 'Debug'],
    },
  },
];

export default function ToolGrid(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  return (
    <section className={styles.section} aria-label="tools">
      <div className={styles.grid}>
        {TOOLS.map((t, i) => (
          <Link key={i} to={t.to(locale)} className={styles.card}>
            <span className={styles.media}>
              <span className={styles.logo}>{t.icon}</span>
            </span>
            <span className={styles.name}>{t.name[locale]}</span>
            <span className={styles.desc}>{t.desc[locale]}</span>
            <span className={styles.tags}>
              {t.tags[locale].map((tag, j) => (
                <span className={styles.tag} key={j}>
                  {tag}
                </span>
              ))}
            </span>
            <span className={styles.go} aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
