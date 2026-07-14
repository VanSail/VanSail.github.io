import {useState, useMemo, type ReactNode} from 'react';
import Layout from '@theme/Layout';

import styles from './serial-monitor.module.css';

const BASES = [2, 8, 10, 16] as const;

export default function BaseConverter(): ReactNode {
  const [value, setValue] = useState('');
  const [base, setBase] = useState<number>(10);

  const {results, error} = useMemo(() => {
    const out: Record<number, string> = {};
    BASES.forEach(b => {
      out[b] = '';
    });
    const text = value.trim();
    if (!text) return {results: out, error: ''};
    const pattern =
      base === 16
        ? /^[0-9a-fA-F]+$/
        : base === 10
          ? /^[0-9]+$/
          : base === 8
            ? /^[0-7]+$/
            : /^[01]+$/;
    if (!pattern.test(text)) {
      return {results: out, error: `输入包含非 ${base} 进制合法字符`};
    }
    const num = parseInt(text, base);
    if (Number.isNaN(num)) {
      return {results: out, error: '无法解析为有效数字'};
    }
    BASES.forEach(b => {
      out[b] = b === 10 ? String(num) : num.toString(b).toUpperCase();
    });
    return {results: out, error: ''};
  }, [value, base]);

  return (
    <Layout title="进制转换" description="二进制/八进制/十进制/十六进制互转">
      <main className={`${styles.page} ${styles.wide}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>进制转换</h1>
          <p className={styles.subtitle}>在二进制、八进制、十进制、十六进制之间实时互转</p>
        </div>
        <div className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="base">
                输入进制
              </label>
              <select
                id="base"
                className={styles.select}
                value={base}
                onChange={e => setBase(Number(e.target.value))}>
                {BASES.map(b => (
                  <option key={b} value={b}>
                    {b} 进制
                  </option>
                ))}
              </select>
            </div>
          </div>
          <input
            className={styles.input}
            style={{
              marginTop: 12,
              fontFamily: "'SF Mono','Fira Code',Menlo,Monaco,monospace",
              fontSize: 18,
            }}
            value={value}
            placeholder={`输入 ${base} 进制数字`}
            onChange={e => setValue(e.target.value)}
          />
          <div className={styles.error}>{error}</div>
          <div style={{marginTop: 16, display: 'grid', gap: 10}}>
            {BASES.map(b => (
              <div
                key={b}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid var(--ifm-hr-border-color)',
                  paddingBottom: 8,
                }}>
                <span className={styles.label}>{b} 进制</span>
                <span
                  style={{
                    fontFamily: "'SF Mono','Fira Code',Menlo,Monaco,monospace",
                    fontSize: 15,
                  }}>
                  {results[b] || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
