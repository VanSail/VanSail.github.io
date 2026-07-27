import {useEffect, useRef, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './FloatingToolbar.module.css';

function ToolsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="12" cy="18" r="2" />
      <line x1="7.4" y1="7.4" x2="16.6" y2="10.6" />
      <line x1="13.4" y1="16.6" x2="16.6" y2="13.4" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 5V3M15 5V3M9 19v2M15 19v2M5 9H3M5 15H3M19 9h2M19 15h2" />
      <path d="M12 5V19" />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M3 15h18M9 4v16M15 4v16" />
    </svg>
  );
}

function MindmapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}

interface ToolItem {
  to: string;
  icon: ReactNode;
  label: {zh: string; en: string};
}

const tools: ToolItem[] = [
  {
    to: '/docs/guide/',
    icon: <GuideIcon />,
    label: {zh: '文档语法', en: 'Docs Guide'},
  },
  {
    to: '/processor-compare',
    icon: <ChipIcon />,
    label: {zh: '芯片参数', en: 'Processor'},
  },
  {
    to: '/mindmap',
    icon: <MindmapIcon />,
    label: {zh: '思维导图', en: 'Mind Map'},
  },
  {
    to: '/table-converter',
    icon: <TableIcon />,
    label: {zh: '表格转换', en: 'Table'},
  },
  {
    to: '/serial-monitor',
    icon: <SerialIcon />,
    label: {zh: '串口助手', en: 'Serial'},
  },
];

export default function FloatingToolbar(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
        {tools.map(t => (
          <a
            key={t.to}
            href={t.to}
            className={styles.tool}
            onClick={() => setOpen(false)}
          >
            <span className={styles.toolIcon}>{t.icon}</span>
            <span className={styles.toolLabel}>{t.label[locale]}</span>
          </a>
        ))}
      </div>
      <button
        type="button"
        className={`${styles.toggle} ${open ? styles.toggleActive : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={locale === 'zh' ? '实用工具' : 'Tools'}
        aria-expanded={open}
      >
        <ToolsIcon />
      </button>
    </div>
  );
}
