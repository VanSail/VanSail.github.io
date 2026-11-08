/* 思维导图布局核心：从旧站 mindmap 页面抽取的最小库（测量/主题/布局算法）。
 * 供 src/theme/DocMindMap 使用，与独立 mindmap 页面无依赖。 */

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

let measureCtx: CanvasRenderingContext2D | null = null;
function getCtx(): CanvasRenderingContext2D | null {
  if (measureCtx) return measureCtx;
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  measureCtx = c.getContext('2d');
  return measureCtx;
}

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
