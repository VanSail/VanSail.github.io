import ParticleTitle from '../ParticleTitle';
import {useEffect, useRef} from 'react';
import Link from '@docusaurus/Link';
import {drawTrail, duration} from './trail';
import styles from './styles.module.css';

export default function DocsCenter({english}: {english: boolean}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const surface = canvas.current;
    const ctx = surface?.getContext('2d');
    if (!surface || !ctx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let elapsed = 0,
      previous = 0,
      frame = 0,
      visible = false;
    function tick(time: number) {
      frame = 0;
      if (previous)
        elapsed = (elapsed + (time - previous) / 1000) % (duration + 1.2);
      previous = time;
      drawTrail(ctx!, Math.min(elapsed, duration));
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      previous = 0;
      if (motion.matches) {
        elapsed = duration;
        drawTrail(ctx!, duration);
        return;
      }
      if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function preference() {
      elapsed = 0;
      sync();
    }
    drawTrail(ctx, 0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.intersectionRatio >= 0.5;
        sync();
      },
      {threshold: [0, 0.5]},
    );
    observer.observe(surface);
    motion.addEventListener('change', preference);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  return (
    <section className={styles.screen}>
      <div className={styles.copy}>
        <ParticleTitle text={english ? 'Docs Center' : '文档中心'} />
        <p>
          {english ? 'Open hardware, open docs.' : '硬件开源，文档也开源。'}
          <br />
          {english
            ? 'Write down the steps you tested, and leave a note for whoever comes next.'
            : '写下你验证过的步骤，把踩过的坑告诉下一个人。'}
        </p>
        <div className={styles.links}>
          <Link to="/docs/">{english ? 'Docs Syntax' : '文档语法'}</Link>
          <Link to="/join/">{english ? 'Contribution guide' : '贡献指南'}</Link>
        </div>
      </div>
      <div className={styles.scene}>
        <canvas
          ref={canvas}
          width={320}
          height={176}
          role="img"
          aria-label={
            english
              ? 'A runner trips and leaves a warning. The next jumps over the stone; a third repairs the path so the first runner can pass safely.'
              : '第一个人绊倒后立下提示牌，第二个人看见后跳过石板，第三个人把路修平。第一个人再次经过，顺利通过。'
          }
        />
      </div>
    </section>
  );
}
