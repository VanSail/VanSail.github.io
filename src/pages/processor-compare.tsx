import {useEffect, useRef, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './processor-compare.module.css';
import {PROCESSORS, type LText, type Processor} from '../data/processors';

// 参数行：严格按用户提供的表格顺序与命名排列。
// 官方页面 / 规格书 / 数据手册属于链接类字段，在规格头部以按钮展示（见 LINK_FIELDS）。
interface FieldDef {
  key: keyof Processor;
  label: LText;
}

const FIELDS: FieldDef[] = [
  {key: 'process', label: {zh: '工艺制程', en: 'Process Node'}},
  {key: 'arch', label: {zh: '中央处理器', en: 'CPU'}},
  {key: 'isa', label: {zh: '指令集架构', en: 'ISA'}},
  {key: 'gpu', label: {zh: '图形处理器', en: 'GPU'}},
  {key: 'mcu', label: {zh: '微处理器', en: 'MCU'}},
  {key: 'tops', label: {zh: 'AI 算力', en: 'AI Compute'}},
  {key: 'memory', label: {zh: '内存', en: 'Memory'}},
  {key: 'storage', label: {zh: '存储', en: 'Storage'}},
  {key: 'codec', label: {zh: '编解码', en: 'Codec'}},
  {key: 'display', label: {zh: '显示输出', en: 'Display Output'}},
  {key: 'videoIn', label: {zh: '视频输入', en: 'Video Input'}},
  {key: 'pcie', label: {zh: 'PCIe', en: 'PCIe'}},
  {key: 'network', label: {zh: '网络', en: 'Network'}},
  {key: 'usb', label: {zh: 'USB', en: 'USB'}},
  {key: 'audio', label: {zh: '音频', en: 'Audio'}},
  {key: 'other', label: {zh: 'GPIO', en: 'GPIO'}},
  {key: 'pkg', label: {zh: '封装', en: 'Package'}},
  {key: 'size', label: {zh: '尺寸', en: 'Dimensions'}},
  {key: 'system', label: {zh: '操作系统', en: 'OS'}},
  {key: 'temp', label: {zh: '工作温度', en: 'Operating Temp'}},
  {key: 'lifecycle', label: {zh: '生命周期', en: 'Lifecycle'}},
];

// 链接类字段：在规格头部以按钮展示。preview=true 走 PDF 预览弹窗，否则新标签打开网页。
interface LinkDef {
  key: keyof Processor;
  label: LText;
  preview: boolean;
}
const LINK_FIELDS: LinkDef[] = [
  {key: 'page', label: {zh: '官方页面', en: 'Official Page'}, preview: false},
  {key: 'brief', label: {zh: '规格书', en: 'Spec Sheet'}, preview: true},
  {key: 'datasheet', label: {zh: '数据手册', en: 'Datasheet'}, preview: true},
];

const meta = {
  title: {zh: '处理器参数', en: 'Processor Parameters'},
  desc: {zh: '处理器参数与对比工具', en: 'Processor specs and compare tool'},
};

export default function ProcessorCompare(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const openPreview = (url: string, title: string) => {
    setPreview(url);
    setPreviewTitle(title);
  };

  const MAX = 3;
  const toggle = (id: string) =>
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  const remove = (id: string) =>
    setSelected(prev => prev.filter(x => x !== id));

  const selectedProcs = PROCESSORS.filter(p => selected.includes(p.id));

  return (
    <Layout title={meta.title[locale]} description={meta.desc[locale]}>
      <main className={styles.page}>
        <div className={styles.hero}>
          <ProcessorMultiPicker
            locale={locale}
            processors={PROCESSORS}
            selected={selected}
            maxReached={selected.length >= MAX}
            onToggle={toggle}
          />

          {selectedProcs.length > 0 && (
            <div className={styles.chips}>
              {selectedProcs.map(p => (
                <span key={p.id} className={styles.chip}>
                  {p.name[locale]}
                  <button
                    type="button"
                    className={styles.chipX}
                    aria-label="移除"
                    onClick={() => remove(p.id)}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {selectedProcs.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                width="40"
                height="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
                <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
                <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
              </svg>
            </span>
            <p className={styles.emptyText}>
              {locale === 'zh'
                ? '从上方选择处理器，查看并对比规格参数'
                : 'Pick a processor above to view and compare specs'}
            </p>
          </div>
        ) : selectedProcs.length === 1 ? (
          <SingleView
            proc={selectedProcs[0]}
            locale={locale}
            onPreview={openPreview}
          />
        ) : (
          <CompareView
            locale={locale}
            procs={selectedProcs}
            onPreview={openPreview}
          />
        )}

        {preview && (
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            onClick={() => setPreview(null)}
          >
            <div
              className={styles.modalInner}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalBar}>
                <span>
                  {previewTitle}
                  {locale === 'zh' ? '预览' : ' Preview'}
                </span>
                <span className={styles.modalActions}>
                  <a
                    href={preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.pdfBtn}
                  >
                    ↗ {locale === 'zh' ? '新标签打开' : 'Open'}
                  </a>
                  <button
                    type="button"
                    className={styles.pdfBtn}
                    onClick={() => setPreview(null)}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </span>
              </div>
              <iframe
                src={preview}
                className={styles.pdfFrame}
                title="datasheet"
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

interface MultiPickerProps {
  locale: 'zh' | 'en';
  processors: Processor[];
  selected: string[];
  maxReached: boolean;
  onToggle: (id: string) => void;
}

function ProcessorMultiPicker({
  locale,
  processors,
  selected,
  maxReached,
  onToggle,
}: MultiPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const list = processors.filter(p =>
    p.name[locale].toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className={styles.picker} ref={ref}>
      <button
        type="button"
        className={styles.pickerBtn}
        onClick={() => setOpen(o => !o)}
      >
        <span className={styles.pickerPlaceholder}>
          {locale === 'zh' ? '选择处理器…' : 'Select processor…'}
        </span>
        <span className={styles.caret}>▾</span>
      </button>
      {open && (
        <div className={styles.pickerMenu}>
          <input
            type="text"
            className={styles.pickerSearch}
            placeholder={locale === 'zh' ? '搜索处理器型号…' : 'Search model…'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <div className={styles.pickerList}>
            {list.length === 0 ? (
              <div className={styles.pickerEmpty}>
                {locale === 'zh' ? '无匹配结果' : 'No match'}
              </div>
            ) : (
              list.map(p => {
                const active = selected.includes(p.id);
                const disabled = !active && maxReached;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={disabled}
                    className={
                      active ? styles.pickerItemActive : styles.pickerItem
                    }
                    onClick={() => onToggle(p.id)}
                  >
                    <span className={styles.pickCheck}>
                      {active ? '✓' : ''}
                    </span>
                    {p.name[locale]}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProcLinksProps {
  proc: Processor;
  locale: 'zh' | 'en';
  onPreview: (url: string, title: string) => void;
}

function ProcLinks({proc, locale, onPreview}: ProcLinksProps) {
  return (
    <>
      {LINK_FIELDS.map(l => {
        const url = proc[l.key] as string | undefined;
        if (!url) return null;
        if (l.preview) {
          return (
            <button
              key={String(l.key)}
              type="button"
              className={styles.pdfBtn}
              onClick={() => onPreview(url, l.label[locale])}
            >
              {l.label[locale]}
            </button>
          );
        }
        return (
          <a
            key={String(l.key)}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pdfBtn}
          >
            {l.label[locale]}
          </a>
        );
      })}
    </>
  );
}

interface SingleProps {
  proc: Processor;
  locale: 'zh' | 'en';
  onPreview: (url: string, title: string) => void;
}

function SingleView({proc, locale, onPreview}: SingleProps) {
  return (
    <div className={styles.single}>
      <div className={styles.specCard}>
        <div className={styles.specHead}>
          <div>
            <h2>{proc.name[locale]}</h2>
          </div>
          <div className={styles.procActions}>
            <ProcLinks proc={proc} locale={locale} onPreview={onPreview} />
          </div>
        </div>
        <dl className={styles.specList}>
          {FIELDS.map(f => {
            const v = proc[f.key] as LText | undefined;
            return (
              <div className={styles.specRow} key={String(f.key)}>
                <dt>{f.label[locale]}</dt>
                <dd className={v ? undefined : styles.muted}>
                  {v ? v[locale] : '—'}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}

interface CompareProps {
  locale: 'zh' | 'en';
  procs: Processor[];
  onPreview: (url: string, title: string) => void;
}

function CompareView({locale, procs, onPreview}: CompareProps) {
  return (
    <div className={styles.compare}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.fieldCol}>
                {locale === 'zh' ? '处理器型号' : 'Processor'}
              </th>
              {procs.map(p => (
                <th key={p.id} className={styles.procCol}>
                  <div className={styles.procHead}>{p.name[locale]}</div>
                  <div className={styles.procActions}>
                    <ProcLinks proc={p} locale={locale} onPreview={onPreview} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FIELDS.map(f => {
              const vals = procs.map(p => {
                const v = p[f.key] as LText | undefined;
                return v ? v[locale] : '—';
              });
              const differs = new Set(vals).size > 1;
              return (
                <tr
                  key={String(f.key)}
                  className={differs ? styles.diffRow : undefined}
                >
                  <th scope="row" className={styles.fieldCol}>
                    {f.label[locale]}
                  </th>
                  {procs.map(p => {
                    const v = p[f.key] as LText | undefined;
                    const text = v ? v[locale] : '—';
                    return (
                      <td
                        key={p.id}
                        className={text === '—' ? styles.muted : undefined}
                      >
                        {text}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className={styles.diffNote}>
          <span className={styles.diffSwatch} />
          {locale === 'zh'
            ? '高亮行表示所选处理器的该参数取值不同。'
            : 'Highlighted rows differ across the selected processors.'}
        </p>
      </div>
    </div>
  );
}
