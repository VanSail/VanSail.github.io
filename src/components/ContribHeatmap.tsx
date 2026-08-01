import React, {useEffect, useMemo, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './ContribHeatmap.module.css';

// ── Types ──────────────────────────────────────────────
// 数据源为构建时抓取并写入 static/contrib-data.json 的本地静态文件
// （脚本 scripts/fetch-contrib.mjs 负责生成，避免运行时依赖第三方 API）。
interface FlatDay {
  date: string; // 'YYYY-MM-DD'
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
type ApiResponse = {contributions: FlatDay[]};

// Normalised cell for rendering
interface Cell {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface MonthLabel {
  col: number;
  label: string;
}

// ── Constants ──────────────────────────────────────────
const CELL = 11;
const GAP = 3;
const RADIUS = 2;
const PAD_L = 34;
const PAD_T = 22;
const PAD_R = 20;
const PAD_B = 12;

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Warm gradient: near-black → brand orange
const COLORS = [
  '#1a1714', // Level 0 — near-black
  '#2e2017', // Level 1 — deep warm brown
  '#6b3723', // Level 2 — warm terracotta
  '#c45f33', // Level 3 — copper orange
  '#f0a070', // Level 4 — brand warm orange
];

// ── Helpers ────────────────────────────────────────────
// 将扁平的按日数据转换为网格：grid[dayOfWeek][week]，dayOfWeek 0=Sun…6=Sat
function parseApiData(days: FlatDay[]): {
  grid: (Cell | null)[][];
  monthLabels: MonthLabel[];
  numWeeks: number;
} {
  if (!days.length) return {grid: [], monthLabels: [], numWeeks: 0};

  const first = new Date(days[0].date + 'T00:00:00');
  if (isNaN(first.getTime())) return {grid: [], monthLabels: [], numWeeks: 0};

  // 网格起点 = 第一天所在周的周日（让第一列从周日开始对齐）
  const start = new Date(first);
  start.setDate(start.getDate() - first.getDay());
  start.setHours(0, 0, 0, 0);

  const grid: (Cell | null)[][] = Array.from(
    {length: 7},
    () => [] as (Cell | null)[],
  );
  const monthLabels: MonthLabel[] = [];
  let lastMonth = -1;
  let maxCol = 0;

  for (const d of days) {
    const date = new Date(d.date + 'T00:00:00');
    if (isNaN(date.getTime())) continue;

    const dow = date.getDay(); // 0 = Sun
    const diffDays = Math.round((date.getTime() - start.getTime()) / 86400000);
    const col = Math.floor(diffDays / 7);
    if (col > maxCol) maxCol = col;

    // 保证该行列连续（中间不出现空洞）
    while (grid[dow].length <= col) grid[dow].push(null);
    grid[dow][col] = {date: d.date, count: d.count, level: d.level};

    const m = date.getMonth();
    if (m !== lastMonth) {
      monthLabels.push({col, label: MONTHS[m]});
      lastMonth = m;
    }
  }

  // 每行补齐到相同周数，保证渲染列对齐
  const numWeeks = maxCol + 1;
  for (const row of grid) {
    while (row.length < numWeeks) row.push(null);
  }

  return {grid, monthLabels, numWeeks};
}

// ── Sub-components ─────────────────────────────────────
function Skeleton() {
  const cols = 53;
  const rows = 7;
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${PAD_L + cols * (CELL + GAP) - GAP + PAD_R} ${PAD_T + rows * (CELL + GAP) - GAP + PAD_B}`}
          aria-hidden="true"
        >
          {Array.from({length: rows}, (_, r) =>
            Array.from({length: cols}, (_, c) => (
              <rect
                key={`s-${r}-${c}`}
                x={PAD_L + c * (CELL + GAP)}
                y={PAD_T + r * (CELL + GAP)}
                width={CELL}
                height={CELL}
                rx={RADIUS}
                className={styles.skelCell}
              />
            )),
          )}
        </svg>
      </div>
    </div>
  );
}

function ErrorFallback() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.errorCard}>
        <svg
          className={styles.errorIcon}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        <span className={styles.errorText}>
          Unable to load contribution data.{' '}
          <a
            href="https://github.com/VanSail"
            target="_blank"
            rel="noreferrer"
            className={styles.errorLink}
          >
            View on GitHub →
          </a>
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────
export default function ContribHeatmap(): React.JSX.Element {
  const dataUrl = useBaseUrl('/contrib-data.json');
  const [grid, setGrid] = useState<(Cell | null)[][]>([]);
  const [monthLabels, setMonthLabels] = useState<MonthLabel[]>([]);
  const [numWeeks, setNumWeeks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const resp = await fetch(dataUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const json: ApiResponse = await resp.json();
        if (!cancelled) {
          const result = parseApiData(json.contributions ?? []);
          setGrid(result.grid);
          setMonthLabels(result.monthLabels);
          setNumWeeks(result.numWeeks);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  if (loading) return <Skeleton />;
  if (error) return <ErrorFallback />;

  const svgW = PAD_L + numWeeks * (CELL + GAP) - GAP + PAD_R;
  const svgH = PAD_T + 7 * (CELL + GAP) - GAP + PAD_B;

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollContainer}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${svgW} ${svgH}`}
          role="img"
          aria-label="GitHub contribution graph"
        >
          {/* Month labels */}
          {monthLabels.map(({col, label}) => (
            <text
              key={`m-${col}`}
              x={PAD_L + col * (CELL + GAP)}
              y={PAD_T - 7}
              className={styles.monthLabel}
            >
              {label}
            </text>
          ))}

          {/* Weekday labels */}
          {DAY_LABELS.map((label, i) =>
            label ? (
              <text
                key={`d-${i}`}
                x={PAD_L - 7}
                y={PAD_T + i * (CELL + GAP) + CELL - 2}
                className={styles.dayLabel}
                textAnchor="end"
              >
                {label}
              </text>
            ) : null,
          )}

          {/* Cells */}
          {grid.map((row, dow) =>
            row.map((cell, week) => {
              const level = cell?.level ?? 0;
              const color = COLORS[level];
              return (
                <rect
                  key={`${dow}-${week}`}
                  x={PAD_L + week * (CELL + GAP)}
                  y={PAD_T + dow * (CELL + GAP)}
                  width={CELL}
                  height={CELL}
                  rx={RADIUS}
                  fill={color}
                  className={styles.cell}
                  data-level={level}
                >
                  {cell && (
                    <title>
                      {cell.count} contribution{cell.count !== 1 ? 's' : ''} on{' '}
                      {cell.date}
                    </title>
                  )}
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      {/* Legend row */}
      <div className={styles.legendRow}>
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          {COLORS.map((c, i) => (
            <svg
              key={i}
              width={CELL}
              height={CELL}
              className={styles.legendSwatch}
            >
              <rect width={CELL} height={CELL} rx={RADIUS} fill={c} />
            </svg>
          ))}
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>
    </div>
  );
}
