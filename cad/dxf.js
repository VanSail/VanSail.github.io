import {DxfViewer} from 'dxf-viewer';
import {Color} from 'three';

export async function preview({view, file, signal, items, t, progress}) {
  const header = await file.slice(0, 65536).text();
  signal.throwIfAborted();
  if (header.startsWith('AutoCAD Binary DXF'))
    throw new Error(
      t('请另存为 ASCII DXF 后打开。', 'Save as ASCII DXF and reopen.'),
    );
  const legacyChinese = /ANSI_936/i.test(header);
  const modern = /AC10(?:2[1-9]|[3-9]\d)/.test(header);
  const container = document.createElement('div');
  container.style.height = '100%';
  view.append(container);
  const viewer = new DxfViewer(container, {
    autoResize: true,
    clearColor: new Color(0x182730),
    fileEncoding: legacyChinese && !modern ? 'gbk' : 'utf-8',
  });
  if (!viewer.HasRenderer()) throw new Error('WebGL');
  const renderer = viewer.GetRenderer();
  const url = URL.createObjectURL(file);
  let warning = '';
  const warn = () => {
    warning = t(
      '部分文字或实体可能未完整显示',
      'Some text or entities may be missing',
    );
  };
  viewer.Subscribe('message', warn);
  signal.addEventListener(
    'abort',
    () => {
      URL.revokeObjectURL(url);
      viewer.Destroy();
      renderer.forceContextLoss();
    },
    {once: true},
  );
  try {
    await viewer.Load({
      url,
      progressCbk: (phase, loaded, total) =>
        progress(phase, loaded, phase === 'fetch' ? file.size : total),
      fonts: ['latin.woff', 'drawing.woff'].map(
        name => new URL('../fonts/' + name, import.meta.url).href,
      ),
      workerFactory: () =>
        new Worker(new URL('./dxf-worker.js', import.meta.url), {
          type: 'module',
        }),
    });
  } finally {
    URL.revokeObjectURL(url);
  }
  signal.throwIfAborted();
  const bounds = viewer.GetBounds();
  if (!bounds)
    throw new Error(
      t('未找到可显示的二维实体。', 'No visible 2D geometry found.'),
    );
  for (const layer of viewer.GetLayers(true)) {
    const label = document.createElement('label');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = layer.visible;
    check.onchange = () => viewer.ShowLayer(layer.name, check.checked);
    label.append(check, layer.displayName || layer.name);
    items.append(label);
  }
  const origin = viewer.GetOrigin();
  return {
    warning,
    fit: () =>
      viewer.FitView(
        bounds.minX - origin.x,
        bounds.maxX - origin.x,
        bounds.minY - origin.y,
        bounds.maxY - origin.y,
      ),
  };
}
