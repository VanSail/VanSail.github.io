import {useState, useMemo, useEffect, type ReactNode} from 'react';
import Layout from '@theme/Layout';

import styles from './serial-monitor.module.css';

// 仅允许的白名单标识符 → Math 引用，杜绝任意代码执行
const TOKENS: Record<string, string> = {
  sin: 'Math.sin',
  cos: 'Math.cos',
  tan: 'Math.tan',
  ln: 'Math.log',
  log: 'Math.log10',
  sqrt: 'Math.sqrt',
  abs: 'Math.abs',
  pi: 'Math.PI',
  e: 'Math.E',
};

// 显示屏符号 → JS 运算符
const DISPLAY_TO_JS: Record<string, string> = {
  '×': '*',
  '−': '-',
  '÷': '/',
};

const safeEval = (raw: string): string => {
  if (!raw.trim()) return '';
  let expr = raw;
  // 1) 函数名/常量替换为 Math 引用（按长度降序避免部分替换）
  Object.keys(TOKENS)
    .sort((a, b) => b.length - a.length)
    .forEach(name => {
      expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), TOKENS[name]);
    });
  // 2) 显示符号转为 JS 运算符
  Object.keys(DISPLAY_TO_JS).forEach(sym => {
    expr = expr.split(sym).join(DISPLAY_TO_JS[sym]);
  });
  // 3) 替换后仅允许数字/运算符/括号/点/空格与 Math 相关字母
  if (!/^[0-9+\-*/().\sMashPItncoelgrxqbE]+$/.test(expr)) return 'Error';
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(`"use strict"; return (${expr});`);
    const v = fn() as unknown;
    if (typeof v !== 'number' || !isFinite(v)) return 'Error';
    // 消除浮点误差
    return String(Math.round((v + Number.EPSILON) * 1e12) / 1e12);
  } catch {
    return 'Error';
  }
};

interface BtnSpec {
  key: string;
  label: string;
  insert?: string;
  kind: 'clear' | 'util' | 'op' | 'fn' | 'num' | 'eq';
}

const BUTTONS: BtnSpec[] = [
  {key: 'C', label: 'C', kind: 'clear'},
  {key: '⌫', label: '⌫', kind: 'util'},
  {key: '(', label: '(', insert: '(', kind: 'op'},
  {key: ')', label: ')', insert: ')', kind: 'op'},
  {key: '÷', label: '÷', insert: '÷', kind: 'op'},
  {key: 'sin', label: 'sin', insert: 'sin(', kind: 'fn'},
  {key: 'cos', label: 'cos', insert: 'cos(', kind: 'fn'},
  {key: 'tan', label: 'tan', insert: 'tan(', kind: 'fn'},
  {key: 'π', label: 'π', insert: 'π', kind: 'fn'},
  {key: '×', label: '×', insert: '×', kind: 'op'},
  {key: '√', label: '√', insert: 'sqrt(', kind: 'fn'},
  {key: 'x²', label: 'x²', insert: '**2', kind: 'fn'},
  {key: 'xʸ', label: 'xʸ', insert: '**(', kind: 'fn'},
  {key: 'e', label: 'e', insert: 'e', kind: 'fn'},
  {key: '−', label: '−', insert: '−', kind: 'op'},
  {key: '7', label: '7', insert: '7', kind: 'num'},
  {key: '8', label: '8', insert: '8', kind: 'num'},
  {key: '9', label: '9', insert: '9', kind: 'num'},
  {key: '%', label: '%', kind: 'util'},
  {key: '+', label: '+', insert: '+', kind: 'op'},
  {key: '4', label: '4', insert: '4', kind: 'num'},
  {key: '5', label: '5', insert: '5', kind: 'num'},
  {key: '6', label: '6', insert: '6', kind: 'num'},
  {key: '1/x', label: '1/x', kind: 'util'},
  {key: '=', label: '=', kind: 'eq'},
  {key: '1', label: '1', insert: '1', kind: 'num'},
  {key: '2', label: '2', insert: '2', kind: 'num'},
  {key: '3', label: '3', insert: '3', kind: 'num'},
  {key: '0', label: '0', insert: '0', kind: 'num'},
  {key: '.', label: '.', insert: '.', kind: 'num'},
];

export default function Calculator(): ReactNode {
  const [expr, setExpr] = useState('');
  const result = useMemo(() => safeEval(expr), [expr]);

  const press = (b: BtnSpec) => {
    if (b.kind === 'clear') {
      setExpr('');
      return;
    }
    if (b.kind === 'util') {
      if (b.key === '⌫') {
        setExpr(p => p.slice(0, -1));
        return;
      }
      if (b.key === '1/x') {
        setExpr(p => (p ? `1/(${p})` : ''));
        return;
      }
      if (b.key === '%') {
        setExpr(p => (p ? `(${p})/100` : ''));
        return;
      }
    }
    if (b.kind === 'eq') {
      if (result && result !== 'Error') setExpr(result);
      return;
    }
    if (b.insert) setExpr(p => p + b.insert);
  };

  // 支持键盘输入
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const k = ev.key;
      if (/[0-9.+\-*/()]/.test(k)) {
        const mapped = k === '*' ? '×' : k === '/' ? '÷' : k === '-' ? '−' : k;
        setExpr(p => p + mapped);
        ev.preventDefault();
      } else if (k === 'Enter' || k === '=') {
        if (result && result !== 'Error') {
          setExpr(result);
          ev.preventDefault();
        }
      } else if (k === 'Backspace') {
        setExpr(p => p.slice(0, -1));
        ev.preventDefault();
      } else if (k === 'Escape') {
        setExpr('');
        ev.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [result]);

  return (
    <Layout title="计算器" description="网页版科学计算器">
      <main className={`${styles.page} ${styles.wide}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>计算器</h1>
          <p className={styles.subtitle}>
            支持四则运算、括号与常用科学函数，可键盘输入
          </p>
        </div>
        <div className={styles.panel}>
          <div className={styles.calcScreen}>
            <div className={styles.calcExpr}>{expr || '0'}</div>
            <div className={styles.calcResult}>
              {result && result !== 'Error'
                ? `= ${result}`
                : result === 'Error'
                  ? '= Error'
                  : ''}
            </div>
          </div>
          <div className={styles.calcGrid}>
            {BUTTONS.map(b => {
              const primary = b.kind === 'eq' || b.kind === 'clear';
              const op = b.kind === 'op' || b.kind === 'fn';
              return (
                <button
                  key={b.key}
                  type="button"
                  className={`${styles.btn} ${styles.calcKey} ${
                    primary ? styles.btnPrimary : ''
                  }`}
                  style={op ? {fontWeight: 600} : undefined}
                  onClick={() => press(b)}>
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}
