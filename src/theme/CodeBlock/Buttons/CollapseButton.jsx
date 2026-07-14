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
      {/* 单个 chevron，根据状态旋转：收起朝下、展开朝上 */}
      <svg
        viewBox="0 0 24 24"
        style={{
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 0.2s ease',
        }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
