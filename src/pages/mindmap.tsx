import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';

import styles from './mindmap.module.css';
import {GUIDE_GROUPS} from '@site/src/data/guideNav';

/* ============ 常量 ============ */
export const FONT_SIZE = 14;
export const FONT_FAMILY =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif";
export const PAD_X = 14;
export const NODE_H = 34;
const H_GAP = 48; // 相邻层级水平间距
const ROW_GAP = 46; // 同级叶子垂直间距
const MARGIN = 30;
export const MAX_W = 260; // 单节点最大宽度

export type Direction = 'right' | 'left' | 'both';
export type ThemeName = 'fresh' | 'deep' | 'vivid';
type BgId =
  'grid' | 'white' | 'dark' | 'gray' | 'cream' | 'blue' | 'green' | 'custom';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/* 背景预设 */
const BG_PRESETS: {
  id: Exclude<BgId, 'custom'>;
  zh: string;
  en: string;
  color: string;
  dots: boolean;
}[] = [
  {id: 'grid', zh: '点阵', en: 'Dots', color: '#ffffff', dots: true},
  {id: 'white', zh: '纯白', en: 'White', color: '#ffffff', dots: false},
  {id: 'dark', zh: '深灰', en: 'Dark', color: '#1b1b1d', dots: false},
  {id: 'gray', zh: '浅灰', en: 'Gray', color: '#f2f4f7', dots: false},
  {id: 'cream', zh: '米色', en: 'Cream', color: '#fdf6ec', dots: false},
  {id: 'blue', zh: '天蓝', en: 'Blue', color: '#eef4fb', dots: false},
  {id: 'green', zh: '草绿', en: 'Green', color: '#ecf6ee', dots: false},
];

/* ============ 编码 / 持久化 ============ */
const LS_KEY = 'vansail-mindmap-v1';
const DIRS: Direction[] = ['right', 'left', 'both'];
const THEME_LIST: ThemeName[] = ['fresh', 'deep', 'vivid'];
const LINK_LIST: LinkStyle[] = ['smooth', 'straight', 'elbow', 'rounded'];
const BG_LIST: BgId[] = [
  'grid',
  'white',
  'dark',
  'gray',
  'cream',
  'blue',
  'green',
  'custom',
];

interface SavedState {
  md: string;
  direction: Direction;
  themeName: ThemeName;
  linkStyle: LinkStyle;
  bgId: BgId;
  bgCustom: string;
}

/* UTF-8 安全的 base64（用于放进 URL hash） */
const encodeHash = (md: string): string => {
  const bytes = new TextEncoder().encode(md);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
};
const decodeHash = (s: string): string => {
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
};

/* 把当前状态序列化进 #hash（URLSearchParams 会自动转义） */
const buildHash = (s: SavedState): string => {
  const p = new URLSearchParams();
  p.set('d', encodeHash(s.md));
  p.set('v', s.direction);
  p.set('t', s.themeName);
  p.set('l', s.linkStyle);
  p.set('b', s.bgId);
  p.set('c', s.bgCustom);
  return '#' + p.toString();
};

/* 解析 #hash，无效字段丢弃；无 hash 返回 null */
const parseHash = (hash: string): Partial<SavedState> | null => {
  if (typeof window === 'undefined') return null;
  if (!hash || hash.length < 2) return null;
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const p = new URLSearchParams(raw);
  const d = p.get('d');
  if (!d) return null;
  const out: Partial<SavedState> = {md: decodeHash(d)};
  const v = p.get('v');
  if (v && DIRS.includes(v as Direction)) out.direction = v as Direction;
  const t = p.get('t');
  if (t && THEME_LIST.includes(t as ThemeName)) out.themeName = t as ThemeName;
  const l = p.get('l');
  if (l && LINK_LIST.includes(l as LinkStyle)) out.linkStyle = l as LinkStyle;
  const b = p.get('b');
  if (b && BG_LIST.includes(b as BgId)) out.bgId = b as BgId;
  const c = p.get('c');
  if (c) out.bgCustom = c;
  return out;
};

/* 读取本地自动保存；非法值丢弃 */
const readSaved = (): Partial<SavedState> | null => {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(LS_KEY);
    if (!s) return null;
    const o = JSON.parse(s) as Partial<SavedState>;
    const out: Partial<SavedState> = {};
    if (typeof o.md === 'string') out.md = o.md;
    if (o.direction && DIRS.includes(o.direction)) out.direction = o.direction;
    if (o.themeName && THEME_LIST.includes(o.themeName))
      out.themeName = o.themeName;
    if (o.linkStyle && LINK_LIST.includes(o.linkStyle))
      out.linkStyle = o.linkStyle;
    if (o.bgId && BG_LIST.includes(o.bgId)) out.bgId = o.bgId;
    if (typeof o.bgCustom === 'string') out.bgCustom = o.bgCustom;
    return out;
  } catch {
    return null;
  }
};

const writeSaved = (s: SavedState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
};

/* 文本测量（懒初始化，兼容 SSR） */
let measureCtx: CanvasRenderingContext2D | null = null;
function getCtx(): CanvasRenderingContext2D | null {
  if (measureCtx) return measureCtx;
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  measureCtx = c.getContext('2d');
  return measureCtx;
}

/* ============ 数据结构 ============ */
export interface TNode {
  id: string;
  text: string;
  level: number;
  children: TNode[];
  width: number;
  display: string;
  side?: Direction; // 该子树生长方向（根节点为 undefined）
  _y?: number;
  x?: number;
  note?: string;
}
export interface LaidNode {
  id: string;
  text: string;
  depth: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cy: number;
  side: Direction;
  hasChildren: boolean;
  collapsed: boolean;
  note?: string;
}
export interface LaidLink {
  id: string;
  d: string;
}
export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
interface Transform {
  x: number;
  y: number;
  k: number;
}

/* ============ 主题定义 ============ */
interface ThemeVariant {
  palette: string[];
  root: string;
  rootText: string;
  text: string;
  link: string;
}
interface ThemeDef {
  light: ThemeVariant;
  dark: ThemeVariant;
}

