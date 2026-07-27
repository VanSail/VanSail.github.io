import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './processor-compare.module.css';
import {PROCESSORS, type Processor, type CategoryId} from '../data/processors';

interface LText {
  zh: string;
  en: string;
}

type GroupId = 'compute' | 'graphics' | 'media' | 'io' | 'system';

// 字段按 group 顺序排列（章节标题已移除，group 仅用于排序）
const GROUP_ORDER: GroupId[] = ['compute', 'graphics', 'media', 'io', 'system'];

interface FieldDef {
  key: keyof Processor;
  label: LText;
  group: GroupId;
}

// 各分类的对比字段（参数表的行），按 group 归入规范章节
const FIELDS_BY_CATEGORY: Record<CategoryId, FieldDef[]> = {
  ai: [
    {key: 'vendor', label: {zh: '厂商', en: 'Vendor'}, group: 'compute'},
    {key: 'arch', label: {zh: '架构', en: 'Architecture'}, group: 'compute'},
    {key: 'process', label: {zh: '制程', en: 'Process'}, group: 'compute'},
    {key: 'memory', label: {zh: '内存', en: 'Memory'}, group: 'compute'},
    {
      key: 'tops',
      label: {zh: 'AI / 神经网络处理器', en: 'AI / NPU'},
      group: 'graphics',
    },
    {key: 'year', label: {zh: '发布年份', en: 'Released'}, group: 'system'},
  ],
  soc: [
    {key: 'vendor', label: {zh: '厂商', en: 'Vendor'}, group: 'compute'},
    {key: 'process', label: {zh: '制程', en: 'Process'}, group: 'compute'},
    {key: 'arch', label: {zh: '中央处理器', en: 'CPU'}, group: 'compute'},
    {key: 'memory', label: {zh: '内存', en: 'Memory'}, group: 'compute'},
    {key: 'gpu', label: {zh: '图形处理器', en: 'GPU'}, group: 'graphics'},
    {
      key: 'tops',
      label: {zh: 'AI / 神经网络处理器', en: 'AI / NPU'},
      group: 'graphics',
    },
    {key: 'mcu', label: {zh: '微控制器', en: 'MCU'}, group: 'graphics'},
    {key: 'codec', label: {zh: '编解码', en: 'Codec'}, group: 'media'},
    {key: 'videoIn', label: {zh: '摄像头', en: 'Camera'}, group: 'media'},
    {key: 'display', label: {zh: '显示', en: 'Display'}, group: 'media'},
    {key: 'audio', label: {zh: '音频', en: 'Audio'}, group: 'media'},
    {key: 'storage', label: {zh: '存储', en: 'Storage'}, group: 'media'},
    {key: 'pcie', label: {zh: 'PCIe', en: 'PCIe'}, group: 'io'},
    {key: 'usb', label: {zh: 'USB', en: 'USB'}, group: 'io'},
    {key: 'network', label: {zh: '有线网络', en: 'Wired Net'}, group: 'io'},
    {key: 'wireless', label: {zh: '无线连接', en: 'Wireless'}, group: 'io'},
    {key: 'security', label: {zh: '安全', en: 'Security'}, group: 'io'},
    {key: 'other', label: {zh: '其他', en: 'Other'}, group: 'io'},
    {key: 'system', label: {zh: '系统', en: 'OS'}, group: 'system'},
    {key: 'year', label: {zh: '发布年份', en: 'Released'}, group: 'system'},
  ],
};

// 按 GROUP_ORDER 顺序返回字段
function groupFields(fields: FieldDef[]): FieldDef[] {
  return GROUP_ORDER.flatMap(g => fields.filter(f => f.group === g));
}

const meta = {
  title: {zh: '处理器参数', en: 'Processor Parameters'},
  desc: {zh: '处理器参数与对比工具', en: 'Processor specs and compare tool'},
};

type Mode = 'home' | 'single' | 'compare';

