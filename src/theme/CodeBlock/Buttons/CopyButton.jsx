import React, {useCallback, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import {copyText} from '@site/src/lib/clipboard';
import styles from './styles.module.css';

export default function CopyButton({className}) {
  const {
    metadata: {code},
  } = useCodeBlockContext();
  const {i18n} = useDocusaurusContext();
  const english = i18n.currentLocale === 'en';
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(undefined);

  const handleCopy = useCallback(async () => {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
  }, [code]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const label = english
    ? copied
      ? 'Copied'
      : 'Copy'
    : copied
      ? '已复制'
      : '复制';

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(styles.iconBtn, copied && styles.copied, className)}
      aria-label={label}
      title={label}
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          style={{
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          style={{
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }}
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
