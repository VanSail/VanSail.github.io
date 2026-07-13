import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function CollapseButton({className}) {
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = useCallback((e) => {
    const container = e.currentTarget.closest('[class*="codeBlockContainer"]');
    if (!container) return;
    const next = !collapsed;
    setCollapsed(next);
    if (next) {
      container.setAttribute('data-collapsed', 'true');
    } else {
      container.removeAttribute('data-collapsed');
    }
  }, [collapsed]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(styles.iconBtn, className)}
      aria-label={collapsed ? '展开' : '折叠'}
      title={collapsed ? '展开' : '折叠'}>
      {collapsed ? (
        // 展开：四角向外箭头
        <svg viewBox="0 0 28 28" style={{width: 28, height: 28, fill: 'none', stroke: '#1598c5', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
          <path d="M6 12 L6 6 L12 6" />
          <path d="M22 12 L22 6 L16 6" />
          <path d="M6 16 L6 22 L12 22" />
          <path d="M22 16 L22 22 L16 22" />
        </svg>
      ) : (
        // 折叠：四角向内箭头
        <svg viewBox="0 0 28 28" style={{width: 28, height: 28, fill: 'none', stroke: '#f6b300', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
          <path d="M6 6 L12 6 L12 12" />
          <path d="M22 6 L16 6 L16 12" />
          <path d="M6 22 L12 22 L12 16" />
          <path d="M22 22 L16 22 L16 16" />
        </svg>
      )}
    </button>
  );
}
