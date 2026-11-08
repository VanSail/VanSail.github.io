export function photoPicker(editor, t, signal, apply) {
  const button = document.createElement('button');
  button.textContent = t('从图片取色', 'Pick from photo');
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = 'image/png,image/jpeg,image/webp';
  file.hidden = true;
  const img = document.createElement('img');
  img.className = 'referencePhoto';
  img.alt = t('实物图，点击取色', 'Reference photo. Click to sample a color.');
  img.hidden = true;
  const hint = document.createElement('small');
  hint.setAttribute('role', 'status');
  const sample = document.createElement('canvas');
  sample.width = sample.height = 5;
  const ctx = sample.getContext('2d', {willReadFrequently: true});
  const expand = document.createElement('button');
  expand.textContent = t('放大取色', 'Zoom photo');
  expand.hidden = true;
  const dialog = document.createElement('dialog');
  dialog.className = 'photoZoom';
  dialog.setAttribute('aria-label', expand.textContent);
  const toolbar = document.createElement('header');
  const zoom = document.createElement('input');
  zoom.type = 'range';
  zoom.min = '1';
  zoom.max = '8';
  zoom.step = '0.25';
  zoom.setAttribute('aria-label', t('放大倍数', 'Zoom level'));
  const factor = document.createElement('output');
  const close = document.createElement('button');
  close.textContent = t('关闭', 'Close');
  close.onclick = () => dialog.close();
  const frame = document.createElement('div');
  frame.className = 'photoViewport';
  const full = new Image();
  full.alt = img.alt;
  full.draggable = false;
  frame.append(full);
  toolbar.append(zoom, factor, close);
  dialog.append(toolbar, frame);
  editor.append(dialog);
  function sizePhoto() {
    if (!dialog.open) return;
    const fit = Math.min(
      frame.clientWidth / img.naturalWidth,
      frame.clientHeight / img.naturalHeight,
    );
    full.style.width = img.naturalWidth * fit * Number(zoom.value) + 'px';
    factor.textContent = zoom.value + '×';
  }
  const observer = new ResizeObserver(sizePhoto);
  observer.observe(frame);
  zoom.oninput = sizePhoto;
  expand.onclick = () => {
    full.src = img.src;
    zoom.value = '1';
    dialog.showModal();
    sizePhoto();
    frame.scrollTo(0, 0);
  };
  let url,
    version = 0;
  signal.addEventListener(
    'abort',
    () => {
      version++;
      observer.disconnect();
      if (dialog.open) dialog.close();
      if (url) URL.revokeObjectURL(url);
    },
    {once: true},
  );
  button.onclick = () => file.click();
  file.onchange = async () => {
    const [photo] = file.files;
    file.value = '';
    if (!photo) return;
    const id = ++version,
      next = URL.createObjectURL(photo);
    try {
      const loaded = new Image();
      loaded.src = next;
      await loaded.decode();
      if (id !== version) return;
      if (url) URL.revokeObjectURL(url);
      url = next;
      img.src = url;
      img.hidden = expand.hidden = false;
      button.textContent = t('更换实物图', 'Replace photo');
      hint.textContent = t(
        '点击照片取色，可连续切换部件。',
        'Click to sample. Switch parts to keep coloring.',
      );
    } catch {
      if (id === version)
        hint.textContent = t('无法读取这张图片', 'Could not read this image');
    } finally {
      if (next !== url) URL.revokeObjectURL(next);
    }
  };
  function pick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(
      ((e.clientX - rect.left) * img.naturalWidth) / rect.width,
    );
    const y = Math.floor(
      ((e.clientY - rect.top) * img.naturalHeight) / rect.height,
    );
    const left = Math.max(0, x - 2),
      top = Math.max(0, y - 2);
    const w = Math.min(img.naturalWidth, x + 3) - left,
      h = Math.min(img.naturalHeight, y + 3) - top;
    if (w <= 0 || h <= 0) return;
    ctx.clearRect(0, 0, 5, 5);
    ctx.drawImage(img, left, top, w, h, 0, 0, w, h);
    const pixels = ctx.getImageData(0, 0, w, h).data,
      rgb = [0, 0, 0];
    let weight = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      weight += pixels[i + 3];
      for (let j = 0; j < 3; j++) rgb[j] += pixels[i + j] * pixels[i + 3];
    }
    if (!weight) {
      hint.textContent = t('请点选有颜色的位置', 'Choose a visible color');
      return;
    }
    const hex =
      '#' +
      rgb
        .map(v =>
          Math.round(v / weight)
            .toString(16)
            .padStart(2, '0'),
        )
        .join('');
    if (apply(hex)) {
      hint.textContent = t('已应用 ', 'Applied ') + hex;
      if (dialog.open) dialog.close();
    } else
      hint.textContent = t('请先在模型上点选一个面', 'Pick a model face first');
  }
  img.onclick = full.onclick = pick;
  editor.append(button, file, expand, img, hint);
}
