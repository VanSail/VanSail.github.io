import ParticleTitle from '../ParticleTitle';
import {type CSSProperties} from 'react';
import useChromaGrid from '../Catalog/useChromaGrid';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

import {tools, toolPath} from '../../lib/tools';

export default function ToolsHero({english}: {english: boolean}) {
  const grid = useChromaGrid();
  return (
    <section
      className={styles.hero}
      aria-label={english ? 'Online tools' : '在线工具'}
    >
      <header className={styles.heading}>
        <ParticleTitle text={english ? 'Online tools' : '在线工具'} />
        <p>
          {english
            ? 'Debug devices and try AI models in your browser.'
            : '在浏览器里调试设备、体验 AI 模型。'}
        </p>
      </header>
      <div className={styles.grid} ref={grid}>
        {tools.map(tool => {
          const name = english ? tool.en : tool.zh;
          const text = english ? tool.descEn : tool.descZh;
          const src = `/img/tools/${tool.id}-${english ? 'en' : 'zh'}.webp`;
          return (
            <Link
              key={tool.id}
              to={toolPath(tool.id)}
              className={styles.card}
              data-chroma-card=""
              style={
                {
                  '--accent': tool.accent,
                  '--accent-soft': tool.soft,
                } as CSSProperties
              }
            >
              <div className={styles.frame}>
                <img
                  className={styles.base}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width="1080"
                  height="720"
                />
                <img
                  className={styles.reveal}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width="1080"
                  height="720"
                />
                <span className={styles.borderGlow} aria-hidden="true" />
                <span className={styles.bottomGlow} aria-hidden="true" />
              </div>
              <div className={styles.info}>
                <div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
