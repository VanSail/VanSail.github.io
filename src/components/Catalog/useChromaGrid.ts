import {useEffect, useRef} from 'react';
export default function useChromaGrid() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = grid.current;
    if (!root) return;
    // 触屏与减少动效偏好下直接显示彩色卡片，由 CSS 静态降级处理。
    if (
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      matchMedia('(hover: none)').matches
    )
      return;

    const cards = Array.from(
      root.querySelectorAll<HTMLElement>('[data-chroma-card]'),
    ).map(el => ({el, x: 0, y: 0, tx: 0, ty: 0, active: false, seen: false}));
    let frame = 0;

    // damping ≈ 0.45：每帧向光标位置靠近 55%，形成平滑拖尾。
    const paint = () => {
      frame = 0;
      let moving = false;
      for (const c of cards) {
        if (!c.active) continue;
        c.x += (c.tx - c.x) * 0.55;
        c.y += (c.ty - c.y) * 0.55;
        c.el.style.setProperty('--chroma-x', `${c.x}px`);
        c.el.style.setProperty('--chroma-y', `${c.y}px`);
        if (Math.abs(c.tx - c.x) > 0.5 || Math.abs(c.ty - c.y) > 0.5)
          moving = true;
      }
      if (moving) frame = requestAnimationFrame(paint);
    };

    const fadeOut = (card: {el: HTMLElement; active: boolean}) => {
      card.active = false;
      card.el.style.setProperty('--chroma-opacity', '0');
    };

    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>(
        '[data-chroma-card]',
      );
      if (!el || !root.contains(el)) {
        cards.forEach(fadeOut);
        return;
      }
      const rect = el.getBoundingClientRect();
      for (const c of cards) {
        if (c.el !== el) {
          if (c.active) fadeOut(c);
          continue;
        }
        c.tx = event.clientX - rect.left;
        c.ty = event.clientY - rect.top;
        if (!c.seen) {
          c.x = c.tx;
          c.y = c.ty;
          c.seen = true;
        }
        c.active = true;
        c.el.style.setProperty('--chroma-x', `${c.x}px`);
        c.el.style.setProperty('--chroma-y', `${c.y}px`);
        c.el.style.setProperty('--chroma-opacity', '1');
      }
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      cards.forEach(fadeOut);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    root.addEventListener('pointermove', onMove, {passive: true});
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return grid;
}