export default function ProcessorCompare(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  const [mode, setMode] = useState<Mode>('home');
  const [singleId, setSingleId] = useState<string | null>(null);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const openPreview = (url: string, title: string) => {
    setPreview(url);
    setPreviewTitle(title);
  };

  const getProc = (id: string | null) =>
    id ? (PROCESSORS.find(p => p.id === id) ?? null) : null;

  const goHome = () => setMode('home');

  return (
    <Layout title={meta.title[locale]} description={meta.desc[locale]}>
      <main className={styles.page}>
        {mode !== 'home' && (
          <button type="button" className={styles.back} onClick={goHome}>
            ← {locale === 'zh' ? '返回' : 'Back'}
          </button>
        )}

        {mode === 'home' && (
          <div className={styles.home}>
            <button
              type="button"
              className={styles.modeCard}
              onClick={() => setMode('single')}
            >
              <span className={styles.modeIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4" y="3" width="16" height="18" rx="2" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="13" y2="16" />
                </svg>
              </span>
              <span className={styles.modeTitle}>
                {locale === 'zh' ? '处理器参数' : 'Processor Specs'}
              </span>
              <span className={styles.modeSub}>
                {locale === 'zh'
                  ? '查看单个处理器的详细规格'
                  : 'View a single processor in detail'}
              </span>
            </button>

            <button
              type="button"
              className={styles.modeCard}
              onClick={() => setMode('compare')}
            >
              <span className={styles.modeIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="7" height="16" rx="1" />
                  <rect x="14" y="4" width="7" height="16" rx="1" />
                </svg>
              </span>
              <span className={styles.modeTitle}>
                {locale === 'zh' ? '对比' : 'Compare'}
              </span>
              <span className={styles.modeSub}>
                {locale === 'zh'
                  ? '选择两个处理器横向对比'
                  : 'Compare two processors side by side'}
              </span>
            </button>
          </div>
        )}

        {mode === 'single' && (
          <SingleView
            locale={locale}
            processors={PROCESSORS}
            value={singleId}
            onChange={setSingleId}
            onPreview={openPreview}
          />
        )}

        {mode === 'compare' && (
          <CompareView
            locale={locale}
            processors={PROCESSORS}
            valueA={compareA}
            valueB={compareB}
            onChangeA={setCompareA}
            onChangeB={setCompareB}
            onPreview={openPreview}
            getProc={getProc}
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

interface PickerProps {
  locale: 'zh' | 'en';
  processors: Processor[];
  value: string | null;
  onChange: (id: string) => void;
  exclude?: string | null;
  placeholder: string;
}

function ProcessorPicker({
  locale,
  processors,
  value,
  onChange,
  exclude,
  placeholder,
}: PickerProps) {
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

  const selected = value
    ? (processors.find(p => p.id === value) ?? null)
    : null;

  const list = processors
    .filter(p => p.id !== exclude)
    .filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className={styles.picker} ref={ref}>
      <button
        type="button"
        className={styles.pickerBtn}
        onClick={() => setOpen(o => !o)}
      >
        <span
          className={selected ? styles.pickerVal : styles.pickerPlaceholder}
        >
          {selected ? selected.name : placeholder}
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
              list.map(p => (
                <button
                  key={p.id}
                  type="button"
                  className={
                    p.id === value ? styles.pickerItemActive : styles.pickerItem
                  }
                  onClick={() => {
                    onChange(p.id);
                    setOpen(false);
                    setQuery('');
                  }}
                >
                  {p.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface SingleProps {
  locale: 'zh' | 'en';
  processors: Processor[];
  value: string | null;
  onChange: (id: string) => void;
  onPreview: (url: string, title: string) => void;
}

function SingleView({
  locale,
  processors,
  value,
  onChange,
  onPreview,
}: SingleProps) {
  const proc = value ? (processors.find(p => p.id === value) ?? null) : null;
  const fields = proc ? FIELDS_BY_CATEGORY[proc.category] : [];

  return (
    <div className={styles.single}>
      <ProcessorPicker
        locale={locale}
        processors={processors}
        value={value}
        onChange={onChange}
        placeholder={locale === 'zh' ? '选择处理器' : 'Select a processor'}
      />
      {!proc ? (
        <p className={styles.empty}>
          {locale === 'zh'
            ? '请选择上方处理器查看参数。'
            : 'Pick a processor above to see its specs.'}
        </p>
      ) : (
        <div className={styles.specCard}>
          <div className={styles.specHead}>
            <div>
              <h2>{proc.name}</h2>
            </div>
            <div className={styles.procActions}>
              {proc.brief && (
                <button
                  type="button"
                  className={styles.pdfBtn}
                  onClick={() =>
                    onPreview(
                      proc.brief!,
                      locale === 'zh' ? '规格书' : 'Spec Sheet',
                    )
                  }
                >
                  {locale === 'zh' ? '规格书' : 'Spec Sheet'}
                </button>
              )}
              {proc.datasheet && (
                <button
                  type="button"
                  className={styles.pdfBtn}
                  onClick={() =>
                    onPreview(
                      proc.datasheet!,
                      locale === 'zh' ? '数据手册' : 'Datasheet',
                    )
                  }
                >
                  {locale === 'zh' ? '数据手册' : 'Datasheet'}
                </button>
              )}
            </div>
          </div>
          <dl className={styles.specList}>
            {groupFields(fields).map(f => {
              const v = proc[f.key] as string | undefined;
              return (
                <div className={styles.specRow} key={String(f.key)}>
                  <dt>{f.label[locale]}</dt>
                  <dd className={v ? undefined : styles.muted}>{v || '—'}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}
    </div>
  );
}

interface CompareProps {
  locale: 'zh' | 'en';
  processors: Processor[];
  valueA: string | null;
  valueB: string | null;
  onChangeA: (id: string) => void;
  onChangeB: (id: string) => void;
  onPreview: (url: string, title: string) => void;
  getProc: (id: string | null) => Processor | null;
}

function CompareView({
  locale,
  processors,
  valueA,
  valueB,
  onChangeA,
  onChangeB,
  onPreview,
  getProc,
}: CompareProps) {
  const procA = getProc(valueA);
  const procB = getProc(valueB);

  const fields = useMemo(() => {
    if (!procA || !procB) return [];
    const fa = FIELDS_BY_CATEGORY[procA.category];
    const fb = FIELDS_BY_CATEGORY[procB.category];
    const seen = new Set(fa.map(f => String(f.key)));
    return [...fa, ...fb.filter(f => !seen.has(String(f.key)))];
  }, [procA, procB]);

  return (
    <div className={styles.compare}>
      <div className={styles.slots}>
        <ProcessorPicker
          locale={locale}
          processors={processors}
          value={valueA}
          onChange={onChangeA}
          exclude={valueB}
          placeholder={locale === 'zh' ? '选择处理器 A' : 'Select processor A'}
        />
        <span className={styles.vs}>{locale === 'zh' ? '对比' : 'vs'}</span>
        <ProcessorPicker
          locale={locale}
          processors={processors}
          value={valueB}
          onChange={onChangeB}
          exclude={valueA}
          placeholder={locale === 'zh' ? '选择处理器 B' : 'Select processor B'}
        />
      </div>

      {!procA || !procB ? (
        <p className={styles.empty}>
          {locale === 'zh'
            ? '请选择两个处理器进行参数对比。'
            : 'Pick two processors to compare.'}
        </p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.fieldCol}>
                  {locale === 'zh' ? '处理器型号' : 'Processor'}
                </th>
                {[procA, procB].map(p => (
                  <th key={p.id} className={styles.procCol}>
                    <div className={styles.procHead}>{p.name}</div>
                    <div className={styles.procActions}>
                      {p.brief && (
                        <button
                          type="button"
                          className={styles.pdfBtn}
                          onClick={() =>
                            onPreview(
                              p.brief!,
                              locale === 'zh' ? '规格书' : 'Spec Sheet',
                            )
                          }
                        >
                          {locale === 'zh' ? '规格书' : 'Spec Sheet'}
                        </button>
                      )}
                      {p.datasheet && (
                        <button
                          type="button"
                          className={styles.pdfBtn}
                          onClick={() =>
                            onPreview(
                              p.datasheet!,
                              locale === 'zh' ? '数据手册' : 'Datasheet',
                            )
                          }
                        >
                          {locale === 'zh' ? '数据手册' : 'Datasheet'}
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groupFields(fields).map(f => {
                const va = procA[f.key] as string | undefined;
                const vb = procB[f.key] as string | undefined;
                const diff = va != null && vb != null && va !== vb;
                return (
                  <tr
                    key={String(f.key)}
                    className={diff ? styles.diffRow : undefined}
                  >
                    <th scope="row" className={styles.fieldCol}>
                      {f.label[locale]}
                    </th>
                    <td className={va ? undefined : styles.muted}>
                      {(procA[f.key] as string) || '—'}
                    </td>
                    <td className={vb ? undefined : styles.muted}>
                      {(procB[f.key] as string) || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className={styles.diffNote}>
            <span className={styles.diffSwatch} />
            {locale === 'zh'
              ? '高亮行表示两款处理器的该参数取值不同。'
              : 'Highlighted rows differ between the two processors.'}
          </p>
        </div>
      )}
    </div>
  );
}
