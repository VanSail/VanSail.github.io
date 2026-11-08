// Encode cell text independently from the delimiters of the Markdown table.
function encodeCell(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\\|`*_~[\]]/g, c => '\\' + c)
    .replace(/^ +| +$/g, spaces => '&#32;'.repeat(spaces.length))
    .replace(/\r\n?|\n/g, '<br>');
}
export function toMarkdown(rows) {
  if (!rows.length) return '';
  const width = rows.reduce((n, row) => Math.max(n, row.length), 0);
  if (!width) return '';
  const line = row =>
    '| ' +
    Array.from({length: width}, (_, i) => encodeCell(row[i] ?? '')).join(
      ' | ',
    ) +
    ' |';
  return [
    line(rows[0]),
    line(Array(width).fill('---')),
    ...rows.slice(1).map(line),
  ].join('\n');
}
function cells(line) {
  const fields = [];
  let value = '';
  const s = line.trim();
  let endPipe = false;
  for (let i = s.startsWith('|') ? 1 : 0; i < s.length; i++) {
    const c = s[i];
    endPipe = false;
    if (c === '\\' && /[!-\/:-@\[-`{-~]/.test(s[i + 1] ?? '')) {
      value += s[++i];
    } else if (c === '|') {
      fields.push(value.trim());
      value = '';
      endPipe = true;
    } else value += c;
  }
  if (!endPipe) fields.push(value.trim());
  return fields;
}
export function fromMarkdown(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const headers = cells(lines[0]),
    separator = cells(lines[1]);
  if (
    !headers.length ||
    !lines[0].includes('|') ||
    separator.length !== headers.length ||
    !separator.every(c => /^:?-+:?$/.test(c))
  )
    return null;
  const rows = [headers];
  for (const line of lines.slice(2)) {
    if (!line.trim()) return null;
    const row = cells(line);
    if (row.length > headers.length) return null;
    while (row.length < headers.length) row.push('');
    rows.push(row);
  }
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#32;': ' ',
    '&quot;': '"',
    '&nbsp;': '\u00a0',
  };
  return rows.map(row =>
    row.map(v =>
      v
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/&(amp|lt|gt|#32|quot|nbsp);/g, k => entities[k]),
    ),
  );
}

// Spreadsheet clipboards quote multiline cells and double embedded quotes.
export function clipboardRows(text) {
  const input = text.replace(/\r\n?/g, '\n');
  const rows = [];
  let row = [],
    cell = '',
    quoted = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c !== '"') cell += c;
      else if (input[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = false;
    } else if (c === '"' && !cell.length) quoted = true;
    else if (c === '\t') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (quoted) return null;
  if (row.length || cell || !input.endsWith('\n')) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
