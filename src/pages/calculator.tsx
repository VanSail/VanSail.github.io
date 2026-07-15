import {useState, useMemo, useEffect, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './serial-monitor.module.css';

type Locale = 'zh' | 'en';
const T = {
  title: {zh: '计算器', en: 'Calculator'},
  desc: {zh: '网页版科学计算器', en: 'Web Scientific Calculator'},
  subtitle: {zh: '支持四则运算、括号与常用科学函数，可键盘输入', en: 'Supports arithmetic, parentheses and common scientific functions, with keyboard input'},
  angleUnit: {zh: '角度单位', en: 'Angle Unit'},
} as const;

// 显示屏符号 → JS 运算符
const DISPLAY_TO_JS: Record<string, string> = {
  '×': '*',
  '−': '-',
  '÷': '/',
};

// 角度制时，正三角函数换算输入，反三角函数换算输出
const fwd =
  (fn: (x: number) => number, deg: boolean) =>
  (x: number) =>
    deg ? fn((x * Math.PI) / 180) : fn(x);
const inv =
  (fn: (number) => number, deg: boolean) =>
  (x: number) =>
    deg ? (fn(x) * 180) / Math.PI : fn(x);

const buildCtx = (deg: boolean) =>
  ({
    sin: fwd(Math.sin, deg),
    cos: fwd(Math.cos, deg),
    tan: fwd(Math.tan, deg),
    asin: inv(Math.asin, deg),
    acos: inv(Math.acos, deg),
    atan: inv(Math.atan, deg),
    ln: Math.log,
    log: Math.log10,
    sqrt: Math.sqrt,
    abs: Math.abs,
    pi: Math.PI,
    e: Math.E,
  }) as Record<string, unknown>;

// 仅允许已知标识符（函数名/常量），杜绝 alert 等任意全局调用
const ALLOWED_IDENTS = [
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'ln', 'log', 'sqrt', 'abs', 'pi', 'e', 'π',
];
const safeEval = (raw: string, deg: boolean): string => {
  if (!raw.trim()) return '';
  let expr = raw;
  Object.keys(DISPLAY_TO_JS).forEach(sym => {
    expr = expr.split(sym).join(DISPLAY_TO_JS[sym]);
  });
  // 先粗筛：仅允许数字/运算符/括号/点/空格/字母/π
  if (!/^[0-9+\-*/().\sπa-zA-Z]+$/.test(expr)) return 'Error';
  // 再精筛：每个标识符必须是白名单中的已知函数/常量
  const idents = expr.match(/[a-zA-Zπ]+/g) || [];
  for (const id of idents) {
    if (!ALLOWED_IDENTS.includes(id)) return 'Error';
  }
  const ctx = buildCtx(deg);
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function(
      ...Object.keys(ctx),
      `"use strict"; return (${expr});`,
    );
    const v = fn(...Object.values(ctx)) as unknown;
    if (typeof v !== 'number' || !isFinite(v)) return 'Error';
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
  span?: boolean;
}

const BUTTONS: BtnSpec[] = [
  {key: 'sin', label: 'sin', insert: 'sin(', kind: 'fn'},
  {key: 'cos', label: 'cos', insert: 'cos(', kind: 'fn'},
  {key: 'tan', label: 'tan', insert: 'tan(', kind: 'fn'},
  {key: 'asin', label: 'sin⁻¹', insert: 'asin(', kind: 'fn'},
  {key: 'acos', label: 'cos⁻¹', insert: 'acos(', kind: 'fn'},
  {key: 'atan', label: 'tan⁻¹', insert: 'atan(', kind: 'fn'},
  {key: '√', label: '√', insert: 'sqrt(', kind: 'fn'},
  {key: 'x²', label: 'x²', insert: '**2', kind: 'fn'},
  {key: 'xʸ', label: 'xʸ', insert: '**(', kind: 'fn'},
  {key: 'π', label: 'π', insert: 'pi', kind: 'fn'},
  {key: 'ln', label: 'ln', insert: 'ln(', kind: 'fn'},
  {key: 'log', label: 'log', insert: 'log(', kind: 'fn'},
  {key: 'e', label: 'e', insert: 'e', kind: 'fn'},
  {key: '1/x', label: '1/x', kind: 'util'},
  {key: '%', label: '%', kind: 'util'},
  {key: 'C', label: 'C', kind: 'clear'},
  {key: '⌫', label: '⌫', kind: 'util'},
  {key: '(', label: '(', insert: '(', kind: 'op'},
  {key: ')', label: ')', insert: ')', kind: 'op'},
  {key: '÷', label: '÷', insert: '÷', kind: 'op'},
  {key: '7', label: '7', insert: '7', kind: 'num'},
  {key: '8', label: '8', insert: '8', kind: 'num'},
  {key: '9', label: '9', insert: '9', kind: 'num'},
  {key: '±', label: '±', kind: 'util'},
  {key: '×', label: '×', insert: '×', kind: 'op'},
  {key: '4', label: '4', insert: '4', kind: 'num'},
  {key: '5', label: '5', insert: '5', kind: 'num'},
  {key: '6', label: '6', insert: '6', kind: 'num'},
  {key: '0', label: '0', insert: '0', kind: 'num'},
  {key: '.', label: '.', insert: '.', kind: 'num'},
  {key: '1', label: '1', insert: '1', kind: 'num'},
  {key: '2', label: '2', insert: '2', kind: 'num'},
  {key: '3', label: '3', insert: '3', kind: 'num'},
  {key: '+', label: '+', insert: '+', kind: 'op'},
  {key: '−', label: '−', insert: '−', kind: 'op'},
  {key: '=', label: '=', kind: 'eq', span: true},
];

export default function Calculator(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: Locale = currentLocale === 'en' ? 'en' : 'zh';
  const [expr, setExpr] = useState('');
  const [deg, setDeg] = useState(false);
  const result = useMemo(() => safeEval(expr, deg), [expr, deg]);

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
      if (b.key === '±') {
        setExpr(p => (p.startsWith('-') ? p.slice(1) : `-${p}`));
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
    <Layout title={T.title[locale]} description={T.desc[locale]}>
      <main className={`${styles.page} ${styles.wide}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{T.title[locale]}</h1>
          <p className={styles.subtitle}>{T.subtitle[locale]}</p>
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
          <div className={styles.calcMode}>
            <span className={styles.modeLabel}>{T.angleUnit[locale]}</span>
            <button
              type="button"
              className={!deg ? styles.modeBtnActive : styles.modeBtn}
              onClick={() => setDeg(false)}>
              RAD
            </button>
            <button
              type="button"
              className={deg ? styles.modeBtnActive : styles.modeBtn}
              onClick={() => setDeg(true)}>
              DEG
            </button>
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
                  style={{
                    ...(op ? {fontWeight: 600} : {}),
                    ...(b.span ? {gridColumn: '1 / -1'} : {}),
                  }}
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
