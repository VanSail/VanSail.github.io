import {galleryItems} from './galleryItems';
import landRows from './landRows.json';

const TAU = Math.PI * 2;
// Natural Earth 1:110m land polygons, sampled every two degrees of latitude.
function landPoints() {
  return landRows.flatMap((runs, row) => {
    const latitude = ((2 * row - 89) * Math.PI) / 180;
    const ring = Math.cos(latitude);
    const columns = Math.round(180 * ring);
    const points = [];
    for (let i = 0; i < runs.length; i += 2) {
      for (let column = runs[i]; column < runs[i + 1]; column++) {
        const longitude = ((column + 0.5) / columns - 0.5) * TAU;
        points.push({
          x: ring * Math.sin(longitude),
          y: -Math.sin(latitude),
          z: ring * Math.cos(longitude),
        });
      }
    }
    return points;
  });
}
const duration = 5.6;
const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

function createStars() {
  let seed = 113;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const land = landPoints();
  return Array.from({length: Math.max(4200, land.length)}, (_, i) => {
    const radius = Math.pow(random(), 0.7);
    const angle =
      ((i % 3) * TAU) / 3 +
      radius * 6.8 +
      (random() - 0.5) * (random() < 0.8 ? 0.55 : 2.4);
    const target = land[i];
    return {
      radius,
      angle,
      height: (random() - 0.5) * (0.065 + 0.12 * (1 - radius) ** 4),
      x: target?.x ?? 0,
      y: target?.y ?? 0,
      z: target?.z ?? 0,
      isLand: Boolean(target),
      size: 0.4 + random() ** 4 * 1.65,
      color: ['#a395ed', '#d4caff', '#a3b6f4', '#ead6fd'][i % 4],
      screenX: 0,
      screenY: 0,
      depth: 0,
    };
  });
}

