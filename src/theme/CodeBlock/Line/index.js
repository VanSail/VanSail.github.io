import React, {useState, useCallback, useRef, useEffect} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import LineToken from '@theme-original/CodeBlock/Line/Token';
import {copyText} from '@site/src/lib/clipboard';
import styles from './styles.module.css';

function fixLineBreak(line) {
  const singleLineBreakToken =
    line.length === 1 && line[0].content === '\n' ? line[0] : undefined;
  if (singleLineBreakToken) {
    return [{...singleLineBreakToken, content: ''}];
  }
  return line;
}

export default function CodeBlockLine({
  line,
  classNames,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}) {
  const {i18n} = useDocusaurusContext();
  const english = i18n.currentLocale === 'en';
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(undefined);
  const lineContent = fixLineBreak(line);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const getLineText = useCallback(() => {
    return lineContent.map(token => token.content).join('');
  }, [lineContent]);

  const handleCopy = useCallback(async () => {
    const text = getLineText();
    if (!text) return;
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1500);
  }, [getLineText]);

  const label = english
    ? copied
      ? 'Copied'
      : 'Copy line'
    : copied
      ? '已复制'
      : '复制此行';

  const lineProps = getLineProps({
    line: lineContent,
    className: clsx(classNames, showLineNumbers && styles.codeLine),
  });

  const lineTokens = lineContent.map((token, key) => {
    const tokenProps = getTokenProps({token});
    return (
      <LineToken key={key} {...tokenProps} line={lineContent} token={token}>
        {tokenProps.children}
      </LineToken>
    );
  });

  return (
    <div {...lineProps} className={clsx(lineProps.className, styles.lineRow)}>
      {showLineNumbers && <span className={styles.lineNumber} />}
      <span className={styles.lineContent}>
        <span className={styles.lineTokens}>{lineTokens}</span>
        <button
          className={clsx(styles.copyBtn, copied && styles.copyBtnDone)}
          onClick={handleCopy}
          aria-label={label}
          title={label}
          type="button"
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
      </span>
    </div>
  );
}
