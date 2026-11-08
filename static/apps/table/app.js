import {toMarkdown, fromMarkdown, clipboardRows} from './format.js';
const en = new URLSearchParams(location.search).get('lang') === 'en';
const t = (zh, english) => (en ? english : zh);
const el = id => document.getElementById(id);
document.documentElement.lang = en ? 'en' : 'zh-CN';
const labels = {
  intro: t(
    '点选 Excel 单元格粘贴表格，或在 Markdown 框粘贴文本。两侧自动同步，数据仅在本机处理。',
    'Paste a table into an Excel cell or paste text into the Markdown editor. Both sides sync on this device.',
  ),
  open: t('打开文件', 'Open file'),
  sheetTitle: t('工作表', 'Sheet'),
  previewTitle: 'Excel',
  clear: t('清空', 'Clear'),
  copyExcel: t('复制到 Excel', 'Copy for Excel'),
  excel: t('下载 Excel', 'Download Excel'),
  copy: t('复制 Markdown', 'Copy Markdown'),
  save: t('下载 Markdown', 'Download Markdown'),
};
for (const [id, label] of Object.entries(labels)) el(id).textContent = label;
const md = el('md'),
  sheet = el('sheet'),
  feedback = el('feedback');
let book = null,
  base = 'table',
  active = '',
  drafts = new Map(),
  rows = null,
  revision = 0;
