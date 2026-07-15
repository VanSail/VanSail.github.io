import {useState, useMemo, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './serial-monitor.module.css';

const BASES = [2, 8, 10, 16] as const;

type Locale = 'zh' | 'en';
const T = {
  title: {zh: '进制转换', en: 'Base Converter'},
  desc: {zh: '二进制/八进制/十进制/十六进制互转', en: 'Convert between binary, octal, decimal and hexadecimal'},
  subtitle: {zh: '在二进制、八进制、十进制、十六进制之间实时互转', en: 'Convert in real time between binary, octal, decimal and hexadecimal'},
  invalidChars: {zh: `输入包含非 %BASE% 进制合法字符`, en: `Input contains characters invalid for base %BASE%`},
  notNumber: {zh: '无法解析为有效数字', en: 'Cannot be parsed as a valid number'},
  inputBase: {zh: '输入进制', en: 'Input Base'},
  baseLabel: {zh: '%BASE% 进制', en: 'Base %BASE%'},
  placeholder: {zh: '输入 %BASE% 进制数字', en: 'Enter a base-%BASE% number'},
} as const;

export default function BaseConverter(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: Locale = currentLocale === 'en' ? 'en' : 'zh';
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
      return {results: out, error: T.invalidChars[locale].replace('%BASE%', String(base))};
    }
    const num = parseInt(text, base);
    if (Number.isNaN(num)) {
      return {results: out, error: T.notNumber[locale]};
    }
    BASES.forEach(b => {
      out[b] = b === 10 ? String(num) : num.toString(b).toUpperCase();
    });
    return {results: out, error: ''};
  }, [value, base]);

  return (
    <Layout title={T.title[locale]} description={T.desc[locale]}>
      <main className={`${styles.page} ${styles.wide}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>{T.title[locale]}</h1>
          <p className={styles.subtitle}>{T.subtitle[locale]}</p>
        </div>
        <div className={styles.panel}>
          <div className={styles.toolbar}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="base">
                {T.inputBase[locale]}
              </label>
              <select
                id="base"
                className={styles.select}
                value={base}
                onChange={e => setBase(Number(e.target.value))}>
                {BASES.map(b => (
                  <option key={b} value={b}>
                    {T.baseLabel[locale].replace('%BASE%', String(b))}
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
            placeholder={T.placeholder[locale].replace('%BASE%', String(base))}
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
                <span className={styles.label}>{T.baseLabel[locale].replace('%BASE%', String(b))}</span>
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
