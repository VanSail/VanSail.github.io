import {useRef, useState, type ReactNode} from 'react';
import * as XLSX from 'xlsx';

import {
  parseToTable,
  serializeFromTable,
  type Table,
  type Align,
} from './converter';
import EditableGrid, {type GridHandle} from './EditableGrid';
import styles from './TableConverter.module.css';

type Locale = 'zh' | 'en';

/* ----------------------- 表格变换（Markdown 工具用） ----------------------- */

function removeEmptyRows(t: Table): Table {
  return t.filter(r => r.some(c => (c ?? '').trim().length > 0));
}

function trimCells(t: Table): Table {
  return t.map(r => r.map(c => (c ?? '').trim()));
}

function addIndexColumn(t: Table): Table {
  if (!t.length) return t;
  return t.map((r, i) => [i === 0 ? '#' : String(i), ...r]);
}

const EXAMPLE_MARKDOWN = `| 项目 | 负责人 | 状态 | 进度 |
| --- | --- | --- | --- |
| 需求评审 | 张三 | 进行中 | 80% |
| 接口开发 | 李四 | 已完成 | 100% |
| 上线部署 | 王五 | 待开始 | 0% |
`;

const T = {
  title: {zh: '格式转换', en: 'Format Converter'},
  subtitle: {
    zh: '在浏览器本地实时互转、双向编辑 Markdown 与 Excel 表格',
    en: 'Real-time, two-way conversion and editing between Markdown and Excel — all in your browser',
  },
  tags: {
    zh: [
      '实时转换',
      '双向同步',
      '可编辑网格',
      '插入行列',
      '撤销',
      '粘贴 Excel',
      '本地隐私',
      '导出 xlsx',
    ],
    en: [
      'Real-time',
      'Two-way sync',
      'Editable grid',
      'Insert rows/cols',
      'Undo',
      'Paste Excel',
      'Local & private',
      'Export xlsx',
    ],
  },
  md: {zh: 'Markdown', en: 'Markdown'},
  excel: {zh: 'Excel', en: 'Excel'},
  copy: {zh: '复制 Markdown', en: 'Copy Markdown'},
  copied: {zh: '已复制', en: 'Copied'},
  download: {zh: '下载 .xlsx', en: 'Download .xlsx'},
  privacy: {
    zh: '所有解析与转换均在本地浏览器进行，刷新页面即清除，不会留存任何数据。',
    en: 'All parsing and conversion happen locally in your browser and are cleared on refresh — nothing is stored.',
  },
  parseError: {zh: '解析失败：', en: 'Parse error: '},
} as const;

const M = {
  beautify: {zh: '美化对齐', en: 'Beautify'},
  removeEmpty: {zh: '删除空行', en: 'Remove blanks'},
  trim: {zh: '去空格', en: 'Trim'},
  addIndex: {zh: '加序号', en: 'Add #'},
  example: {zh: '示例', en: 'Example'},
  clear: {zh: '清空', en: 'Clear'},
} as const;

const G = {
  undo: {zh: '撤销', en: 'Undo'},
  insRowUp: {zh: '上插', en: 'Row ↑'},
  insRowDown: {zh: '下插', en: 'Row ↓'},
  delRow: {zh: '删行', en: 'Del Row'},
  insColLeft: {zh: '左插', en: 'Col ←'},
  insColRight: {zh: '右插', en: 'Col →'},
  delCol: {zh: '删列', en: 'Del Col'},
  clear: {zh: '清空', en: 'Clear'},
  rows: {zh: '行', en: 'rows'},
  cols: {zh: '列', en: 'cols'},
} as const;

