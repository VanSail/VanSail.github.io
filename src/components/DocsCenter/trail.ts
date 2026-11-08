// Coordinates use a small, fixed pixel grid so the same scene scales cleanly on phones.
const ground = 139;
const stone = 154;
export const duration = 10.8;
const progress = (time: number, from: number, to: number) =>
  Math.max(0, Math.min(1, (time - from) / (to - from)));

export function drawTrail(ctx: CanvasRenderingContext2D, t: number) {
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  };
  const line = (x: number, y: number, w: number, color: string) =>
    rect(x, y, w, 1, color);
  ctx.clearRect(0, 0, 320, 176);
  // Distant ridges are built in horizontal terraces.
  for (let x = 0; x < 320; x += 4) {
    const y =
      83 + Math.floor(8 * Math.sin(x * 0.039) + 7 * Math.cos(x * 0.061));
    rect(x, y, 4, ground - y, '#1a2330');
    const near =
      108 + Math.floor(5 * Math.cos(x * 0.06) + 3 * Math.sin(x * 0.11));
    rect(x, near, 4, ground - near, '#25313a');
  }
  rect(242, 18, 12, 8, '#e9cfab');
  rect(244, 16, 8, 12, '#e9cfab');
  for (let i = 0; i < 30; i++)
    rect(
      (i * 73 + 9) % 320,
      10 + ((i * 19) % 65),
      i % 4 === 0 ? 2 : 1,
      1,
      '#788390',
    );
  for (const x of [8, 27, 49, 235, 261, 288, 304]) {
    const h = 9 + (x % 11);
    rect(x, ground - 8 - h, 2, h, '#26303a');
    for (let j = 0; j < 4; j++)
      rect(x - j * 2, ground - 10 - h + j * 3, 2 + j * 4, 3, '#354349');
  }
  rect(0, ground, 320, 4, '#b1a18a');
  rect(0, ground + 4, 320, 11, '#625a55');
  for (let i = 0; i < 40; i++)
    line((i * 9) % 320, ground + 6 + (i % 6), 3 + (i % 4), '#867568');
  rect(0, ground + 15, 320, 22, '#252329');
  for (let i = 0; i < 14; i++) rect(i * 23 + 3, ground + 16, 9, 2, '#373137');
  const fixed = progress(t, 7.4, 7.95);
  const rise = Math.round(7 * (1 - fixed));
  rect(stone, ground - rise, 12, 3 + rise, '#ae6544');
  rect(stone + 2, ground - rise - 1, 10, 2, '#e9a263');
  const sign = (height: number) => {
    const y = ground - height;
    rect(134, y, 2, height, '#bd9872');
    rect(130, y - 7, 11, 8, '#e7c492');
    line(132, y - 2, 3, '#473c3a');
    rect(135, y - 5, 2, 3, '#473c3a');
    line(135, y - 5, 4, '#473c3a');
  };
  if (t >= 2.65 && t < 8.25)
    sign(
      Math.round(9 * progress(t, 2.65, 2.9) * (1 - progress(t, 8.03, 8.25))),
    );

  function hat(x: number, y: number) {
    rect(x + 2, y, 7, 2, '#ffd09b');
    rect(x, y + 2, 10, 3, '#e99955');
    rect(x + 1, y + 5, 12, 2, '#b86c45');
  }
  function person(
    x: number,
    jump: number,
    kind: number,
    tilt: number,
    moving: boolean,
    capped = true,
  ) {
    const step = moving ? Math.floor(t * 11) % 4 : 0;
    const stride = moving ? [0, 3, 0, -3][step] : 0;
    ctx.save();
    ctx.translate(
      Math.round(x),
      Math.round(ground - jump - (moving ? step % 2 : 0)),
    );
    ctx.rotate(tilt);
    const coat = ['#e99860', '#78b9b1', '#a0a1d2'][kind];
    rect(-4, -8, 4, 5, '#444957');
    rect(1, -8, 4, 5, '#343946');
    rect(-4 - stride, -4, 4, 3, '#697385');
    rect(1 + stride, -4, 4, 3, '#576271');
    rect(-4 - stride, -2, 5, 2, '#d2c4af');
    rect(1 + stride, -2, 6, 2, '#e6d6bd');
    rect(-4, -17, 9, 10, coat);
    rect(-4, -9, 9, 2, '#63555b');
    rect(-4, -25, 8, 8, '#53484a');
    rect(-2, -24, 8, 7, '#f0c19a');
    rect(3, -23, 2, 2, '#212430');
    rect(5, -21, 2, 2, '#e3aa84');
    rect(-4, -16, 3, 5, coat);
    rect(-4 + stride, -12, 4, 3, '#efbc92');
    rect(3, -16, 3, 5, coat);
    rect(4 - stride, -13, 4, 3, '#ffd1aa');
    if (kind === 0 && capped) hat(-5, -29);
    if (kind === 1) {
      rect(-7, -16, 4, 8, '#bd8b62');
      rect(-7, -15, 4, 2, '#e0b67f');
    }
    if (kind === 2) {
      rect(7, -16, 2, 12, '#bb956c');
      rect(6, -5, 5, 4, '#b2bbc0');
    }
    ctx.restore();
  }
  if (t < 3.9) {
    const trip = progress(t, 1.25, 1.48) * (1 - progress(t, 1.91, 2.25));
    const x =
      -14 +
      161 * progress(t, 0, 1.25) -
      8 * progress(t, 2.2, 2.62) +
      200 * progress(t, 2.95, 3.9);
    person(x, 0, 0, trip * 1.25, t < 1.25 || t > 2.95, t < 1.28 || t > 2.57);
    if (t >= 1.28 && t <= 2.57) {
      const f = progress(t, 1.28, 1.7),
        retrieve = progress(t, 2.28, 2.57);
      hat(
        150 - 16 * f,
        ground - 33 + 27 * f - Math.sin(f * Math.PI) * 7 - 22 * retrieve,
      );
    }
  }
  if (t >= 3.65 && t < 5.95) {
    const x = -12 + 348 * progress(t, 3.65, 5.95);
    const leap = progress(t, 4.55, 5.05);
    person(x, Math.sin(leap * Math.PI) * 26, 1, 0, true);
  }
  if (t >= 5.75 && t < 9.1) {
    const x =
      -12 + 158 * progress(t, 5.75, 7.07) + 194 * progress(t, 8.25, 9.1);
    const working = progress(t, 7.07, 7.28) * (1 - progress(t, 7.95, 8.15));
    person(
      x,
      -3 * working,
      2,
      working * (0.38 + 0.13 * Math.sin(t * 22)),
      t < 7.07 || t > 8.25,
    );
    if (t > 7.45 && t < 7.9)
      for (let i = 0; i < 3; i++)
        rect(
          158 + i * 3,
          ground - 6 - ((i + Math.floor(t * 12)) % 4),
          2,
          2,
          '#d4aa83',
        );
  }
  if (t >= 8.95) person(-12 + 350 * progress(t, 8.95, duration), 0, 0, 0, true);
}