export function startGalaxy(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  skipIntro: HTMLButtonElement,
  openPhoto: (index: number | null) => void,
  onIntroComplete: () => void,
) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const ctx = context;
  const stars = createStars();
  const shell = stars.filter(star => star.isLand);

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const options = {signal: listeners.signal};
  let width = 0,
    height = 0,
    radius = 0;
  let frame = 0,
    last = 0,
    elapsed = motion.matches ? duration : 0;
  let yaw = -1.55,
    pitch = -0.35,
    inertia = 0;
  let rotating = false;
  let pointer: number | null = null;
  let px = 0,
    py = 0,
    travel = 0;
  let pulse: {x: number; y: number; z: number; age: number} | null = null;
  const images = galleryItems.map(() => {
    const image = new Image();
    image.onload = schedule;
    return image;
  });
  let photosRequested = false;
  const count = galleryItems.length;
  let formationTime = 0;
  const photos = galleryItems.map((_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const phase = i * Math.PI * (3 - Math.sqrt(5));
    const ring = Math.sqrt(1 - y * y);
    return {
      x: ring * Math.cos(phase),
      y,
      z: ring * Math.sin(phase),
      slot: i,
      index: i,
      sx: 0,
      sy: 0,
      side: 0,
      depth: 0,
    };
  });
  // Each patch of land stays attached to the same photo as the sphere unfolds.
  const patches = shell.map(point =>
    photos.reduce((nearest, card) => {
      const dot = (anchor: typeof card) =>
        point.x * anchor.x + point.y * anchor.y + point.z * anchor.z;
      return dot(card) > dot(nearest) ? card : nearest;
    }),
  );
  const section = stage.querySelector('section');
  let targetScroll = 0;
  let scroll = 0,
    cx = 0,
    centerY = 0;
  let hover: {x: number; y: number} | null = null;
  const photoAt = (x: number, y: number) =>
    photos
      .slice()
      .reverse()
      .find(
        card =>
          Math.max(Math.abs(x - card.sx), Math.abs(y - card.sy)) <=
          card.side / 2,
      );
  function updateScroll() {
    const scene = stage.parentElement!;
    targetScroll = Math.max(
      0,
      Math.min(
        1,
        -scene.getBoundingClientRect().top /
          Math.max(1, scene.offsetHeight - height),
      ),
    );
    schedule();
  }
  window.addEventListener('scroll', updateScroll, {
    passive: true,
    signal: listeners.signal,
  });
  const onGlobe = (x: number, y: number) =>
    (scroll > 0.9 && Boolean(photoAt(x, y))) ||
    (elapsed >= duration &&
      Math.hypot(x - cx, y - centerY) <= radius * (scroll > 0.9 ? 1.2 : 1));
  const galleryArea = stage.querySelector<HTMLElement>('[data-gallery-area]')!;
  let galleryX = 0,
    galleryY = 0,
    galleryRadius = 0,
    extentX = 0,
    extentY = 0,
    stageVisible = true;
  function resize() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    galleryX = galleryArea.offsetLeft + galleryArea.offsetWidth / 2;
    galleryY = galleryArea.offsetTop + galleryArea.offsetHeight / 2;
    galleryRadius =
      Math.min(galleryArea.offsetWidth, galleryArea.offsetHeight) * 0.45;
    // 缓存布局尺寸：draw() 每帧只读，避免写后读触发强制同步重排
    extentX = galleryArea.offsetWidth * 0.44;
    extentY = galleryArea.offsetHeight * 0.43;
    updateScroll();
    const dpr = Math.min(devicePixelRatio, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    schedule();
  }
  function draw(now: number) {
    frame = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.06) : 0;
    last = now;
    // A trackpad and a notched wheel drive the same camera timeline.
    scroll +=
      (targetScroll - scroll) * (motion.matches ? 1 : -Math.expm1(-10 * dt));
    if (Math.abs(targetScroll - scroll) < 0.0003) scroll = targetScroll;
    const travel = ease(scroll / 0.65);
    const reveal = ease((scroll - 0.65) / 0.32);
    if (section) {
      section.style.setProperty('--reveal', String(reveal));
      section.inert = reveal < 0.5;
    }
    const globeRadius = Math.min(width * 0.32, height * 0.255);
    cx = width / 2 + (galleryX - width / 2) * travel;
    centerY = height * 0.53 + (galleryY - height * 0.53) * travel;
    radius = globeRadius + (galleryRadius - globeRadius) * travel;
    elapsed += dt * (1 + 8 * scroll);

    if (!photosRequested && (elapsed >= duration - 1 || targetScroll > 0)) {
      photosRequested = true;
      galleryItems.forEach((item, index) => {
        images[index].src = item.src;
      });
    }
    const morph = ease((elapsed - 2.0) / (duration - 2.0));
    const zoom = 1 + 2.3 * ease((elapsed - 1.05) / 3.8);
    if (
      !motion.matches &&
      pointer === null &&
      !(scroll > 0.9 && hover && photoAt(hover.x, hover.y))
    ) {
      yaw += dt * (0.105 + inertia);
      inertia *= Math.exp(-4 * dt);
    }
    const cy = Math.cos(yaw),
      sy = Math.sin(yaw);
    const cp = Math.cos(pitch),
      sp = Math.sin(pitch);
    const gallery = ease((scroll - 0.31) / 0.6);
    const unfold = ease((scroll - 0.42) / 0.55);
    const cardReveal = ease((scroll - 0.55) / 0.42);
    if (
      scroll > 0.96 &&
      !motion.matches &&
      pointer === null &&
      !(hover && photoAt(hover.x, hover.y))
    )
      formationTime += dt;
    const formation = Math.floor(formationTime / 6) % 4;
    const change = ease(((formationTime % 6) - 4.8) / 1.2);
    const gather = 1 - 0.78 * Math.sin(Math.PI * change);
    const pose = (kind: number, card: (typeof photos)[number]) => {
      const i = card.slot;
      const ring = i % 3;
      const phase =
        (Math.floor(i / 3) * TAU) / Math.ceil((count - ring) / 3) +
        (ring === 1 ? -yaw : yaw);
      const sphereZ = card.z * cy - card.x * sy;
      switch (kind) {
        case 0: {
          const r = 0.49 + ring * 0.22;
          return [
            Math.cos(phase) * extentX * r,
            Math.sin(phase) * extentY * r,
            Math.sin(phase) * 0.55,
          ];
        }
        case 1: {
          const r = 0.34 + 0.63 * Math.sqrt(i / count);
          const a = i * 2.39996 + yaw;
          return [
            Math.cos(a) * extentX * r,
            Math.sin(a) * extentY * r,
            Math.sin(a) * 0.6,
          ];
        }
        case 2:
          return [
            (card.x * cy + card.z * sy) * radius,
            (card.y * cp - sphereZ * sp) * radius,
            sphereZ * cp + card.y * sp,
          ];
        default:
          return [
            (((((i * 0.61803 + yaw * 0.025) % 1) + 1) % 1) - 0.5) * extentX * 2,
            Math.sin(i * 17.7 + yaw * 0.13) * extentY,
            Math.cos(i * 13.7),
          ];
      }
    };
    if (section)
      section.style.setProperty(
        '--reveal',
        String(
          reveal *
            (formation === 2 || formation === 3
              ? change * (formation === 3 ? 1 : 0)
              : formation === 1
                ? 1 - change
                : 1),
        ),
      );
    for (const card of photos) {
      const from = pose(formation, card),
        to = pose((formation + 1) % 4, card);
      const z = card.z * cy - card.x * sy;
      const mix = (a: number, b: number, t: number) => a + (b - a) * t;
      card.depth = mix(from[2], to[2], change);
      card.sx =
        cx +
        mix(
          (card.x * cy + card.z * sy) * radius,
          mix(from[0], to[0], change) * gather,
          unfold,
        );
      card.sy =
        centerY +
        mix(
          (card.y * cp - z * sp) * radius,
          mix(from[1], to[1], change) * gather,
          unfold,
        );
      card.side =
        Math.min(width * 0.104, height * 0.105) *
        (0.77 + card.depth * 0.18) *
        cardReveal;
    }
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(
      cx,
      centerY,
      0,
      cx,
      centerY,
      Math.max(1, radius * 1.55),
    );
    glow.addColorStop(0, 'rgba(105,76,158,' + (0.15 - morph * 0.09) + ')');
    glow.addColorStop(1, 'rgba(36,38,80,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
    const galaxyRadius = Math.min(width * 0.58, height * 0.79) * zoom;
    if (pulse && (pulse.age += dt) > 1.55) pulse = null;
    if (morph > 0 && radius > 0) {
      const ocean = ctx.createRadialGradient(
        cx - radius * 0.28,
        centerY - radius * 0.35,
        0,
        cx,
        centerY,
        radius,
      );
      ocean.addColorStop(0, '#17202e');
      ocean.addColorStop(0.92, '#0b101a');
      ocean.addColorStop(1, '#161e2a');
      ctx.globalAlpha = morph * (1 - gallery);
      ctx.fillStyle = ocean;
      ctx.beginPath();
      ctx.arc(cx, centerY, radius, 0, TAU);
      ctx.fill();
    }
    const visible = morph === 1 ? shell : stars;
    for (let i = 0; i < visible.length && gallery < 1; i++) {
      const s = visible[i];
      const member = s.isLand;
      const blend = member ? morph : 0;
      const z = s.z * cy - s.x * sy;
      const depth = z * cp + s.y * sp;
      const sx = (s.x * cy + s.z * sy) * radius;
      const shellY = (s.y * cp - z * sp) * radius;
      let x = sx,
        y = shellY;
      if (blend < 1) {
        const a = s.angle + elapsed * (0.1 + 0.09 / (0.25 + s.radius));
        const u = Math.cos(a) * s.radius;
        const v = Math.sin(a) * s.radius * 0.42 + s.height;
        x = (u * 0.96 + v * 0.28) * galaxyRadius * (1 - blend) + sx * blend;
        y = (v * 0.96 - u * 0.28) * galaxyRadius * (1 - blend) + shellY * blend;
      }
      if (member && gallery > 0) {
        const card = patches[i];
        const peel = ease((gallery - 0.12 * (1 + card.y)) / 0.76);
        const arc = Math.sin(Math.PI * peel) * 0.32;
        x = x * (1 - peel) + (card.sx - cx) * peel + sx * arc;
        y = y * (1 - peel) + (card.sy - centerY) * peel + shellY * arc;
      }
      s.screenX = cx + x;
      s.screenY = centerY + y;
      s.depth = depth;
      if (blend === 1 && depth <= 0) continue;
      const wave =
        pulse && member
          ? Math.max(
              0,
              1 -
                Math.abs(
                  Math.acos(
                    Math.max(
                      -1,
                      Math.min(
                        1,
                        s.x * pulse.x + s.y * pulse.y + s.z * pulse.z,
                      ),
                    ),
                  ) -
                    pulse.age * 2.3,
                ) /
                  0.26,
            )
          : 0;
      ctx.globalAlpha = Math.min(
        1,
        (member ? 1 : 1 - morph) *
          ((1 - blend) * 0.72 + blend * (depth > 0 ? 0.6 + 0.38 * depth : 0)) +
          wave * 0.5,
      );
      ctx.globalAlpha *= 1 - ease((gallery - 0.48) / 0.52);
      ctx.fillStyle =
        blend > 0.5 ? '#ffffff' : s.radius < 0.15 ? '#fff3ef' : s.color;
      const size =
        (s.size * (1 - blend) + radius * 0.006 * blend) * (1 + wave * 0.8);
      ctx.beginPath();
      ctx.arc(s.screenX, s.screenY, size, 0, TAU);
      ctx.fill();
    }
    if (cardReveal > 0) {
      photos.sort((a, b) => a.depth - b.depth);
      const active =
        scroll > 0.9 && hover ? photoAt(hover.x, hover.y) : undefined;
      for (const card of photos) {
        const image = images[card.index];
        if (!image.naturalWidth) continue;
        const side = card.side * (active === card ? 1.16 : 1);
        const crop = Math.min(image.naturalWidth, image.naturalHeight);
        ctx.save();
        ctx.globalAlpha = cardReveal * (0.86 + 0.14 * card.depth);
        ctx.beginPath();
        const rounding =
          (formation >= 2 ? 1 - change : 0) +
          ((formation + 1) % 4 >= 2 ? change : 0);
        ctx.roundRect(
          card.sx - side / 2,
          card.sy - side / 2,
          side,
          side,
          side * (0.16 + 0.34 * rounding),
        );
        ctx.clip();
        ctx.drawImage(
          image,
          (image.naturalWidth - crop) / 2,
          (image.naturalHeight - crop) / 2,
          crop,
          crop,
          card.sx - side / 2,
          card.sy - side / 2,
          side,
          side,
        );
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    if (elapsed >= duration && canvas.tabIndex < 0) {
      canvas.tabIndex = 0;
      onIntroComplete();
    }
    if (!motion.matches || pulse) schedule();
  }
  function schedule() {
    if (!frame && !document.hidden && stageVisible) {
      frame = requestAnimationFrame(draw);
    }
  }
  function pulseAt(x: number, y: number) {
    const nearest = shell.reduce(
      (best, s) =>
        s.depth >= 0 &&
        Math.hypot(s.screenX - x, s.screenY - y) <
          Math.hypot(best.screenX - x, best.screenY - y)
          ? s
          : best,
      shell.find(s => s.depth >= 0)!,
    );
    pulse = {...nearest, age: 0};
    schedule();
  }
  const position = (e: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect();
    return [e.clientX - bounds.left, e.clientY - bounds.top];
  };
  canvas.addEventListener(
    'pointerdown',
    e => {
      const [x, y] = position(e);
      if (pointer !== null || e.button !== 0) return;
      rotating = onGlobe(x, y);
      if (!rotating && scroll <= 0.9) return;
      pointer = e.pointerId;
      canvas.setPointerCapture(pointer);
      px = x;
      py = y;
      travel = 0;
      inertia = 0;
      canvas.style.cursor = rotating ? 'grabbing' : '';
    },
    options,
  );
  canvas.addEventListener(
    'pointerleave',
    () => {
      hover = null;
      schedule();
    },
    options,
  );
  canvas.addEventListener(
    'pointermove',
    e => {
      const [x, y] = position(e);
      hover = e.pointerType === 'mouse' ? {x, y} : null;
      if (pointer === null) {
        if (scroll > 0.9) schedule();
        canvas.style.cursor = onGlobe(x, y) ? 'grab' : '';
        return;
      }
      if (pointer !== e.pointerId) return;
      const dx = x - px,
        dy = y - py;
      travel += Math.hypot(dx, dy);
      if (!rotating) {
        px = x;
        py = y;
        return;
      }
      yaw += dx / radius;
      pitch -= dy / radius;
      inertia = Math.max(-2, Math.min(2, (dx / radius) * 40));
      px = x;
      py = y;
      schedule();
    },
    options,
  );
  function release(e: PointerEvent) {
    if (pointer !== e.pointerId) return;
    pointer = null;
    canvas.style.cursor = '';
    const [x, y] = position(e);
    if (e.type === 'pointerup' && travel < 5) {
      if (scroll > 0.9) {
        const card = photoAt(x, y);
        openPhoto(card?.index ?? null);
      } else if (scroll < 0.3 && onGlobe(x, y)) pulseAt(x, y);
    }
  }
  canvas.addEventListener('pointerup', release, options);
  canvas.addEventListener('lostpointercapture', release, options);
  canvas.addEventListener(
    'keydown',
    e => {
      if (elapsed < duration) return;
      switch (e.key) {
        case 'Escape':
          openPhoto(null);
          break;
        case 'ArrowLeft':
          if (scroll > 0.9)
            formationTime = (Math.floor(formationTime / 6) + 3) * 6;
          else yaw -= 0.12;
          break;
        case 'ArrowRight':
          if (scroll > 0.9)
            formationTime = (Math.floor(formationTime / 6) + 1) * 6;
          else yaw += 0.12;
          break;
        case 'ArrowUp':
          pitch += 0.12;
          break;
        case 'ArrowDown':
          pitch -= 0.12;
          break;
        case 'Enter':
          if (scroll > 0.9) openPhoto(photos[photos.length - 1].index);
          else if (scroll < 0.3) pulseAt(cx, centerY);
          break;
        default:
          return;
      }
      e.preventDefault();
      schedule();
    },
    options,
  );
  skipIntro.addEventListener(
    'click',
    () => {
      elapsed = duration;
      canvas.focus({preventScroll: true});
      schedule();
    },
    options,
  );
  motion.addEventListener(
    'change',
    () => {
      if (motion.matches) elapsed = Math.max(duration, elapsed);
      last = 0;
      schedule();
    },
    options,
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      schedule();
    },
    options,
  );
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  observer.observe(galleryArea);
  // 离屏时停掉整条 rAF 链：用户下滑后不再满帧绘制数千个粒子
  const visibility = new IntersectionObserver(
    ([entry]) => {
      stageVisible = entry.isIntersecting;
      if (!stageVisible) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      } else {
        schedule();
      }
    },
    {threshold: 0},
  );
  visibility.observe(stage);
  resize();
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    visibility.disconnect();
    images.forEach(image => {
      image.onload = null;
    });
    listeners.abort();
  };
}
