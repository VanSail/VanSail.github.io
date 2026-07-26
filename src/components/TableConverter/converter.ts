export type Table = string[][];

export type Align = 'none' | 'left' | 'center' | 'right';

export interface ParseResult {
  table: Table;
  aligns: Align[];
  error: string;
}

/* ----------------------------- Markdown ----------------------------- */

function splitMdRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map(c => c.trim());
}

function alignOf(sep: string): Align {
  const s = sep.trim();
  const l = s.startsWith(':');
  const r = s.endsWith(':');
  if (l && r) return 'center';
  if (l) return 'left';
  if (r) return 'right';
  return 'none';
}

export function parseMarkdown(text: string): {rows: Table; aligns: Align[]} {
  const lines = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter(l => l.trim().length > 0);
  const rows: Table = [];
  let aligns: Align[] = [];
  let started = false;
  for (const line of lines) {
    if (!line.includes('|')) continue;
    const cells = splitMdRow(line);
    if (!started) {
      rows.push(cells);
      started = true;
      continue;
    }
    const isSeparator = cells.every(c => /^:?-+:?$/.test(c));
    if (isSeparator) {
      aligns = cells.map(alignOf);
      continue;
    }
    rows.push(cells);
  }
  return {rows, aligns};
}

function normAligns(width: number, aligns: Align[]): Align[] {
  const out: Align[] = [];
  for (let i = 0; i < width; i++) out.push(aligns[i] ?? 'none');
  return out;
}

function sepFor(a: Align): string {
  switch (a) {
    case 'left':
      return ':---';
    case 'center':
      return ':---:';
    case 'right':
      return '---:';
    default:
      return '---';
  }
}

export function serializeMarkdown(table: Table, aligns: Align[] = []): string {
  if (table.length === 0) return '';
  const width = Math.max(...table.map(r => r.length));
  const a = normAligns(width, aligns);
  const pad = (row: string[]) => {
    const out = row.slice();
    while (out.length < width) out.push('');
    return out;
  };
  const lines: string[] = [];
  lines.push('| ' + pad(table[0]).join(' | ') + ' |');
  lines.push('| ' + a.map(sepFor).join(' | ') + ' |');
  for (let i = 1; i < table.length; i++) {
    lines.push('| ' + pad(table[i]).join(' | ') + ' |');
  }
  return lines.join('\n');
}

/* --------------------------- dispatch helpers ------------------------ */

export function parseToTable(text: string): ParseResult {
  if (!text.trim()) return {table: [], aligns: [], error: ''};
  try {
    const {rows, aligns} = parseMarkdown(text);
    return {table: rows, aligns, error: ''};
  } catch (e) {
    return {
      table: [],
      aligns: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export function serializeFromTable(table: Table, aligns: Align[] = []): string {
  return serializeMarkdown(table, aligns);
}
