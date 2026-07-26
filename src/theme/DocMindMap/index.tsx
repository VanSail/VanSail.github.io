import {useMemo, useState, type CSSProperties} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import {useColorMode} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  computeLayout,
  THEMES,
  type TNode,
  type Direction,
  type ThemeName,
} from '../../pages/mindmap';
import styles from './DocMindMap.module.css';

interface TocItem {
  value: string;
  id: string;
  level: number;
  children?: TocItem[];
}

/* 把 Docusaurus 的 toc（嵌套标题树）转成思维导图用的 TNode 树 */
function tocToTree(toc: readonly TocItem[], title: string): TNode {
  const root: TNode = {
    id: 'root',
    text: title || '文档',
    level: 1,
    children: [],
    width: 0,
    display: title || '文档',
  };
  const build = (items: readonly TocItem[] | undefined, parent: TNode) => {
    if (!items) return;
    items.forEach(it => {
      const node: TNode = {
        id: it.id,
        text: it.value,
        level: it.level,
        children: [],
        width: 0,
        display: it.value,
      };
      parent.children.push(node);
      build(it.children, node);
    });
  };
  build(toc, root);
  return root;
}

function MindMapSvg({
  toc,
  title,
  direction,
}: {
  toc: readonly TocItem[];
  title: string;
  direction: Direction;
}) {
  const {colorMode} = useColorMode();
  const isDark = colorMode === 'dark';
  const tree = useMemo(() => tocToTree(toc, title), [toc, title]);
  const layout = useMemo(
    () => computeLayout(tree, new Set<string>(), direction, 'smooth'),
    [tree, direction],
  );
  const theme = THEMES['fresh' as ThemeName][isDark ? 'dark' : 'light'];
  const nodeStroke = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)';
  const b = layout.bounds;
  if (layout.nodes.length === 0) return null;

  const pad = 16;
  const w = b.maxX - b.minX + pad * 2;
  const h = b.maxY - b.minY + pad * 2;

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={styles.svg}
      role="img"
      aria-label={title}
    >
      <g transform={`translate(${-b.minX + pad}, ${-b.minY + pad})`}>
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
          const isRoot = n.id === 'root';
          const fill = isRoot
            ? theme.root
            : theme.palette[(n.depth - 1) % theme.palette.length];
          return (
            <g
              key={n.id}
              className={styles.node}
              onClick={() => !isRoot && go(n.id)}
              style={{cursor: isRoot ? 'default' : 'pointer'}}
            >
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx={9}
                ry={9}
                fill={fill}
                stroke={nodeStroke}
                strokeWidth={1.5}
              />
              <text
                x={n.x + 14}
                y={n.cy}
                dominantBaseline="central"
                fill={isRoot ? theme.rootText : theme.text}
                fontSize={14}
                fontWeight={n.depth <= 1 ? 700 : 500}
                fontFamily={
                  "system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif"
                }
              >
                {n.text}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default function DocMindMap({
  toc,
  title,
  direction = 'right',
  size = 100,
}: {
  toc: readonly TocItem[];
  title: string;
  direction?: Direction;
  size?: number;
}) {
  const {i18n} = useDocusaurusContext();
  const locale: 'zh' | 'en' = i18n.currentLocale === 'en' ? 'en' : 'zh';
  const [open, setOpen] = useState(true);

  const resolvedSize = Math.max(20, Math.min(100, Number(size) || 100));
  const cardStyle: CSSProperties = {};
  const contentStyle: CSSProperties = {
    width: `${resolvedSize}%`,
    ...(resolvedSize < 100 ? {marginLeft: 'auto', marginRight: 'auto'} : {}),
  };

  const label = locale === 'zh' ? '本文导图' : 'Mind map';
  const hint = locale === 'zh' ? '点击节点跳转章节' : 'Click a node to jump';

  return (
    <div className={styles.card} style={cardStyle}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className={styles.title}>
          {label}
          <span className={styles.hint}>{hint}</span>
        </span>
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className={styles.body}>
          <div style={contentStyle}>
            <BrowserOnly>
              {() => (
                <MindMapSvg toc={toc} title={title} direction={direction} />
              )}
            </BrowserOnly>
          </div>
        </div>
      )}
    </div>
  );
}