export const THEMES: Record<ThemeName, ThemeDef> = {
  fresh: {
    light: {
      palette: [
        '#e7f0fb',
        '#eef5e9',
        '#fdeede',
        '#f3e9f8',
        '#e6f5ef',
        '#fbe9ec',
      ],
      root: '#5a9e3f',
      rootText: '#ffffff',
      text: '#1c1e21',
      link: '#b9c2cc',
    },
    dark: {
      palette: [
        '#1f2c3a',
        '#27331f',
        '#33291c',
        '#2c2333',
        '#1d2e28',
        '#331f22',
      ],
      root: '#8bd05a',
      rootText: '#10210b',
      text: '#e6e6e6',
      link: '#545b64',
    },
  },
  deep: {
    light: {
      palette: [
        '#eceef3',
        '#e8edf3',
        '#eef0f4',
        '#e9ebf2',
        '#edf0f3',
        '#eaecef',
      ],
      root: '#3a4a63',
      rootText: '#ffffff',
      text: '#2a2f3a',
      link: '#c2c8d0',
    },
    dark: {
      palette: [
        '#222a36',
        '#263041',
        '#232c3a',
        '#282434',
        '#1f2c2a',
        '#2a2330',
      ],
      root: '#7c93b8',
      rootText: '#10203a',
      text: '#dfe4ec',
      link: '#4a525e',
    },
  },
  vivid: {
    light: {
      palette: [
        '#ffe3e3',
        '#fff1cc',
        '#d9f2e6',
        '#d9e8ff',
        '#f0d9ff',
        '#ffe0c2',
      ],
      root: '#ff6b6b',
      rootText: '#ffffff',
      text: '#3a2f2f',
      link: '#d9b8b8',
    },
    dark: {
      palette: [
        '#3a2230',
        '#3a3020',
        '#1f3329',
        '#1f2a3a',
        '#2e1f3a',
        '#3a2a1f',
      ],
      root: '#ff9a9a',
      rootText: '#3a1010',
      text: '#f3e9e9',
      link: '#5a4a4a',
    },
  },
};

/* ============ Markdown -> 树（用 # 数量控制层级） ============ */
function parseMarkdown(md: string): TNode {
  const root: TNode = {
    id: 'root',
    text: '',
    level: 0,
    children: [],
    width: 0,
    display: '',
  };
  const stack: {node: TNode; level: number}[] = [{node: root, level: 0}];

  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) continue;
    const noteM = /^\|\s?(.*)$/.exec(line);
    if (noteM) {
      const top = stack[stack.length - 1].node;
      top.note = top.note ? `${top.note}\n${noteM[1]}` : noteM[1];
      continue;
    }
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].trim();
    while (stack.length > 1 && stack[stack.length - 1].level >= level)
      stack.pop();
    const parent = stack[stack.length - 1].node;
    const index = parent.children.length;
    const id = parent.id === 'root' ? `${index}` : `${parent.id}-${index}`;
    const node: TNode = {
      id,
      text,
      level,
      children: [],
      width: 0,
      display: text,
    };
    parent.children.push(node);
    stack.push({node, level});
  }

  if (root.children.length === 1) return root.children[0];
  root.display = '思维导图';
  if (!root.text) root.text = '思维导图';
  return root;
}

function collectParentIds(node: TNode, acc: string[] = []): string[] {
  if (node.children.length > 0) acc.push(node.id);
  node.children.forEach(c => collectParentIds(c, acc));
  return acc;
}

/* ============ 布局：支持 向右 / 向左 / 两侧 平衡 ============ */
export type LinkStyle = 'smooth' | 'straight' | 'elbow' | 'rounded';

function linkPath(
  px: number,
  py: number,
  cx: number,
  cy: number,
  style: LinkStyle,
): string {
  if (style === 'straight') {
    return `M ${px} ${py} L ${cx} ${cy}`;
  }
  if (style === 'smooth') {
    const dx = Math.abs(cx - px) / 2;
    return `M ${px} ${py} C ${px + dx} ${py}, ${cx - dx} ${cy}, ${cx} ${cy}`;
  }
  const midX = (px + cx) / 2;
  if (style === 'elbow') {
    return `M ${px} ${py} L ${midX} ${py} L ${midX} ${cy} L ${cx} ${cy}`;
  }
  // rounded：折角加圆角
  const dx = cx - px;
  const dy = cy - py;
  const r = Math.max(
    0,
    Math.min(10, Math.abs(midX - px) - 1, Math.abs(dy) - 1),
  );
  if (r <= 0.5)
    return `M ${px} ${py} L ${midX} ${py} L ${midX} ${cy} L ${cx} ${cy}`;
  const sx = Math.sign(dx) || 1;
  const sy = Math.sign(dy) || 1;
  return `M ${px} ${py} L ${midX - sx * r} ${py} Q ${midX} ${py} ${midX} ${py + sy * r} L ${midX} ${cy - sy * r} Q ${midX} ${cy} ${midX + sx * r} ${cy} L ${cx} ${cy}`;
}

export function computeLayout(
  tree: TNode,
  collapsed: Set<string>,
  direction: Direction,
  linkStyle: LinkStyle,
) {
  if (tree.id === 'root' && tree.children.length === 0) {
    return {
      nodes: [],
      links: [],
      bounds: {minX: 0, minY: 0, maxX: 0, maxY: 0} as Bounds,
    };
  }
  const ctx = getCtx();
  if (ctx) ctx.font = `${FONT_SIZE}px ${FONT_FAMILY}`;

  const setWidth = (n: TNode) => {
    const raw = ctx
      ? (ctx.measureText(n.text || ' ')?.width ?? n.text.length * 8)
      : n.text.length * 8;
    const avail = MAX_W - PAD_X * 2;
    if (raw <= avail) {
      n.width = raw + PAD_X * 2;
      n.display = n.text;
    } else {
      let t = n.text;
      const w = (s: string) => (ctx ? ctx.measureText(s).width : s.length * 8);
      while (t.length > 1 && w(t + '…') > avail) t = t.slice(0, -1);
      n.display = t + '…';
      n.width = MAX_W;
    }
    n.children.forEach(setWidth);
  };
  setWidth(tree);

  // 为每个节点分配生长方向（根节点居中；其直接子节点按规则分左右）
  const setSides = (n: TNode, isRootChild: boolean) => {
    n.children.forEach((c, i) => {
      let s: Direction;
      if (isRootChild) {
        s = direction === 'both' ? (i % 2 === 0 ? 'right' : 'left') : direction;
      } else {
        s = n.side ?? 'right';
      }
      c.side = s;
      setSides(c, false);
    });
  };
  tree.side = undefined;
  setSides(tree, true);

  // 第一遍：后序分配 y（与方向无关）
  let cursor = MARGIN;
  const assignY = (n: TNode) => {
    const isCol = collapsed.has(n.id);
    if (isCol || n.children.length === 0) {
      n._y = cursor + NODE_H / 2;
      cursor += ROW_GAP;
    } else {
      n.children.forEach(assignY);
      const ys = n.children.map(c => c._y!);
      n._y = (ys[0] + ys[ys.length - 1]) / 2;
    }
  };
  assignY(tree);

  // 第二遍：前序分配 x + 连线 + 收集节点
  const nodes: LaidNode[] = [];
  const links: LaidLink[] = [];
  const assignX = (n: TNode, depth: number) => {
    if (n === tree) {
      n.x =
        direction === 'right'
          ? 0
          : direction === 'left'
            ? -n.width
            : -n.width / 2;
    }
    nodes.push({
      id: n.id,
      text: n.display,
      depth,
      x: n.x!,
      y: n._y! - NODE_H / 2,
      w: n.width,
      h: NODE_H,
      cy: n._y!,
      side: (n.side ?? 'right') as Direction,
      hasChildren: n.children.length > 0,
      collapsed: collapsed.has(n.id),
      note: n.note,
    });
    if (!collapsed.has(n.id)) {
      n.children.forEach(c => {
        if (c.side === 'right') c.x = n.x! + n.width + H_GAP;
        else c.x = n.x! - H_GAP - c.width;
        if (c.side === 'right') {
          links.push({
            id: `${n.id}-${c.id}`,
            d: linkPath(n.x! + n.width, n._y!, c.x, c._y!, linkStyle),
          });
        } else {
          links.push({
            id: `${n.id}-${c.id}`,
            d: linkPath(n.x!, n._y!, c.x + c.width, c._y!, linkStyle),
          });
        }
        assignX(c, depth + 1);
      });
    }
  };
  assignX(tree, 0);

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  nodes.forEach(n => {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.w);
    maxY = Math.max(maxY, n.y + n.h);
  });
  if (!isFinite(minX)) {
    minX = 0;
    minY = 0;
    maxX = 0;
    maxY = 0;
  }
  return {nodes, links, bounds: {minX, minY, maxX, maxY} as Bounds};
}

