import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {type Table, type Align} from './converter';
import styles from './TableConverter.module.css';

type Locale = 'zh' | 'en';

// Excel 风格列名：0->A, 25->Z, 26->AA ...
function colName(c: number): string {
  let s = '';
  let n = c + 1;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// 控件文案（与父组件保持一致的双语）
const L = {
  left: {zh: '左', en: 'Left'},
  center: {zh: '居中', en: 'Center'},
  right: {zh: '右', en: 'Right'},
  insColLeft: {zh: '左插', en: 'Ins ←'},
  insColRight: {zh: '右插', en: 'Ins →'},
  delCol: {zh: '删列', en: 'Del Col'},
  insRowUp: {zh: '上插', en: 'Ins ↑'},
  insRowDown: {zh: '下插', en: 'Ins ↓'},
  delRow: {zh: '删行', en: 'Del Row'},
  col: {zh: '列', en: 'Col'},
  row: {zh: '行', en: 'Row'},
} as const;

interface Snapshot {
  table: Table;
  aligns: Align[];
}

export interface GridHandle {
  undo: () => void;
  clearAll: () => void;
  loadTable: (t: Table, a: Align[]) => void;
}

interface Props {
  table: Table;
  aligns: Align[];
  onChange: (t: Table, a: Align[]) => void;
  locale: Locale;
  onCanUndoChange?: (canUndo: boolean) => void;
}

const EditableGrid = forwardRef<GridHandle, Props>(function EditableGrid(
  {table, aligns, onChange, locale, onCanUndoChange},
  ref,
): ReactNode {
  const [history, setHistory] = useState<Snapshot[]>([{table, aligns}]);
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  idxRef.current = idx;
  const snap = history[idx] ?? {table: [], aligns: []};
  const tableCurrent = snap.table;
  const alignsCurrent = snap.aligns;
  const tableRef = useRef<Table>(tableCurrent);
  tableRef.current = tableCurrent;
  const alignsRef = useRef<Align[]>(alignsCurrent);
  alignsRef.current = alignsCurrent;

  // 外部受控：当来自另一侧的修改（如编辑 Markdown）到达时，同步到内部状态
  useEffect(() => {
    if (
      JSON.stringify(table) !== JSON.stringify(tableRef.current) ||
      JSON.stringify(aligns) !== JSON.stringify(alignsRef.current)
    ) {
      setHistory([{table, aligns}]);
      setIdx(0);
      setActive(null);
      setSelCol(null);
      setSelRow(null);
    }
  }, [table, aligns]);

  const [active, setActive] = useState<{r: number; c: number} | null>(null);
  const cellRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  // 选中单元格变化时聚焦对应输入框
  useEffect(() => {
    if (!active) return;
    cellRefs.current.get(`${active.r},${active.c}`)?.focus();
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const [selCol, setSelCol] = useState<number | null>(null);
  const [selRow, setSelRow] = useState<number | null>(null);

  const rowsCount = tableCurrent.length;
  const colsCount = tableCurrent.reduce((m, r) => Math.max(m, r.length), 0);

  function commit(nextTable: Table, nextAligns: Align[] = alignsCurrent) {
    setHistory(h => [
      ...h.slice(0, idxRef.current + 1),
      {table: nextTable, aligns: nextAligns},
    ]);
    setIdx(idxRef.current + 1);
    onChange(nextTable, nextAligns);
  }

  function undo() {
    if (idx > 0) {
      const ni = idx - 1;
      setIdx(ni);
      setActive(null);
      setSelCol(null);
      setSelRow(null);
      onChange(history[ni].table, history[ni].aligns);
    }
  }

  function updateCell(r: number, c: number, v: string) {
    commit(
      tableCurrent.map((row, ri) =>
        ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row,
      ),
    );
  }

  function insertRow(at: number) {
    const cols = Math.max(
      1,
      tableCurrent.reduce((m, r) => Math.max(m, r.length), 0),
    );
    const row = Array.from({length: cols}, () => '');
    commit([...tableCurrent.slice(0, at), row, ...tableCurrent.slice(at)]);
  }

  function insertCol(at: number) {
    const nextAligns = alignsCurrent.slice();
    nextAligns.splice(at, 0, 'none');
    commit(
      tableCurrent.map(r => [...r.slice(0, at), '', ...r.slice(at)]),
      nextAligns,
    );
  }

  function deleteRow(at: number) {
    if (tableCurrent.length > 1)
      commit(tableCurrent.filter((_, i) => i !== at));
  }

  function deleteCol(at: number) {
    if (tableCurrent.length > 0 && tableCurrent[0].length > 1) {
      const nextAligns = alignsCurrent.slice();
      nextAligns.splice(at, 1);
      commit(
        tableCurrent.map(r => r.filter((_, i) => i !== at)),
        nextAligns,
      );
    }
  }

  function setColAlign(c: number, a: Align) {
    const next = alignsCurrent.slice();
    while (next.length < colsCount) next.push('none');
    next[c] = a;
    commit(tableCurrent, next);
  }

  function clearAll() {
    commit([['']], []);
    setActive(null);
    setSelCol(null);
    setSelRow(null);
  }

  function registerRef(el: HTMLInputElement | null, r: number, c: number) {
    const key = `${r},${c}`;
    if (el) cellRefs.current.set(key, el);
    else cellRefs.current.delete(key);
  }

  function onCellPaste(
    e: ClipboardEvent<HTMLInputElement>,
    r: number,
    c: number,
  ) {
    const text = e.clipboardData.getData('text');
    // 仅当含有制表符或换行（即多单元格区域）时才拦截，否则走默认单格粘贴
    if (!text.includes('\t') && !text.includes('\n')) return;
    e.preventDefault();
    const rawLines = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n');
    if (rawLines.length && rawLines[rawLines.length - 1] === '') rawLines.pop();
    const pasted = rawLines.map(line => line.split('\t'));
    const rows = pasted.length;
    const cols = pasted.reduce((m, row) => Math.max(m, row.length), 0);
    const norm = pasted.map(row =>
      Array.from({length: cols}, (_, i) => row[i] ?? ''),
    );
    const newRows = Math.max(tableCurrent.length, r + rows);
    const newCols = Math.max(colsCount, c + cols);
    const out: Table = Array.from({length: newRows}, () =>
      Array.from({length: newCols}, () => ''),
    );
    for (let rr = 0; rr < tableCurrent.length; rr++) {
      const row = tableCurrent[rr] ?? [];
      for (let cc = 0; cc < row.length; cc++) out[rr][cc] = row[cc];
    }
    for (let pr = 0; pr < rows; pr++) {
      for (let pc = 0; pc < cols; pc++) out[r + pr][c + pc] = norm[pr][pc];
    }
    commit(out);
    setActive({r: r + rows - 1, c: c + cols - 1});
  }

  function onCellKey(e: KeyboardEvent<HTMLInputElement>, r: number, c: number) {
    const input = e.currentTarget;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setActive({r: Math.max(0, r - 1), c});
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActive({r: Math.min(rowsCount - 1, r + 1), c});
        break;
      case 'ArrowLeft':
        if (input.selectionStart === 0 && input.selectionEnd === 0) {
          e.preventDefault();
          setActive({r, c: Math.max(0, c - 1)});
        }
        break;
      case 'ArrowRight':
        if (input.selectionStart === input.value.length) {
          e.preventDefault();
          setActive({r, c: Math.min(colsCount - 1, c + 1)});
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          if (c > 0) setActive({r, c: c - 1});
          else if (r > 0) setActive({r: r - 1, c: colsCount - 1});
        } else if (c < colsCount - 1) {
          setActive({r, c: c + 1});
        } else if (r < rowsCount - 1) {
          setActive({r: r + 1, c: 0});
        }
        break;
      case 'Enter':
        e.preventDefault();
        setActive({r: Math.min(rowsCount - 1, r + 1), c});
        break;
    }
  }

  // 按列对齐（反映 Markdown 的对齐设置）
  function alignOfCol(i: number): 'left' | 'center' | 'right' {
    const a = alignsCurrent[i] ?? 'none';
    if (a === 'center') return 'center';
    if (a === 'right') return 'right';
    return 'left';
  }

  useImperativeHandle(
    ref,
    () => ({
      undo,
      clearAll,
      loadTable: (t: Table, a: Align[]) => {
        setHistory([{table: t, aligns: a}]);
        setIdx(0);
        setActive(null);
        setSelCol(null);
        setSelRow(null);
      },
    }),
    [],
  );

  useEffect(() => {
    onCanUndoChange?.(idx > 0);
  }, [idx, onCanUndoChange]);

  return (
    <div className={styles.gridWrap}>
      <div className={styles.previewScroll}>
        <table className={styles.table}>
          <thead>
            {/* 列号行 */}
            <tr>
              <th className={styles.cornerTh} />
              {Array.from({length: colsCount}).map((_, i) => (
                <th
                  key={i}
                  className={`${styles.colHead} ${selCol === i ? styles.headActive : ''}`}
                  onClick={() => setSelCol(selCol === i ? null : i)}
                  title={colName(i)}
                >
                  {colName(i)}
                </th>
              ))}
            </tr>
            {/* 列名行（表格表头） */}
            <tr>
              <th className={styles.headGutter} />
              {Array.from({length: colsCount}).map((_, i) => (
                <th
                  key={i}
                  className={
                    active?.r === 0 && active?.c === i ? styles.cellActive : ''
                  }
                >
                  <input
                    className={styles.cellInput}
                    style={{textAlign: alignOfCol(i)}}
                    value={tableCurrent[0]?.[i] ?? ''}
                    onChange={e => updateCell(0, i, e.target.value)}
                    onFocus={() => setActive({r: 0, c: i})}
                    onKeyDown={e => onCellKey(e, 0, i)}
                    onPaste={e => onCellPaste(e, 0, i)}
                    ref={el => registerRef(el, 0, i)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableCurrent.slice(1).map((r, ri) => {
              const rr = ri + 1;
              return (
                <tr key={ri}>
                  <th
                    className={`${styles.rowHead} ${selRow === ri ? styles.headActive : ''}`}
                    onClick={() => setSelRow(selRow === ri ? null : ri)}
                  >
                    {rr}
                  </th>
                  {Array.from({length: colsCount}).map((_, ci) => (
                    <td
                      key={ci}
                      className={
                        active?.r === rr && active?.c === ci
                          ? styles.cellActive
                          : ''
                      }
                    >
                      <input
                        className={styles.cellInput}
                        style={{textAlign: alignOfCol(ci)}}
                        value={r[ci] ?? ''}
                        onChange={e => updateCell(rr, ci, e.target.value)}
                        onFocus={() => setActive({r: rr, c: ci})}
                        onKeyDown={e => onCellKey(e, rr, ci)}
                        onPaste={e => onCellPaste(e, rr, ci)}
                        ref={el => registerRef(el, rr, ci)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 选中列 / 行后的操作条 */}
      {selCol !== null && (
        <div className={styles.selBar}>
          <span className={styles.selLabel}>
            {L.col[locale]} {colName(selCol)}
          </span>
          {(['left', 'center', 'right'] as const).map(a => (
            <button
              key={a}
              className={`${styles.miniBtn} ${alignsCurrent[selCol] === a ? styles.alignOn : ''}`}
              onClick={() => setColAlign(selCol, a)}
              type="button"
            >
              {L[a][locale]}
            </button>
          ))}
          <span className={styles.btnSep} />
          <button
            className={styles.miniBtn}
            onClick={() => insertCol(selCol)}
            type="button"
          >
            {L.insColLeft[locale]}
          </button>
          <button
            className={styles.miniBtn}
            onClick={() => insertCol(selCol + 1)}
            type="button"
          >
            {L.insColRight[locale]}
          </button>
          <button
            className={styles.miniBtn}
            onClick={() => deleteCol(selCol)}
            type="button"
          >
            {L.delCol[locale]}
          </button>
        </div>
      )}
      {selRow !== null && (
        <div className={styles.selBar}>
          <span className={styles.selLabel}>
            {L.row[locale]} {selRow + 1}
          </span>
          <button
            className={styles.miniBtn}
            onClick={() => insertRow(selRow)}
            type="button"
          >
            {L.insRowUp[locale]}
          </button>
          <button
            className={styles.miniBtn}
            onClick={() => insertRow(selRow + 1)}
            type="button"
          >
            {L.insRowDown[locale]}
          </button>
          <button
            className={styles.miniBtn}
            onClick={() => deleteRow(selRow)}
            type="button"
          >
            {L.delRow[locale]}
          </button>
        </div>
      )}
    </div>
  );
});

export default EditableGrid;
