import {useState, type CSSProperties} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useChromaGrid from './useChromaGrid';
import chroma from '../ToolsHero/styles.module.css';
import styles from './styles.module.css';

const products = [
  {name: ['示例产品 A', 'Sample product A'], image: 'lake'},
  {name: ['示例产品 B', 'Sample product B'], image: 'alpine'},
  {name: ['示例产品 C', 'Sample product C'], image: 'forest'},
];
const tiles = [
  'forest',
  'lake',
  'alpine',
  'lake',
  'alpine',
  'forest',
  'alpine',
  'forest',
  'lake',
];
function trackSizes(position: number | null) {
  return [0, 1, 2]
    .map(index => {
      const distance = position === null ? Infinity : index + 0.5 - position;
      return `minmax(0,${1 + 2 * Math.exp(-3 * distance * distance)}fr)`;
    })
    .join(' ');
}
export default function Catalog({docs}: {docs: boolean}) {
  const en = useDocusaurusContext().i18n.currentLocale === 'en';
  const title = docs
    ? en
      ? 'Documentation'
      : '文档中心'
    : en
      ? 'Products'
      : '产品中心';
  const [active, setActive] = useState(0);
  const [point, setPoint] = useState<{x: number; y: number} | null>(null);
  const grid = useChromaGrid();
  const language = en ? 1 : 0;
  return (
    <Layout title={title}>
      <main className={styles.main}>
        <h1 className={styles.visuallyHidden}>{title}</h1>
        <section aria-label={en ? 'Latest products' : '最近发布'}>
          <div className={styles.gallery}>
            {products.map((t, i) => (
              <article
                key={t.image}
                data-active={active === i}
                onMouseEnter={() => setActive(i)}
              >
                <img src={'/img/landscapes/' + t.image + '.webp'} alt="" />
                <button
                  aria-expanded={active === i}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  {t.name[language]}
                </button>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2>
            {docs
              ? en
                ? 'All documentation'
                : '所有文档'
              : en
                ? 'All products'
                : '所有产品'}
          </h2>
          <div className={styles.grid} ref={grid}>
            {products.map(item => {
              const src = '/img/landscapes/' + item.image + '.webp';
              return (
                <article
                  key={item.image}
                  data-chroma-card=""
                  className={chroma.card}
                  style={
                    {
                      '--accent': '#91caff',
                      '--accent-soft': '#91caff80',
                    } as CSSProperties
                  }
                >
                  <div className={chroma.frame}>
                    <img
                      className={chroma.base}
                      src={src}
                      alt=""
                      loading="lazy"
                    />
                    <img
                      className={chroma.reveal}
                      src={src}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className={chroma.info}>
                    <div>
                      <h3>
                        {item.name[language]}
                        {docs ? (en ? ' documentation' : ' 文档') : ''}
                      </h3>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        {
          <section>
            <h2>
              {docs
                ? en
                  ? 'Knowledge cards'
                  : '知识卡片'
                : en
                  ? 'Open source projects'
                  : '开源项目'}
            </h2>
            <div
              className={styles.notes}
              style={{
                gridTemplateColumns: trackSizes(point?.x ?? null),
                gridTemplateRows: trackSizes(point?.y ?? null),
              }}
              onPointerMove={event => {
                if (event.pointerType === 'touch') return;
                const rect = event.currentTarget.getBoundingClientRect();
                setPoint({
                  x: (3 * (event.clientX - rect.left)) / rect.width,
                  y: (3 * (event.clientY - rect.top)) / rect.height,
                });
              }}
              onPointerLeave={() => setPoint(null)}
              onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget))
                  setPoint(null);
              }}
            >
              {tiles.map((image, i) => {
                const center = () =>
                  setPoint({x: (i % 3) + 0.5, y: Math.floor(i / 3) + 0.5});
                const letter = String.fromCharCode(65 + i);
                return (
                  <button
                    key={letter}
                    onFocus={center}
                    onClick={center}
                    onKeyDown={event => {
                      if (event.key === 'Escape') setPoint(null);
                    }}
                  >
                    <img
                      src={'/img/landscapes/' + image + '.webp'}
                      alt=""
                      loading="lazy"
                    />
                    <span>
                      {docs
                        ? en
                          ? 'Knowledge topic'
                          : '知识主题'
                        : en
                          ? 'Sample project'
                          : '示例项目'}{' '}
                      {letter}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        }
      </main>
    </Layout>
  );
}
