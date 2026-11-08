import {useEffect, useRef, useState} from 'react';
import ParticleTitle from '../components/ParticleTitle';
import ToolsHero from '../components/ToolsHero';
import DocsCenter from '../components/DocsCenter';
import {galleryItems} from '../lib/galleryItems';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {startGalaxy} from '../lib/galaxy';
import styles from './index.module.css';

export default function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const skipIntro = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const preview = useRef<HTMLDialogElement>(null);
  const project = selected === null ? null : galleryItems[selected];
  const english = useDocusaurusContext().i18n.currentLocale === 'en';
  const description = english
    ? 'A spiral galaxy transforms into a rotating dotted Earth. Drag or use the arrow keys to rotate it. Click or press Enter for a pulse. Scroll to explore the photo globe; press Enter to open its front photo.'
    : '螺旋星系逐渐化为自转的点阵地球。拖动或使用方向键旋转球体，点击或按回车键触发脉冲。下滑浏览图片球，按回车可打开前方图片。';

  useEffect(() => {
    if (!canvas.current || !stage.current || !skipIntro.current) return;
    const root = document.documentElement;
    const lock =
      window.scrollY < 2 &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (lock) root.setAttribute('data-galaxy-intro', '');
    const unlock = () => root.removeAttribute('data-galaxy-intro');
    const stop = startGalaxy(
      canvas.current,
      stage.current,
      skipIntro.current,
      setSelected,
      unlock,
    );
    if (!stop) unlock();
    return () => {
      unlock();
      stop?.();
    };
  }, []);

  useEffect(() => {
    const screen = stage.current;
    if (!screen) return;
    let previousWheel = -Infinity;
    let direction = 0;
    let destination = 0;
    const pageWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        !event.deltaY ||
        Math.abs(event.deltaX) >= Math.abs(event.deltaY) ||
        document.querySelector('dialog[open]') ||
        (event.target instanceof Element &&
          event.target.closest('nav, input, textarea, select, [role="dialog"]'))
      )
        return;
      event.preventDefault();
      if (document.documentElement.hasAttribute('data-galaxy-intro')) return;
      const now = performance.now();
      const step = Math.sign(event.deltaY);
      const sameGesture = now - previousWheel < 180 && step === direction;
      const inFlight = now - previousWheel < 650;
      previousWheel = now;
      direction = step;
      if (sameGesture) return;
      const height = screen.clientHeight;
      const current = inFlight
        ? destination
        : Math.round(window.scrollY / height);
      destination = Math.min(3, Math.max(0, current + step));
      window.scrollTo({
        top: destination * height,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    };
    window.addEventListener('wheel', pageWheel, {passive: false});
    return () => window.removeEventListener('wheel', pageWheel);
  }, []);

  useEffect(() => {
    if (project) preview.current?.showModal();
    else preview.current?.close();
  }, [project]);

  return (
    <Layout noFooter description={description}>
      <main>
        <div className={styles.scene}>
          <div className={styles.stage} ref={stage}>
            <canvas
              ref={canvas}
              aria-label={description}
              role="img"
              tabIndex={-1}
            />
            <button type="button" ref={skipIntro} className={styles.skipIntro}>
              {english ? 'Skip' : '跳过'}
            </button>
            <section className={styles.intro} inert>
              <ParticleTitle
                as="h1"
                text={english ? 'Open Source Picks' : '开源精选'}
              />
            </section>
            <div data-gallery-area aria-hidden="true" />
          </div>
        </div>
        <DocsCenter english={english} />
        <ToolsHero english={english} />
        <dialog
          ref={preview}
          className={styles.details}
          aria-label={project?.name}
          onClose={() => setSelected(null)}
          onClick={e => {
            if (e.target === e.currentTarget) preview.current?.close();
          }}
        >
          {project && (
            <article>
              <img loading="lazy" src={project.src} alt={project.name} />
              <h2>{project.name}</h2>
              <p>{english ? project.en : project.zh}</p>
              <ul>
                {project.features.map(f => (
                  <li key={f.en}>{english ? f.en : f.zh}</li>
                ))}
              </ul>
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {english ? 'GitHub project' : 'GitHub 项目'} ↗
              </a>
            </article>
          )}
          <button
            aria-label={english ? 'Close' : '关闭'}
            onClick={() => preview.current?.close()}
          >
            ×
          </button>
        </dialog>
      </main>
    </Layout>
  );
}