/* ============ 树 -> Markdown / 编辑 / 拖拽重排 ============ */
function serializeTree(tree: TNode): string {
  const lines: string[] = [];
  const startDepth = tree.id === 'root' ? 0 : 1;
  const walk = (n: TNode, depth: number) => {
    lines.push(`${'#'.repeat(depth)} ${n.text}`);
    if (n.note) n.note.split('\n').forEach(l => lines.push(`| ${l}`));
    n.children.forEach(c => walk(c, depth + 1));
  };
  walk(tree, startDepth);
  return lines.join('\n');
}

function findNode(tree: TNode, id: string): TNode | null {
  if (tree.id === id) return tree;
  for (const c of tree.children) {
    const r = findNode(c, id);
    if (r) return r;
  }
  return null;
}

function reparent(tree: TNode, dragId: string, targetId: string): boolean {
  if (dragId === targetId) return false;
  let dragged: TNode | null = null;
  const detach = (n: TNode): boolean => {
    const idx = n.children.findIndex(c => c.id === dragId);
    if (idx >= 0) {
      dragged = n.children[idx];
      n.children.splice(idx, 1);
      return true;
    }
    return n.children.some(detach);
  };
  if (!detach(tree) || !dragged) return false;
  const isDescendant = (n: TNode, id: string): boolean =>
    n.id === id || n.children.some(c => isDescendant(c, id));
  if (isDescendant(dragged, targetId)) return false;
  const insert = (n: TNode): boolean => {
    if (n.id === targetId) {
      n.children.push(dragged as TNode);
      return true;
    }
    return n.children.some(insert);
  };
  if (!insert(tree)) return false;
  return true;
}

function updateNodeText(md: string, id: string, text: string): string {
  const tree = parseMarkdown(md);
  const node = findNode(tree, id);
  if (!node) return md;
  const next = text.trim();
  if (next) node.text = next;
  return serializeTree(tree);
}

function updateNodeNote(md: string, id: string, note: string): string {
  const tree = parseMarkdown(md);
  const node = findNode(tree, id);
  if (!node) return md;
  const next = note.trim();
  node.note = next;
  return serializeTree(tree);
}

/* ============ 节点增删 ============ */
function findParent(tree: TNode, id: string): TNode | null {
  for (const c of tree.children) {
    if (c.id === id) return tree;
    const r = findParent(c, id);
    if (r) return r;
  }
  return null;
}

function findByText(tree: TNode, text: string): TNode | null {
  if (tree.text === text) return tree;
  for (const c of tree.children) {
    const r = findByText(c, text);
    if (r) return r;
  }
  return null;
}

function allIds(tree: TNode): string[] {
  const out: string[] = [];
  const walk = (n: TNode) => {
    out.push(n.id);
    n.children.forEach(walk);
  };
  walk(tree);
  return out;
}

let _mmUid = 0;
function _mmToken() {
  _mmUid += 1;
  return `__mm_${Date.now().toString(36)}_${_mmUid}__`;
}

/* 在 parentId 下插入新节点：afterId 为相对子节点（null 表示追加到末尾），返回新 md 与新节点 id */
function insertNode(
  md: string,
  parentId: string,
  afterId: string | null,
  label: string,
): {md: string; id: string} {
  const tree = parseMarkdown(md);
  const parent = findNode(tree, parentId);
  if (!parent) return {md, id: ''};
  const token = _mmToken();
  const node: TNode = {
    id: token,
    text: token,
    level: (parent.level ?? 0) + 1,
    children: [],
    width: 0,
    display: token,
  };
  if (afterId == null) parent.children.push(node);
  else {
    const idx = parent.children.findIndex(c => c.id === afterId);
    parent.children.splice(idx + 1, 0, node);
  }
  const tmp = serializeTree(tree);
  const reparsed = parseMarkdown(tmp);
  const added = findByText(reparsed, token);
  if (!added) return {md, id: ''};
  return {md: updateNodeText(tmp, added.id, label), id: added.id};
}

function addChild(
  md: string,
  parentId: string,
  label: string,
): {md: string; id: string} {
  return insertNode(md, parentId, null, label);
}

function addSibling(
  md: string,
  id: string,
  label: string,
): {md: string; id: string} {
  const tree = parseMarkdown(md);
  const parent = findParent(tree, id);
  if (!parent) return insertNode(md, id, null, label); // 顶层节点：改为加子节点
  return insertNode(md, parent.id, id, label);
}

function deleteNode(md: string, id: string): string {
  if (id === 'root') return md;
  const tree = parseMarkdown(md);
  if (tree.id === id) return ''; // 删除唯一根节点
  const parent = findParent(tree, id);
  if (!parent) return md;
  parent.children = parent.children.filter(c => c.id !== id);
  return serializeTree(tree);
}

/* ============ 默认示例：文档指南目录 ============ */
function buildGuideMd(lang: 'zh' | 'en'): string {
  const root = lang === 'zh' ? '文档指南' : 'Guide';
  const lines = [`# ${root}`];
  for (const g of GUIDE_GROUPS) {
    lines.push(`## ${g.label[lang]}`);
    for (const a of g.articles) {
      lines.push(`### ${a.title[lang]}`);
    }
  }
  return lines.join('\n');
}