const preview = el('preview');
function updateActions() {
  for (const id of ['excel', 'copyExcel', 'copy', 'save'])
    el(id).disabled = !rows;
}
function columnName(i) {
  return XLSX.utils.encode_col(i);
}
function renderGrid() {
  const table = document.createElement('table'),
    head = table.createTHead().insertRow();
  head.append(document.createElement('th'));
  const width = Math.min(50, Math.max(6, (rows?.[0].length ?? 0) + 1));
  const height = Math.min(100, Math.max(12, (rows?.length ?? 0) + 1));
  const body = table.createTBody();
  for (let c = 0; c < width; c++) {
    const th = document.createElement('th');
    th.textContent = columnName(c);
    head.append(th);
  }
  for (let r = 0; r < height; r++) {
    const tr = body.insertRow(),
      th = document.createElement('th');
    th.textContent = r + 1;
    tr.append(th);
    for (let c = 0; c < width; c++) {
      const td = tr.insertCell();
      td.contentEditable = 'plaintext-only';
      td.spellcheck = false;
      td.dataset.r = r;
      td.dataset.c = c;
      td.setAttribute('aria-label', columnName(c) + (r + 1));
      td.textContent = rows?.[r]?.[c] ?? '';
    }
  }
  preview.replaceChildren(table);
  if (rows && (rows.length > 100 || rows[0].length > 50))
    preview.append(
      t(
        '网格显示前 100 行、50 列，导出包含全部数据。',
        'Grid shows the first 100 rows and 50 columns. Export includes all data.',
      ),
    );
}
function refresh() {
  rows = fromMarkdown(md.value);
  updateActions();
  renderGrid();
  if (!rows && md.value.trim())
    feedback.textContent = t(
      '请检查 Markdown 表头、分隔行和列数。',
      'Check the Markdown header, separator and column counts.',
    );
}
function writeCells(r, c, grid) {
  revision++;
  rows ??= [];
  const width = Math.max(
    rows[0]?.length ?? 0,
    c + grid.reduce((max, row) => Math.max(max, row.length), 0),
  );
  while (rows.length < r + grid.length) rows.push([]);
  for (const row of rows) while (row.length < width) row.push('');
  grid.forEach((row, i) =>
    row.forEach((value, j) => (rows[r + i][c + j] = value)),
  );
  md.value = toMarkdown(rows);
  feedback.textContent = '';
  updateActions();
}
preview.addEventListener('input', e => {
  const cell = e.target.closest('td');
  if (cell) writeCells(+cell.dataset.r, +cell.dataset.c, [[cell.innerText]]);
});
preview.addEventListener('keydown', e => {
  const cell = e.target.closest('td');
  if (
    !cell ||
    e.isComposing ||
    (e.key !== 'Tab' && e.key !== 'Enter') ||
    (e.key === 'Enter' && e.shiftKey)
  )
    return;
  const r = +cell.dataset.r + (e.key === 'Enter' ? 1 : 0),
    c = +cell.dataset.c + (e.key === 'Tab' ? (e.shiftKey ? -1 : 1) : 0);
  if (r < 0 || c < 0 || r >= 100 || c >= 50) return;
  let next = preview.querySelector(`td[data-r="${r}"][data-c="${c}"]`);
  if (!next && rows) {
    renderGrid();
    next = preview.querySelector(`td[data-r="${r}"][data-c="${c}"]`);
  }
  if (next) {
    e.preventDefault();
    next.focus();
  }
});
function content(wb, name) {
  const ws = wb.Sheets[name];
  if (!ws['!ref']) return '';
  const r = XLSX.utils.decode_range(ws['!ref']);
  if ((r.e.r - r.s.r + 1) * (r.e.c - r.s.c + 1) > 1000000)
    throw Error(
      t(
        '工作表范围过大，请缩小到 100 万个单元格以内。',
        'Reduce the sheet range to one million cells or fewer.',
      ),
    );
  return toMarkdown(
    XLSX.utils.sheet_to_json(ws, {
      header: 1,
      raw: false,
      defval: '',
      blankrows: true,
    }),
  );
}
async function openFile(file) {
  if (!file) return;
  const id = ++revision;
  try {
    let wb = null,
      value = '',
      name = '';
    if (/\.xlsx?$/i.test(file.name)) {
      wb = XLSX.read(await file.arrayBuffer());
      name = wb.SheetNames[0];
      value = content(wb, name);
    } else if (/\.(md|markdown)$/i.test(file.name)) {
      value = await file.text();
    } else
      throw Error(
        t(
          '请选择 .xlsx、.xls 或 .md 文件。',
          'Choose an .xlsx, .xls or .md file.',
        ),
      );
    if (id !== revision) return;
    book = wb;
    active = name;
    base = file.name.replace(/\.[^.]+$/, '');
    drafts = new Map();
    sheet.replaceChildren(...(wb?.SheetNames ?? []).map(n => new Option(n, n)));
    el('sheetLabel').hidden = !wb;
    md.value = value;
    refresh();
    feedback.textContent = file.name;
  } catch (err) {
    if (id === revision)
      feedback.textContent = t('无法导入：', 'Import failed: ') + err.message;
  }
}
sheet.onchange = () => {
  try {
    const next = sheet.value,
      value = drafts.get(next) ?? content(book, next);
    drafts.set(active, md.value);
    active = next;
    md.value = value;
    feedback.textContent = '';
    refresh();
  } catch (err) {
    sheet.value = active;
    feedback.textContent = err.message;
  }
};
function readClipboard(data, singleCell) {
  if (!data) return;
  const text = data.getData('text/plain');
  if (!singleCell && fromMarkdown(text)) return;
  // Template contents remain inert. Only read cell text from HTML-only copies.
  const template = document.createElement('template');
  template.innerHTML = data.getData('text/html');
  const table = template.content.querySelector('table');
  if (
    !singleCell &&
    !table &&
    !text.includes('\t') &&
    !text.trimEnd().includes('\n')
  )
    return;
  let grid;
  if (text && (!table || text.includes('\t'))) grid = clipboardRows(text);
  else if (table) {
    for (const br of table.querySelectorAll('br')) br.replaceWith('\n');
    grid = Array.from(table.rows, row =>
      Array.from(row.cells, cell => cell.textContent),
    );
  }
  return grid;
}
preview.addEventListener('paste', event => {
  const cell = event.target.closest('td');
  if (!cell) return;
  const grid = readClipboard(event.clipboardData, true);
  if (!grid?.length) return;
  event.preventDefault();
  const {r, c} = cell.dataset;
  writeCells(+r, +c, grid);
  renderGrid();
  preview.querySelector(`td[data-r="${r}"][data-c="${c}"]`).focus();
});
md.addEventListener('paste', event => {
  const grid = readClipboard(event.clipboardData, false);
  if (!grid?.length) return;
  event.preventDefault();
  revision++;
  md.value = toMarkdown(grid);
  refresh();
  feedback.textContent = t(
    '已将复制的单元格转换为 Markdown',
    'Copied cells converted to Markdown',
  );
});
md.oninput = () => {
  feedback.textContent = '';
  refresh();
};
el('clear').onclick = () => {
  revision++;
  md.value = '';
  feedback.textContent = '';
  refresh();
  md.focus();
};
el('open').onclick = () => el('file').click();
el('file').onchange = e => {
  openFile(e.target.files[0]);
  e.target.value = '';
};
window.addEventListener('dragover', e => {
  if (e.dataTransfer.types.includes('Files')) {
    e.preventDefault();
    document.body.classList.add('dragging');
  }
});
window.addEventListener('dragleave', e => {
  if (!e.relatedTarget) document.body.classList.remove('dragging');
});
window.addEventListener('drop', e => {
  document.body.classList.remove('dragging');
  if (e.dataTransfer.files.length) {
    e.preventDefault();
    openFile(e.dataTransfer.files[0]);
  }
});
function filename() {
  return book && book.SheetNames.length > 1 ? base + '-' + active : base;
}
el('excel').onclick = () => {
  try {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(rows),
      active || 'Sheet1',
    );
    XLSX.writeFile(wb, filename() + '.xlsx');
  } catch (err) {
    feedback.textContent = err.message;
  }
};
el('save').onclick = () => {
  const url = URL.createObjectURL(
    new Blob([md.value], {type: 'text/markdown;charset=utf-8'}),
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = filename() + '.md';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};
el('copyExcel').onclick = async () => {
  const escape = text =>
    text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br style="mso-data-placement:same-cell">');
  const html =
    '<table>' +
    rows
      .map(
        row =>
          '<tr>' +
          row
            .map(
              cell =>
                `<td style='mso-number-format:"\\@";white-space:pre-wrap'>${escape(cell)}</td>`,
            )
            .join('') +
          '</tr>',
      )
      .join('') +
    '</table>';
  const text = rows
    .map(row =>
      row
        .map(cell =>
          /["\n\t]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell,
        )
        .join('\t'),
    )
    .join('\r\n');
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([text], {type: 'text/plain'}),
          'text/html': new Blob([html], {type: 'text/html'}),
        }),
      ]);
    } else await navigator.clipboard.writeText(text);
    feedback.textContent = t(
      '已复制，在 Excel 选择起始单元格后粘贴。',
      'Copied. Select a starting cell in Excel and paste.',
    );
  } catch {
    feedback.textContent = t(
      '浏览器无法复制，请使用「下载 Excel」。',
      'Clipboard unavailable. Use Download Excel.',
    );
  }
};
el('copy').onclick = async () => {
  try {
    await navigator.clipboard.writeText(md.value);
    feedback.textContent = t('已复制 Markdown', 'Markdown copied');
  } catch {
    md.focus();
    md.select();
    feedback.textContent = t(
      '已选中，请使用系统复制快捷键。',
      'Text selected. Use your copy shortcut.',
    );
  }
};
refresh();
