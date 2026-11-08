import React, {useState, useCallback, useRef, useEffect} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/** clientModule 点击代码块标题时派发，保证按钮 state 与 DOM 状态同步 */
export const COLLAPSE_EVENT = 'vansail:codeblock-toggle';

export default function CollapseButton({className}) {
  const {i18n} = useDocusaurusContext();
  const english = i18n.currentLocale === 'en';
  const [collapsed, setCollapsed] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const container = buttonRef.current?.closest(
      '[class*="codeBlockContainer"]',
    );
    if (!container) return undefined;
    const sync = e => setCollapsed(Boolean(e.detail?.collapsed));
    container.addEventListener(COLLAPSE_EVENT, sync);
    return () => container.removeEventListener(COLLAPSE_EVENT, sync);
  }, []);

  const handleClick = useCallback(
    e => {
      const container = e.currentTarget.closest(
        '[class*="codeBlockContainer"]',
      );
      if (!container) return;
      const next = !collapsed;
      setCollapsed(next);
      container.setAttribute('data-collapsed', next ? 'true' : 'false');
      container.dispatchEvent(
        new CustomEvent(COLLAPSE_EVENT, {detail: {collapsed: next}}),
      );
    },
    [collapsed],
  );

  const label = english
    ? collapsed
      ? 'Expand'
      : 'Collapse'
    : collapsed
      ? '展开'
      : '折叠';

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={clsx(styles.iconBtn, className)}
      aria-label={label}
      aria-expanded={!collapsed}
      title={label}
    >
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
        }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
