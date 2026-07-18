#!/usr/bin/env node
// Ensure Chinese (zh-CN, source under docs/) and English (en, under
// i18n/en/docusaurus-plugin-content-docs/current/) tutorial files stay in
// sync. Exit code 1 when a doc/category exists on one side but not the other,
// so it can gate CI / pre-commit. Front-matter `sidebar_position` drift is
// reported as a warning (configurable via STRICT_FRONTMATTER=1 to fail).

import {
  readdirSync,
  statSync,
  readFileSync,
  existsSync,
} from 'node:fs';
import {join, relative, extname, basename} from 'node:path';

const ROOT = process.cwd();
const ZH_DOCS = join(ROOT, 'docs');
const EN_DOCS = join(ROOT, 'i18n', 'en', 'docusaurus-plugin-content-docs', 'current');
const DOC_EXT = new Set(['.md', '.mdx']);
const STRICT = process.env.STRICT_FRONTMATTER === '1';

function walk(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const name of readdirSync(cur)) {
      const p = join(cur, name);
      if (statSync(p).isDirectory()) stack.push(p);
      else out.push(p);
    }
  }
  return out;
}

function rel(p, base) {
  return relative(base, p).split('\\').join('/');
}

function isDoc(p) {
  return DOC_EXT.has(extname(p));
}

function isCategory(p) {
  return basename(p) === '_category_.json';
}

function frontMatter(file) {
  const raw = readFileSync(file, 'utf8');
  if (!raw.startsWith('---')) return {};
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return {};
  const obj = {};
  for (const line of raw.slice(3, end).trim().split('\n')) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m) obj[m[1]] = m[2].trim();
  }
  return obj;
}

function collect(predicate) {
  const zh = new Map();
  const en = new Map();
  for (const f of walk(ZH_DOCS)) {
    if (predicate(f)) zh.set(rel(f, ZH_DOCS), f);
  }
  for (const f of walk(EN_DOCS)) {
    if (predicate(f)) en.set(rel(f, EN_DOCS), f);
  }
  return {zh, en};
}

const errors = [];
const warnings = [];

// 1) File presence: every zh doc/category must have an en counterpart (and vice versa).
for (const [label, pred] of [
  ['doc', isDoc],
  ['category', isCategory],
]) {
  const {zh, en} = collect(pred);
  const onlyZh = [...zh.keys()].filter(k => !en.has(k));
  const onlyEn = [...en.keys()].filter(k => !zh.has(k));

  for (const k of onlyZh) {
    errors.push(`[${label}] missing English translation: ${k}`);
  }
  for (const k of onlyEn) {
    errors.push(`[${label}] orphan English file (no Chinese source): ${k}`);
  }

  // 2) Front-matter position drift (warning by default, error when strict).
  for (const k of zh.keys()) {
    if (!en.has(k)) continue;
    const zhFm = frontMatter(zh.get(k));
    const enFm = frontMatter(en.get(k));
    const key = label === 'doc' ? 'sidebar_position' : 'position';
    if (zhFm[key] !== undefined && enFm[key] !== undefined && zhFm[key] !== enFm[key]) {
      const msg = `[${label}] sidebar position mismatch for ${k}: zh=${zhFm[key]} en=${enFm[key]}`;
      if (STRICT) errors.push(msg);
      else warnings.push(msg);
    }
  }
}

console.log('i18n tutorial sync check (zh-CN source <-> en translation)');
console.log(`  zh source:  docs/`);
console.log(`  en transl.: i18n/en/docusaurus-plugin-content-docs/current/`);
console.log('');

if (warnings.length) {
  console.log('Warnings:');
  for (const w of warnings) console.log(`  ! ${w}`);
  console.log('');
}

if (errors.length) {
  console.log(`FAILED: ${errors.length} issue(s) found.`);
  for (const e of errors) console.log(`  x ${e}`);
  console.log('\nFix by adding/aligning the missing English translation under');
  console.log('i18n/en/docusaurus-plugin-content-docs/current/ (same relative path).');
  process.exit(1);
}

console.log('PASSED: Chinese and English tutorials are in sync.');
process.exit(0);
