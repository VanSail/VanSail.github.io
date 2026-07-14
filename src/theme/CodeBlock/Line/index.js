import React, {useState, useCallback} from 'react';
import clsx from 'clsx';
import LineToken from '@theme-original/CodeBlock/Line/Token';
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
  const [copied, setCopied] = useState(false);
  const lineContent = fixLineBreak(line);

  const getLineText = useCallback(() => {
    return lineContent.map(token => token.content).join('');
  }, [lineContent]);

  const handleCopy = useCallback(() => {
    const text = getLineText();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [getLineText]);

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
          title="复制此行"
          type="button"
        >
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
      </span>
    </div>
  );
}
