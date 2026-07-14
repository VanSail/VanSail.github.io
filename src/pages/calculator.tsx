import {useState, useMemo, type ReactNode} from 'react';
import Layout from '@theme/Layout';

import styles from './serial-monitor.module.css';

const BUTTONS = [
  'C', '⌫', '(', ')',
  '7', '8', '9', '/',
  '4', '5', '6', '*',
  '1', '2', '3', '-',
  '0', '.', '=', '+',
];

// 仅允许数字、运算符、括号与小数点，避免执行任意代码
const safeEval = (e: string): string => {
  if (!e.trim()) return '';
  if (!/^[0-9+\-*/().\s]+$/.test(e)) return 'Error';
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(`"use strict"; return (${e});`);
    const v = fn() as unknown;
    if (typeof v !== 'number' || !isFinite(v)) return 'Error';
    return String(v);
  } catch {
    return 'Error';
  }
};

export default function Calculator(): ReactNode {
  const [expr, setExpr] = useState('');
  const result = useMemo(() => safeEval(expr), [expr]);

  const handle = (key: string) => {
    if (key === 'C') {
      setExpr('');
      return;
    }
    if (key === '⌫') {
      setExpr(p => p.slice(0, -1));
      return;
    }
    if (key === '=') {
      if (result && result !== 'Error') setExpr(result);
      return;
    }
    setExpr(p => p + key);
  };

  return (
    <Layout title="计算器" description="网页版四则运算计算器">
      <main className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>计算器</h1>
          <p className={styles.subtitle}>支持加减乘除与括号的实时计算工具</p>
        </div>
        <div className={styles.panel}>
          <div
            className={styles.input}
            style={{
              fontFamily: "'SF Mono','Fira Code',Menlo,Monaco,monospace",
              fontSize: 22,
              textAlign: 'right',
              minHeight: 30,
              wordBreak: 'break-all',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
            {expr || '0'}
          </div>
          <div
            style={{
              fontFamily: "'SF Mono','Fira Code',Menlo,Monaco,monospace",
              fontSize: 16,
              textAlign: 'right',
              color: 'var(--ifm-color-primary)',
              minHeight: 22,
              wordBreak: 'break-all',
              marginTop: 8,
            }}>
            {result && result !== 'Error'
              ? `= ${result}`
              : result === 'Error'
                ? '= Error'
                : ''}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              marginTop: 16,
            }}>
            {BUTTONS.map(b => {
              const isOp = ['+', '-', '*', '/', '(', ')'].includes(b);
              const highlight = b === '=' || b === 'C' || b === '⌫';
              return (
                <button
                  key={b}
                  type="button"
                  className={`${styles.btn} ${highlight ? styles.btnPrimary : ''}`}
                  style={isOp ? {fontWeight: 600} : undefined}
                  onClick={() => handle(b)}>
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}