const DEFAULT_MD = {zh: buildGuideMd('zh'), en: buildGuideMd('en')};
function MindMapInner() {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const {colorMode} = useColorMode();
  const isDark = colorMode === 'dark';

  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<Bounds>({minX: 0, minY: 0, maxX: 0, maxY: 0});
  const dragRef = useRef({active: false, sx: 0, sy: 0, ox: 0, oy: 0});

  const [md, setMd] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [transform, setTransform] = useState<Transform>({x: 0, y: 0, k: 1});
  const [direction, setDirection] = useState<Direction>('right');
  const [themeName, setThemeName] = useState<ThemeName>('fresh');
  const [linkStyle, setLinkStyle] = useState<LinkStyle>('smooth');
  const [bgId, setBgId] = useState<BgId>('grid');
  const [bgCustom, setBgCustom] = useState('#ffffff');
  const [editing, setEditing] = useState<{
    id: string;
    value: string;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    isNew?: boolean;
    selectAll?: boolean;
  } | null>(null);
  const [drag, setDrag] = useState<{
    id: string;
    dx: number;
    dy: number;
    targetId: string | null;
    moved: boolean;
    mx: number;
    my: number;
  } | null>(null);
  const dragStart = useRef<{x: number; y: number; id: string} | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState('');
  const [activeMatch, setActiveMatch] = useState(0);
  const [noteView, setNoteView] = useState<{
    id: string;
    value: string;
    sx: number;
    sy: number;
    sw: number;
    sh: number;
  } | null>(null);

  const [selected, setSelected] = useState('');
  const [pendingEdit, setPendingEdit] = useState<{
    id: string;
    value: string;
  } | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const historyRef = useRef<{past: string[]; future: string[]}>({
    past: [],
    future: [],
  });

  const tree = useMemo(() => parseMarkdown(md), [md]);
  const layout = useMemo(
    () => computeLayout(tree, collapsed, direction, linkStyle),
    [tree, collapsed, direction, linkStyle],
  );
  boundsRef.current = layout.bounds;
  const isEmpty = tree.id === 'root' && tree.children.length === 0;

  const theme = THEMES[themeName][isDark ? 'dark' : 'light'];
  const nodeStroke = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)';
  const toggleBg = isDark ? '#2a2a2d' : '#ffffff';

  const preset = BG_PRESETS.find(p => p.id === bgId);
  const activeBg =
    bgId === 'custom'
      ? bgCustom
      : preset?.id === 'grid'
        ? isDark
          ? '#1b1b1d'
          : '#ffffff'
        : (preset?.color ?? '#ffffff');
  const showDots = bgId === 'grid';

  const sig = useMemo(() => {
    let c = 0;
    let d = 0;
    const walk = (n: TNode, depth: number) => {
      c += 1;
      d = Math.max(d, depth);
      n.children.forEach(x => walk(x, depth + 1));
    };
    walk(tree, 0);
    return `${c}-${d}`;
  }, [tree]);

  const fit = useCallback(() => {
    const el = wrapRef.current;
    const b = boundsRef.current;
    if (!el || b.maxX - b.minX <= 0) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    if (W === 0 || H === 0) return;
    const cw = b.maxX - b.minX;
    const ch = b.maxY - b.minY;
    const k = clamp(Math.min(W / cw, H / ch) * 0.9, 0.2, 2.5);
    const x = (W - cw * k) / 2 - b.minX * k;
    const y = (H - ch * k) / 2 - b.minY * k;
    setTransform({x, y, k});
  }, []);

  // 结构或方向变化时适配视图
  useEffect(() => {
    const id = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(id);
  }, [sig, direction, fit]);

  // 滚轮缩放（非被动监听以便 preventDefault）
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setTransform(t => {
        const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
        const k = clamp(t.k * factor, 0.2, 3);
        return {
          k,
          x: mx - (mx - t.x) * (k / t.k),
          y: my - (my - t.y) * (k / t.k),
        };
      });
    };
    svg.addEventListener('wheel', handler, {passive: false});
    return () => svg.removeEventListener('wheel', handler);
  }, []);

  const zoomBy = (factor: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const mx = el.clientWidth / 2;
    const my = el.clientHeight / 2;
    setTransform(t => {
      const k = clamp(t.k * factor, 0.2, 3);
      return {
        k,
        x: mx - (mx - t.x) * (k / t.k),
        y: my - (my - t.y) * (k / t.k),
      };
    });
  };

  const centerOn = useCallback((n: LaidNode) => {
    const el = wrapRef.current;
    if (!el) return;
    const W = el.clientWidth;
    const H = el.clientHeight;
    const cx = n.x + n.w / 2;
    const cy = n.y + n.h / 2;
    setTransform(t => ({k: t.k, x: W / 2 - cx * t.k, y: H / 2 - cy * t.k}));
  }, []);

  /* 搜索匹配（按布局顺序） */
  const matchedList = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as LaidNode[];
    return layout.nodes.filter(n => n.text.toLowerCase().includes(q));
  }, [layout, query]);
  const matchedIds = useMemo(
    () => new Set(matchedList.map(n => n.id)),
    [matchedList],
  );

  const gotoMatch = (idx: number) => {
    if (matchedList.length === 0) return;
    const i =
      ((idx % matchedList.length) + matchedList.length) % matchedList.length;
    setActiveMatch(i);
    centerOn(matchedList[i]);
  };

  const openNote = (n: LaidNode, e: React.MouseEvent) => {
    e.stopPropagation();
    const k = transform.k;
    setNoteView({
      id: n.id,
      value: n.note ?? '',
      sx: transform.x + n.x * k,
      sy: transform.y + n.y * k,
      sw: n.w * k,
      sh: n.h * k,
    });
  };

  const onNoteChange = (val: string) => {
    if (!noteView) return;
    setMd(updateNodeNote(md, noteView.id, val));
    setNoteView(v => (v ? {...v, value: val} : v));
  };

  const toggle = (id: string) =>
    setCollapsed(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const expandAll = () => setCollapsed(new Set());
  const collapseAll = () =>
    setCollapsed(new Set(collectParentIds(tree).filter(id => id !== tree.id)));

  const toSvg = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return {x: 0, y: 0};
    return {
      x: (clientX - rect.left - transform.x) / transform.k,
      y: (clientY - rect.top - transform.y) / transform.k,
    };
  };

  /* ---- 节点拖拽 / 双击编辑 / 画布平移 ---- */
  const onNodePointerDown = (
    e: React.PointerEvent<SVGGElement>,
    id: string,
  ) => {
    if (editing) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    setSelected(id);
    dragStart.current = {x: e.clientX, y: e.clientY, id};
    setDrag({
      id,
      dx: 0,
      dy: 0,
      targetId: null,
      moved: false,
      mx: e.clientX,
      my: e.clientY,
    });
  };

  const applyHistory = useCallback(
    (next: string, record = true) => {
      if (record) {
        historyRef.current.past.push(md);
        if (historyRef.current.past.length > 100)
          historyRef.current.past.shift();
        historyRef.current.future = [];
        setCanUndo(true);
        setCanRedo(false);
      }
      setMd(next);
    },
    [md],
  );

  const undo = useCallback(() => {
    const h = historyRef.current;
    if (h.past.length === 0) return;
    const prev = h.past.pop()!;
    h.future.unshift(md);
    setCanUndo(h.past.length > 0);
    setCanRedo(true);
    setMd(prev);
  }, [md]);

  const redo = useCallback(() => {
    const h = historyRef.current;
    if (h.future.length === 0) return;
    const next = h.future.shift()!;
    h.past.push(md);
    if (h.past.length > 100) h.past.shift();
    setCanUndo(true);
    setCanRedo(h.future.length > 0);
    setMd(next);
  }, [md]);

  const commitEdit = () => {
    if (!editing) return;
    const {id, value, isNew} = editing;
    setEditing(null);
    if (
      isNew &&
      value.trim() === '' &&
      (findNode(parseMarkdown(md), id)?.children.length ?? 0) === 0
    ) {
      applyHistory(deleteNode(md, id));
      return;
    }
    const newMd = updateNodeText(md, id, value);
    if (newMd !== md) applyHistory(newMd);
  };

  const cancelEdit = () => {
    if (!editing) return;
    const {id, isNew} = editing;
    setEditing(null);
    if (isNew) applyHistory(deleteNode(md, id));
  };

  const applyAddSibling = (curId: string, curValue: string) => {
    const label = locale === 'zh' ? '新节点' : 'New node';
    const base = updateNodeText(md, curId, curValue);
    const r = addSibling(base, curId, label);
    applyHistory(r.md);
    setSelected(r.id);
    setPendingEdit({id: r.id, value: ''});
  };

  const applyAddChild = (curId: string, curValue: string) => {
    const label = locale === 'zh' ? '新节点' : 'New node';
    const base = updateNodeText(md, curId, curValue);
    const r = addChild(base, curId, label);
    applyHistory(r.md);
    setSelected(r.id);
    setPendingEdit({id: r.id, value: ''});
  };

  const addChildAndEdit = (parentId: string) => {
    const label = locale === 'zh' ? '新节点' : 'New node';
    const r = addChild(md, parentId, label);
    if (!r.id) return;
    applyHistory(r.md);
    setCollapsed(prev => {
      if (!prev.has(parentId)) return prev;
      const n = new Set(prev);
      n.delete(parentId);
      return n;
    });
    setSelected(r.id);
    setPendingEdit({id: r.id, value: ''});
  };

  const addSiblingAndEdit = (siblingId: string) => {
    const label = locale === 'zh' ? '新节点' : 'New node';
    const r = addSibling(md, siblingId, label);
    if (!r.id) return;
    applyHistory(r.md);
    setSelected(r.id);
    setPendingEdit({id: r.id, value: ''});
  };

  const removeNode = (id: string) => {
    if (id === 'root' || id === '') return;
    const tree = parseMarkdown(md);
    const parent = findParent(tree, id);
    const newMd = deleteNode(md, id);
    applyHistory(newMd);
    setSelected(sel => (sel === id ? (parent ? parent.id : '') : sel));
    setEditing(cur => (cur?.id === id ? null : cur));
    setNoteView(v => (v?.id === id ? null : v));
    setCollapsed(prev => {
      if (prev.size === 0) return prev;
      const ids = new Set(allIds(parseMarkdown(newMd)));
      return new Set([...prev].filter(x => ids.has(x)));
    });
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest('[data-node-id]')) return;
    setSelected('');
    setNoteView(null);
    dragRef.current = {
      active: true,
      sx: e.clientX,
      sy: e.clientY,
      ox: transform.x,
      oy: transform.y,
    };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag) {
      const dx = e.clientX - dragStart.current!.x;
      const dy = e.clientY - dragStart.current!.y;
      const moved = drag.moved || Math.abs(dx) > 4 || Math.abs(dy) > 4;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const host = el?.closest('[data-node-id]') as Element | null;
      const tid = host?.getAttribute('data-node-id') ?? null;
      setDrag({
        ...drag,
        dx,
        dy,
        moved,
        mx: e.clientX,
        my: e.clientY,
        targetId: moved && tid && tid !== drag.id ? tid : null,
      });
      return;
    }
    if (!dragRef.current.active) return;
    setTransform(t => ({
      ...t,
      x: dragRef.current.ox + (e.clientX - dragRef.current.sx),
      y: dragRef.current.oy + (e.clientY - dragRef.current.sy),
    }));
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (drag) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
      if (drag.moved && drag.targetId) {
        const tree2 = parseMarkdown(md);
        if (reparent(tree2, drag.id, drag.targetId)) {
          applyHistory(serializeTree(tree2));
        }
      }
      setDrag(null);
      dragStart.current = null;
      return;
    }
    dragRef.current.active = false;
    try {
      (e.currentTarget as Element).releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  /* ---- 加载（URL 优先于本地缓存） + 自动保存 ---- */
  useEffect(() => {
    const src = parseHash(window.location.hash) ?? readSaved();
    if (src) {
      if (typeof src.md === 'string') setMd(src.md);
      if (src.direction) setDirection(src.direction);
      if (src.themeName) setThemeName(src.themeName);
      if (src.linkStyle) setLinkStyle(src.linkStyle);
      if (src.bgId) setBgId(src.bgId);
      if (typeof src.bgCustom === 'string') setBgCustom(src.bgCustom);
    } else {
      // 首次打开：按当前语言展示文档指南目录示例
      setMd(locale === 'zh' ? DEFAULT_MD.zh : DEFAULT_MD.en);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeSaved({md, direction, themeName, linkStyle, bgId, bgCustom});
  }, [hydrated, md, direction, themeName, linkStyle, bgId, bgCustom]);

  /* 待编辑节点：布局就绪后定位输入框并进入编辑 */
  useEffect(() => {
    if (!pendingEdit) return;
    const n = layout.nodes.find(x => x.id === pendingEdit.id);
    if (!n) return;
    const k = transform.k;
    setEditing({
      id: n.id,
      value: pendingEdit.value,
      sx: transform.x + n.x * k,
      sy: transform.y + n.y * k,
      sw: n.w * k,
      sh: n.h * k,
      isNew: true,
      selectAll: true,
    });
    setPendingEdit(null);
  }, [pendingEdit, layout, transform]);

  /* 全局快捷键：选中节点后用 Tab/Enter/Delete 操作，Ctrl/Cmd+Z 撤销重做 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
        return;
      }
      if (e.altKey) return;
      if (editing) return;
      if (!selected) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        addChildAndEdit(selected);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        addSiblingAndEdit(selected);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeNode(selected);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    selected,
    editing,
    md,
    undo,
    redo,
    addChildAndEdit,
    addSiblingAndEdit,
    removeNode,
  ]);

  const share = useCallback(async () => {
    const hash = buildHash({
      md,
      direction,
      themeName,
      linkStyle,
      bgId,
      bgCustom,
    });
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    try {
      window.history.replaceState(null, '', hash);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }, [md, direction, themeName, linkStyle, bgId, bgCustom]);

  /* ---- 导出 ---- */
  const buildSvg = (): {xml: string; w: number; h: number} | null => {
    const svg = svgRef.current;
    const b = boundsRef.current;
    if (!svg || b.maxX - b.minX <= 0) return null;
    const pad = 28;
    const w = b.maxX - b.minX + pad * 2;
    const h = b.maxY - b.minY + pad * 2;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    // 导出时移除每个节点上的交互工具（＋/↵/×），只保留导图本身
    clone.querySelectorAll('[class*="nodeTools"]').forEach(el => el.remove());
    clone.setAttribute('width', String(w));
    clone.setAttribute('height', String(h));
    clone.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const vp = clone.querySelector('#viewport') as SVGGElement | null;
    vp?.setAttribute(
      'transform',
      `translate(${pad - b.minX}, ${pad - b.minY})`,
    );
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', '0');
    bg.setAttribute('y', '0');
    bg.setAttribute('width', String(w));
    bg.setAttribute('height', String(h));
    bg.setAttribute('fill', activeBg);
    clone.insertBefore(bg, clone.firstChild);
    const xml = new XMLSerializer().serializeToString(clone);
    return {xml, w, h};
  };

  const download = (filename: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const exportSvg = () => {
    const r = buildSvg();
    if (!r) return;
    const blob = new Blob(
      [`<?xml version="1.0" encoding="UTF-8"?>\n${r.xml}`],
      {
        type: 'image/svg+xml',
      },
    );
    download('mindmap.svg', blob);
  };

  const exportPng = () => {
    const r = buildSvg();
    if (!r) return;
    const blob = new Blob([r.xml], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = r.w * scale;
      canvas.height = r.h * scale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
      }
      URL.revokeObjectURL(url);
      canvas.toBlob(bl => {
        if (bl) download('mindmap.png', bl);
      }, 'image/png');
    };
    img.src = url;
  };

  /* ---- Markdown 文件往返 ---- */
  const exportMd = () => {
    const blob = new Blob([md], {type: 'text/markdown;charset=utf-8'});
    download('mindmap.md', blob);
  };

  const onImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => applyHistory(String(reader.result ?? ''));
    reader.readAsText(file);
    e.target.value = '';
  };

  const t = {
    title: locale === 'zh' ? '思维导图' : 'Mind Map',
    tags:
      locale === 'zh'
        ? [
            '双击编辑',
            '拖拽改层级',
            '折叠展开',
            '多布局',
            '导出图片',
            'URL 分享',
            '自动保存',
            '导入导出',
          ]
        : [
            'Edit',
            'Drag',
            'Collapse',
            'Layouts',
            'Export',
            'Share link',
            'Auto-save',
            'Import/Export',
          ],
    clear: locale === 'zh' ? '清空' : 'Clear',
    undo: locale === 'zh' ? '撤销' : 'Undo',
    redo: locale === 'zh' ? '重做' : 'Redo',
    share: locale === 'zh' ? '复制链接' : 'Copy link',
    copied: locale === 'zh' ? '已复制' : 'Copied',
    fileGroup: locale === 'zh' ? '文件' : 'File',
    importMd: locale === 'zh' ? '导入 .md' : 'Import .md',
    exportMd: locale === 'zh' ? '导出 .md' : 'Export .md',
    placeholder:
      locale === 'zh'
        ? '从模板开始，或输入 Markdown 大纲'
        : 'Start from a template, or type a Markdown outline',
    source: locale === 'zh' ? '大纲编辑' : 'Outline',
    preview: locale === 'zh' ? '实时预览' : 'Live Preview',
    viewGroup: locale === 'zh' ? '查看' : 'View',
    exportGroup: locale === 'zh' ? '导出' : 'Export',
    layoutLabel: locale === 'zh' ? '布局' : 'Layout',
    themeLabel: locale === 'zh' ? '主题' : 'Theme',
    linkLabel: locale === 'zh' ? '连线' : 'Link',
    bgLabel: locale === 'zh' ? '背景' : 'Bg',
    bgCustom: locale === 'zh' ? '自定义' : 'Custom',
    customColor: locale === 'zh' ? '自定义背景颜色' : 'Custom background color',
    zoomIn: locale === 'zh' ? '放大' : 'Zoom in',
    zoomOut: locale === 'zh' ? '缩小' : 'Zoom out',
    fit: locale === 'zh' ? '适应窗口' : 'Fit',
    expandAll: locale === 'zh' ? '展开全部' : 'Expand all',
    collapseAll: locale === 'zh' ? '折叠全部' : 'Collapse all',
    exportSvg: locale === 'zh' ? '导出 SVG' : 'Export SVG',
    exportPng: locale === 'zh' ? '导出 PNG' : 'Export PNG',
    dirRight: locale === 'zh' ? '向右' : 'Right',
    dirLeft: locale === 'zh' ? '向左' : 'Left',
    dirBoth: locale === 'zh' ? '两侧' : 'Both',
    themeFresh: locale === 'zh' ? '清新' : 'Fresh',
    themeDeep: locale === 'zh' ? '深邃' : 'Deep',
    themeVivid: locale === 'zh' ? '活力' : 'Vivid',
    lsSmooth: locale === 'zh' ? '平滑' : 'Smooth',
    lsStraight: locale === 'zh' ? '直线' : 'Straight',
    lsElbow: locale === 'zh' ? '折线' : 'Elbow',
    lsRounded: locale === 'zh' ? '圆角' : 'Rounded',
    searchLabel: locale === 'zh' ? '搜索' : 'Search',
    matchCount: locale === 'zh' ? '匹配' : 'matches',
    prev: locale === 'zh' ? '上一个' : 'Prev',
    next: locale === 'zh' ? '下一个' : 'Next',
    noteTitle: locale === 'zh' ? '节点备注' : 'Node note',
    notePlaceholder:
      locale === 'zh'
        ? '输入备注，回车换行…'
        : 'Type a note, Enter for newline…',
    noteHint:
      locale === 'zh' ? '以「| 」开头写备注' : 'Use “| ” to write notes',
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t.title}</h1>
        <div className={styles.tags}>
          {t.tags.map(tag => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.controlbar}>
        <div className={styles.group}>
          <span className={styles.groupLabel}>{t.viewGroup}</span>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t.layoutLabel}</span>
            <select
              className={styles.select}
              value={direction}
              onChange={e => setDirection(e.target.value as Direction)}
            >
              <option value="right">{t.dirRight}</option>
              <option value="left">{t.dirLeft}</option>
              <option value="both">{t.dirBoth}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t.themeLabel}</span>
            <select
              className={styles.select}
              value={themeName}
              onChange={e => setThemeName(e.target.value as ThemeName)}
            >
              <option value="fresh">{t.themeFresh}</option>
              <option value="deep">{t.themeDeep}</option>
              <option value="vivid">{t.themeVivid}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t.linkLabel}</span>
            <select
              className={styles.select}
              value={linkStyle}
              onChange={e => setLinkStyle(e.target.value as LinkStyle)}
            >
              <option value="smooth">{t.lsSmooth}</option>
              <option value="straight">{t.lsStraight}</option>
              <option value="elbow">{t.lsElbow}</option>
              <option value="rounded">{t.lsRounded}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>{t.bgLabel}</span>
            <select
              className={styles.select}
              value={bgId}
              onChange={e => setBgId(e.target.value as BgId)}
            >
              {BG_PRESETS.map(p => (
                <option key={p.id} value={p.id}>
                  {locale === 'zh' ? p.zh : p.en}
                </option>
              ))}
              <option value="custom">{t.bgCustom}</option>
            </select>
          </label>
          <input
            type="color"
            className={styles.colorInput}
            value={bgCustom}
            onChange={e => {
              setBgCustom(e.target.value);
              setBgId('custom');
            }}
            title={t.customColor}
            aria-label={t.customColor}
          />
        </div>

        <span className={styles.sep} />

        <div className={styles.group}>
          <span className={styles.groupLabel}>{t.exportGroup}</span>
          <button
            className={styles.tbtn}
            onClick={exportSvg}
            title={t.exportSvg}
          >
            SVG
          </button>
          <button
            className={styles.tbtn}
            onClick={exportPng}
            title={t.exportPng}
          >
            PNG
          </button>
        </div>

        <span className={styles.sep} />

        <div className={styles.group}>
          <button
            className={styles.tbtn}
            onClick={() => applyHistory('')}
            title={t.clear}
          >
            {t.clear}
          </button>
        </div>

        <div className={styles.group}>
          <button
            className={styles.tbtn}
            onClick={undo}
            disabled={!canUndo}
            title={t.undo}
            aria-label="undo"
          >
            ↶
          </button>
          <button
            className={styles.tbtn}
            onClick={redo}
            disabled={!canRedo}
            title={t.redo}
            aria-label="redo"
          >
            ↷
          </button>
        </div>

        <span className={styles.sep} />

        <div className={styles.group}>
          <button
            className={`${styles.tbtn} ${copied ? styles.tbtnOn : ''}`}
            onClick={share}
            title={t.share}
          >
            {copied ? t.copied : t.share}
          </button>
        </div>

        <span className={styles.sep} />

        <div className={styles.group}>
          <span className={styles.groupLabel}>{t.fileGroup}</span>
          <button
            className={styles.tbtn}
            onClick={() => fileRef.current?.click()}
            title={t.importMd}
          >
            {t.importMd}
          </button>
          <button className={styles.tbtn} onClick={exportMd} title={t.exportMd}>
            {t.exportMd}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".md,.markdown,.txt,text/markdown,text/plain"
            className={styles.hiddenFile}
            onChange={onImportFile}
          />
        </div>

        <span className={styles.sep} />

        <div className={styles.group}>
          <span className={styles.groupLabel}>{t.searchLabel}</span>
          <input
            className={styles.searchInput}
            type="text"
            value={query}
            placeholder={t.searchLabel}
            onChange={e => {
              setQuery(e.target.value);
              setActiveMatch(0);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                gotoMatch(activeMatch + (e.shiftKey ? -1 : 1));
              }
            }}
          />
          {query.trim() && (
            <>
              <span className={styles.matchCount}>
                {matchedList.length} {t.matchCount}
              </span>
              <button
                className={styles.tbtn}
                onClick={() => gotoMatch(activeMatch - 1)}
                title={t.prev}
                aria-label={t.prev}
              >
                ↑
              </button>
              <button
                className={styles.tbtn}
                onClick={() => gotoMatch(activeMatch + 1)}
                title={t.next}
                aria-label={t.next}
              >
                ↓
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.pane}>
          <div className={styles.paneHead}>{t.source}</div>
          <textarea
            className={styles.editor}
            value={md}
            spellCheck={false}
            onChange={e => setMd(e.target.value)}
          />
        </section>

        <section className={styles.pane}>
          <div className={styles.paneHead}>
            <span>{t.preview}</span>
          </div>
          <div
            className={styles.map}
            ref={wrapRef}
            style={{
              backgroundColor: activeBg,
              backgroundImage: showDots
                ? 'radial-gradient(circle at 1px 1px, var(--ifm-color-emphasis-300) 1px, transparent 0)'
                : 'none',
              backgroundSize: showDots ? '22px 22px' : 'auto',
            }}
          >
            <div
              className={styles.floatBar}
              onPointerDown={e => e.stopPropagation()}
            >
              <button
                className={styles.tbtn}
                onClick={() => zoomBy(1.2)}
                title={t.zoomIn}
                aria-label="zoom in"
              >
                ＋
              </button>
              <button
                className={styles.tbtn}
                onClick={() => zoomBy(1 / 1.2)}
                title={t.zoomOut}
                aria-label="zoom out"
              >
                －
              </button>
              <button
                className={styles.tbtn}
                onClick={fit}
                title={t.fit}
                aria-label="fit"
              >
                ⤢
              </button>
              <span className={styles.floatSep} />
              <button
                className={styles.tbtn}
                onClick={expandAll}
                title={t.expandAll}
                aria-label="expand all"
              >
                ⤤
              </button>
              <button
                className={styles.tbtn}
                onClick={collapseAll}
                title={t.collapseAll}
                aria-label="collapse all"
              >
                ⤡
              </button>
            </div>
            <svg
              ref={svgRef}
              className={styles.svg}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              <g
                id="viewport"
                transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}
              >
                {layout.links.map(l => (
                  <path
                    key={l.id}
                    d={l.d}
                    fill="none"
                    stroke={theme.link}
                    strokeWidth={2}
                    strokeLinecap="round"
                  />
                ))}
                {layout.nodes.map(n => {
                  const dragged =
                    drag &&
                    (n.id === drag.id || n.id.startsWith(`${drag.id}-`));
                  const highlighted = drag?.targetId === n.id;
                  const searched = query.trim().length > 0;
                  const isMatch = matchedIds.has(n.id);
                  const isActive =
                    searched && matchedList[activeMatch]?.id === n.id;
                  return (
                    <g
                      key={n.id}
                      data-node
                      data-node-id={n.id}
                      className={`${styles.node}${dragged ? ` ${styles.dragging}` : ''}${highlighted ? ` ${styles.highlight}` : ''}${searched && !isMatch ? ` ${styles.dim}` : ''}${isMatch ? ` ${styles.match}` : ''}${isActive ? ` ${styles.matchActive}` : ''}${selected === n.id ? ` ${styles.nodeSelected}` : ''}`}
                      transform={
                        dragged
                          ? `translate(${drag!.dx / transform.k}, ${drag!.dy / transform.k})`
                          : undefined
                      }
                      onPointerDown={e => onNodePointerDown(e, n.id)}
                      onDoubleClick={e => {
                        e.stopPropagation();
                        const k = transform.k;
                        setEditing({
                          id: n.id,
                          value: n.text,
                          sx: transform.x + n.x * k,
                          sy: transform.y + n.y * k,
                          sw: n.w * k,
                          sh: n.h * k,
                        });
                      }}
                    >
                      {n.note && <title>{n.note}</title>}
                      <rect
                        x={n.x}
                        y={n.y}
                        width={n.w}
                        height={n.h}
                        rx={9}
                        ry={9}
                        fill={
                          n.depth === 0
                            ? theme.root
                            : theme.palette[
                                (n.depth - 1) % theme.palette.length
                              ]
                        }
                        stroke={nodeStroke}
                        strokeWidth={1.5}
                      />
                      <text
                        x={n.x + PAD_X}
                        y={n.cy}
                        dominantBaseline="central"
                        fill={n.depth === 0 ? theme.rootText : theme.text}
                        fontSize={FONT_SIZE}
                        fontWeight={n.depth <= 1 ? 700 : 500}
                        fontFamily={FONT_FAMILY}
                      >
                        {n.text}
                      </text>
                      {n.hasChildren &&
                        (() => {
                          const nodeSide = (n.side ?? direction) as Direction;
                          const edge = nodeSide === 'left' ? n.x : n.x + n.w;
                          const stroke =
                            n.depth === 0
                              ? theme.root
                              : theme.palette[
                                  (n.depth - 1) % theme.palette.length
                                ];
                          return (
                            <g
                              className={styles.toggle}
                              onClick={e => {
                                e.stopPropagation();
                                toggle(n.id);
                              }}
                            >
                              <circle
                                cx={edge}
                                cy={n.cy}
                                r={8}
                                fill={toggleBg}
                                stroke={stroke}
                                strokeWidth={1.5}
                              />
                              <line
                                x1={edge - 4}
                                y1={n.cy}
                                x2={edge + 4}
                                y2={n.cy}
                                stroke={stroke}
                                strokeWidth={1.5}
                              />
                              {n.collapsed && (
                                <line
                                  x1={edge}
                                  y1={n.cy - 4}
                                  x2={edge}
                                  y2={n.cy + 4}
                                  stroke={stroke}
                                  strokeWidth={1.5}
                                />
                              )}
                            </g>
                          );
                        })()}
                      {n.note && (
                        <g
                          className={styles.noteBadge}
                          onPointerDown={e => e.stopPropagation()}
                          onClick={e => openNote(n, e)}
                        >
                          <circle
                            cx={n.x + n.w - 9}
                            cy={n.y + 9}
                            r={7}
                            fill={toggleBg}
                            stroke={nodeStroke}
                            strokeWidth={1}
                          />
                          <text
                            x={n.x + n.w - 9}
                            y={n.y + 9.5}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={9}
                            fill={isDark ? '#cbd5e1' : '#475569'}
                          >
                            ✎
                          </text>
                        </g>
                      )}
                      <g
                        className={styles.nodeTools}
                        onPointerDown={e => e.stopPropagation()}
                      >
                        <g
                          className={styles.toolBtn}
                          onClick={e => {
                            e.stopPropagation();
                            addChildAndEdit(n.id);
                          }}
                        >
                          <circle
                            cx={n.x + n.w / 2 - 22}
                            cy={n.y - 14}
                            r={9}
                            fill={toggleBg}
                            stroke={nodeStroke}
                          />
                          <text
                            x={n.x + n.w / 2 - 22}
                            y={n.y - 13}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={13}
                            fill={isDark ? '#cbd5e1' : '#475569'}
                          >
                            ＋
                          </text>
                        </g>
                        <g
                          className={styles.toolBtn}
                          onClick={e => {
                            e.stopPropagation();
                            addSiblingAndEdit(n.id);
                          }}
                        >
                          <circle
                            cx={n.x + n.w / 2}
                            cy={n.y - 14}
                            r={9}
                            fill={toggleBg}
                            stroke={nodeStroke}
                          />
                          <text
                            x={n.x + n.w / 2}
                            y={n.y - 13}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={12}
                            fill={isDark ? '#cbd5e1' : '#475569'}
                          >
                            ↵
                          </text>
                        </g>
                        <g
                          className={styles.toolBtn}
                          onClick={e => {
                            e.stopPropagation();
                            removeNode(n.id);
                          }}
                        >
                          <circle
                            cx={n.x + n.w / 2 + 22}
                            cy={n.y - 14}
                            r={9}
                            fill={toggleBg}
                            stroke={nodeStroke}
                          />
                          <text
                            x={n.x + n.w / 2 + 22}
                            y={n.y - 13}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={13}
                            fill={isDark ? '#cbd5e1' : '#475569'}
                          >
                            ×
                          </text>
                        </g>
                      </g>
                    </g>
                  );
                })}
                {drag &&
                  drag.moved &&
                  (() => {
                    const dn = layout.nodes.find(x => x.id === drag!.id);
                    if (!dn) return null;
                    const p = toSvg(drag!.mx, drag!.my);
                    const px = dn.x + dn.w / 2 + drag!.dx / transform.k;
                    const py = dn.cy + drag!.dy / transform.k;
                    return (
                      <path
                        d={`M ${px} ${py} L ${p.x} ${p.y}`}
                        fill="none"
                        stroke={theme.link}
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        strokeLinecap="round"
                      />
                    );
                  })()}
              </g>
            </svg>
            {isEmpty && (
              <div className={styles.placeholder}>{t.placeholder}</div>
            )}
            {editing && (
              <input
                className={styles.nodeInput}
                style={{
                  left: editing.sx,
                  top: editing.sy,
                  width: editing.sw,
                  height: editing.sh,
                }}
                value={editing.value}
                autoFocus
                spellCheck={false}
                onChange={e => setEditing({...editing!, value: e.target.value})}
                onFocus={e => {
                  if (editing?.selectAll) e.currentTarget.select();
                }}
                onKeyDown={e => {
                  if (!editing) return;
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applyAddSibling(editing.id, editing.value);
                  } else if (e.key === 'Tab') {
                    e.preventDefault();
                    applyAddChild(editing.id, editing.value);
                  } else if (e.key === 'Escape') {
                    e.preventDefault();
                    cancelEdit();
                  } else if (e.key === 'Backspace' && editing.value === '') {
                    e.preventDefault();
                    const parent = findParent(parseMarkdown(md), editing.id);
                    cancelEdit();
                    setSelected(parent ? parent.id : '');
                  }
                }}
                onBlur={commitEdit}
              />
            )}
            {noteView && (
              <div
                className={styles.noteCard}
                style={{
                  left: noteView.sx,
                  top: noteView.sy + noteView.sh + 8,
                  width: Math.max(noteView.sw, 220),
                }}
              >
                <div className={styles.noteHead}>
                  <span>{t.noteTitle}</span>
                  <button
                    className={styles.noteClose}
                    onClick={() => setNoteView(null)}
                    aria-label="close"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  className={styles.noteArea}
                  value={noteView.value}
                  placeholder={t.notePlaceholder}
                  spellCheck={false}
                  autoFocus
                  onChange={e => onNoteChange(e.target.value)}
                />
                <div className={styles.noteFoot}>{t.noteHint}</div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function MindMapPage() {
  return (
    <Layout title="思维导图" description="Markdown 实时思维导图">
      <MindMapInner />
    </Layout>
  );
}
