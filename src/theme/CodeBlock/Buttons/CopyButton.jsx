import React, {useCallback, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

async function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const {default: copy} = await import('copy-text-to-clipboard');
  return copy(text);
}

export default function CopyButton({className}) {
  const {metadata: {code}} = useCodeBlockContext();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(undefined);

  const handleCopy = useCallback(() => {
    copyToClipboard(code).then(() => {
      setCopied(true);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
    });
  }, [code]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(styles.iconBtn, copied && styles.copied, className)}
      aria-label={copied ? '已复制' : '复制'}
      title={copied ? '已复制' : '复制'}>
      {copied ? (
        <svg viewBox="0 0 24 24" style={{fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" style={{fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'}}>
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
