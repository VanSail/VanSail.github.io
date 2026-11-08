import {useEffect, useRef} from 'react';
import styles from './styles.module.css';

export default function ParticleTitle({
  text,
  as: Heading = 'h2',
}: {
  text: string;
  as?: 'h1' | 'h2';
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d', {willReadFrequently: true});
    if (!canvas || !ctx) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let points: {
      x: number;
      y: number;
      dx: number;
      dy: number;
      color: string;
    }[] = [];
    let frame = 0;
    let pointer: {x: number; y: number} | null = null;
    const colors = ['#8fffd5', '#82c9ff', '#ecaceb', '#b4a2ff'];
    function paint() {
      frame = 0;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      let moving = false;
      for (const p of points) {
        const x = p.x - (pointer?.x ?? Infinity),
          y = p.y - (pointer?.y ?? Infinity);
        const distance = Math.hypot(x, y);
        const force = Math.max(0, 1 - distance / 32) * 20;
        const tx = force ? (force * x) / Math.max(distance, 0.1) : 0;
        const ty = force ? (force * y) / Math.max(distance, 0.1) : 0;
        p.dx += (tx - p.dx) * 0.15;
        p.dy += (ty - p.dy) * 0.15;
        moving ||= Math.abs(tx - p.dx) + Math.abs(ty - p.dy) > 0.05;
        ctx!.fillStyle = p.color;
        ctx!.fillRect(p.x + p.dx, p.y + p.dy, 1.55, 1.55);
      }
      if (moving) frame = requestAnimationFrame(paint);
    }
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      pointer = null;
      delete canvas!.dataset.ready;
      if (motion.matches) return;
      const w = canvas!.clientWidth,
        h = canvas!.clientHeight;
      if (!w || !h) return;
      canvas!.width = w;
      canvas!.height = h;
      ctx!.font =
        getComputedStyle(canvas!).fontWeight +
        ' ' +
        getComputedStyle(canvas!).fontSize +
        ' ' +
        getComputedStyle(canvas!).fontFamily;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillText(text, w / 2, h / 2, w);
      const mask = ctx!.getImageData(0, 0, w, h).data;
      points = [];
      for (let y = 0; y < h; y += 2)
        for (let x = 0; x < w; x += 2) {
          if (mask[(y * w + x) * 4 + 3] > 70)
            points.push({
              x,
              y,
              dx: 0,
              dy: 0,
              color: colors[(x / 2 + (3 * y) / 2) % colors.length],
            });
        }
      if (!points.length) return;
      const ratio = Math.min(devicePixelRatio, 2);
      canvas!.width = Math.round(w * ratio);
      canvas!.height = Math.round(h * ratio);
      ctx!.scale(ratio, ratio);
      paint();
      canvas!.dataset.ready = 'true';
    }
    function move(e: PointerEvent) {
      if (motion.matches) return;
      const box = canvas!.getBoundingClientRect();
      pointer = {x: e.clientX - box.left, y: e.clientY - box.top};
      if (!frame) paint();
    }
    function leave() {
      pointer = null;
      if (!motion.matches && !frame) paint();
    }
    const observer = new ResizeObserver(reset);
    observer.observe(canvas);
    reset();
    const surface =
      Heading === 'h1'
        ? (canvas.closest('section')?.parentElement ?? canvas)
        : canvas;
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', leave);
    motion.addEventListener('change', reset);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', reset);
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', leave);
      delete canvas.dataset.ready;
    };
  }, [text, Heading]);
  return (
    <Heading className={styles.title}>
      <canvas ref={ref} aria-hidden="true" />
      <span>{text}</span>
    </Heading>
  );
}