const mdIcon = (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16v16H4z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

const excelIcon = (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

export default function TableConverter({locale}: {locale: Locale}): ReactNode {
  const [mdText, setMdText] = useState<string>('');
  const [table, setTable] = useState<Table>(() => parseToTable('').table);
  const [aligns, setAligns] = useState<Align[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [canUndo, setCanUndo] = useState(false);
  const gridRef = useRef<GridHandle>(null);

  const rowsCount = table.length;
  const colsCount = table.reduce((m, r) => Math.max(m, r.length), 0);

  // 实时双向同步：编辑 Markdown → 解析为表格，并同步到 Excel 网格
  function onMdChange(v: string) {
    setMdText(v);
    const p = parseToTable(v);
    setError(p.error);
    setTable(p.table);
    setAligns(p.aligns);
    gridRef.current?.loadTable(p.table, p.aligns);
  }

  // 编辑表格 → 序列化回 Markdown（保留当前对齐设置）
  function onGridChange(t: Table, a: Align[] = aligns) {
    setTable(t);
    setAligns(a);
    setMdText(serializeFromTable(t, a));
  }

  // Markdown 工具：对表格做变换并同步回两侧
  function applyTable(next: Table) {
    onGridChange(next);
  }

  const mdBeautify = () => applyTable(table);
  const mdRemoveEmpty = () => applyTable(removeEmptyRows(table));
  const mdTrim = () => applyTable(trimCells(table));
  const mdAddIndex = () => applyTable(addIndexColumn(table));
  const mdExample = () => onMdChange(EXAMPLE_MARKDOWN);
  const mdClear = () => onMdChange('');

  async function copyMarkdown() {
    try {
      await navigator.clipboard?.writeText(mdText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  function downloadExcel() {
    if (!table.length) return;
    const ws = XLSX.utils.aoa_to_sheet(table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'table.xlsx');
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{T.title[locale]}</h1>
        <div className={styles.tags}>
          {T.tags[locale].map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className={styles.subtitle}>{T.subtitle[locale]}</p>
      </header>

      <section className={styles.panel}>
        <div className={styles.split}>
          {/* 左：Markdown 源文本（实时） */}
          <div className={`${styles.card} ${styles.cardMd}`}>
            <div className={styles.cardHead}>
              <span className={styles.badge}>
                <span className={styles.badgeIcon}>{mdIcon}</span>
                {T.md[locale]}
              </span>
            </div>
            <textarea
              className={styles.textarea}
              value={mdText}
              spellCheck={false}
              onChange={e => onMdChange(e.target.value)}
            />
            <div className={styles.cardTools}>
              <span className={styles.gridBtns}>
                <button
                  className={styles.miniBtn}
                  onClick={mdBeautify}
                  type="button"
                >
                  {M.beautify[locale]}
                </button>
                <button
                  className={styles.miniBtn}
                  onClick={mdRemoveEmpty}
                  type="button"
                >
                  {M.removeEmpty[locale]}
                </button>
                <button
                  className={styles.miniBtn}
                  onClick={mdTrim}
                  type="button"
                >
                  {M.trim[locale]}
                </button>
                <button
                  className={styles.miniBtn}
                  onClick={mdAddIndex}
                  type="button"
                >
                  {M.addIndex[locale]}
                </button>
                <span className={styles.btnSep} />
                <button
                  className={styles.miniBtn}
                  onClick={mdExample}
                  type="button"
                >
                  {M.example[locale]}
                </button>
                <button
                  className={styles.miniBtn}
                  onClick={mdClear}
                  type="button"
                >
                  {M.clear[locale]}
                </button>
              </span>
            </div>
          </div>

          {/* 右：Excel 可编辑网格（实时） */}
          <div className={`${styles.card} ${styles.cardXl}`}>
            <div className={styles.cardHead}>
              <span className={styles.badge}>
                <span className={styles.badgeIcon}>{excelIcon}</span>
                {T.excel[locale]}
              </span>
            </div>
            <EditableGrid
              ref={gridRef}
              table={table}
              onChange={onGridChange}
              locale={locale}
              aligns={aligns}
              onCanUndoChange={setCanUndo}
            />
            <div className={styles.cardTools}>
              <span className={styles.gridBtns}>
                <button
                  className={styles.miniBtn}
                  onClick={() => gridRef.current?.undo()}
                  disabled={!canUndo}
                  type="button"
                >
                  ↶ {G.undo[locale]}
                </button>
                <span className={styles.btnSep} />
                <button
                  className={styles.miniBtn}
                  onClick={() => gridRef.current?.clearAll()}
                  type="button"
                >
                  {G.clear[locale]}
                </button>
                <span className={styles.gridStats}>
                  {rowsCount} {G.rows[locale]} · {colsCount} {G.cols[locale]}
                </span>
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {T.parseError[locale]}
            {error}
          </div>
        )}

        {/* 底部操作 */}
        <div className={styles.bottomBar}>
          <button
            className={styles.btnPrimary}
            onClick={downloadExcel}
            type="button"
          >
            ⬇ {T.download[locale]}
          </button>
          <button
            className={styles.btnGhost}
            onClick={copyMarkdown}
            type="button"
          >
            {copied ? T.copied[locale] : T.copy[locale]}
          </button>
        </div>

        <p className={styles.note}>{T.privacy[locale]}</p>
      </section>
    </main>
  );
}
