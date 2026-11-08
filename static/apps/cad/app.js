const en = new URLSearchParams(location.search).get('lang') === 'en';
const t = (zh, english) => (en ? english : zh);
const el = id => document.getElementById(id);
document.documentElement.lang = en ? 'en' : 'zh-CN';
document.title = el('title').textContent = t('CAD 看图', 'CAD Viewer');
el('open').textContent = t('选择文件', 'Open file');
el('cancel').textContent = t('取消', 'Cancel');
el('fit').textContent = t('适合窗口', 'Fit view');
el('prompt').textContent = t('拖入模型或图纸', 'Drop a model or drawing');
el('local').textContent = t('文件仅在本机处理', 'Files stay on this device');
const view = el('view');
const phases = {
  init: t('正在加载查看器', 'Loading viewer'),
  fetch: t('正在读取文件', 'Reading file'),
  parse: t('正在解析几何数据', 'Parsing geometry'),
  prepare: t('正在准备图形', 'Preparing geometry'),
  font: t('正在加载图纸字体', 'Loading drawing fonts'),
  render: t('正在绘制视图', 'Rendering view'),
};
let session;
function clear() {
  session?.abort();
  session = undefined;
  el('loading').hidden = true;
  view.replaceChildren();
  el('items').replaceChildren();
  el('structure').hidden = el('fit').hidden = el('cancel').hidden = true;
  el('structure').open = false;
  el('empty').hidden = false;
  el('fit').onclick = null;
}
async function openFile(file) {
  if (!file) return;
  const type = file.name.split('.').pop().toLowerCase();
  if (!['dxf', 'stp', 'step'].includes(type)) {
    el('status').textContent = t(
      '请选择 STP、STEP 或 DXF 文件。',
      'Choose a STP, STEP or DXF file.',
    );
    return;
  }
  clear();
  const current = (session = new AbortController());
  function progress(phase, loaded, total) {
    if (current.signal.aborted) return;
    const bar = el('progress');
    let label = phases[phase];
    if (total > 0 && Number.isFinite(loaded)) {
      bar.value = Math.min(100, Math.floor((100 * loaded) / total));
      label += ' · ' + bar.value + '%';
    } else {
      bar.removeAttribute('value');
    }
    el('phase').textContent = label;
  }
  el('loading').hidden = false;
  progress('init');
  el('status').textContent = file.name;
  el('empty').hidden = true;
  el('cancel').hidden = false;
  try {
    const dxf = type === 'dxf';
    const module = dxf
      ? await import('./generated/dxf.js')
      : await import('./generated/step.js');
    current.signal.throwIfAborted();
    const result = await module.preview({
      view,
      file,
      signal: current.signal,
      items: el('items'),
      progress,
      t,
    });
    current.signal.throwIfAborted();
    el('loading').hidden = true;
    el('fit').onclick = result.fit;
    el('cancel').hidden = true;
    el('fit').hidden = false;
    el('structureTitle').textContent = dxf
      ? t('图层', 'Layers')
      : t('模型结构', 'Model structure');
    el('structure').hidden = !el('items').childElementCount;
    el('structure').open = window.innerWidth >= 640;
    requestAnimationFrame(() => {
      if (!current.signal.aborted) result.fit();
    });
    el('status').textContent =
      file.name +
      ' · ' +
      (dxf
        ? t('拖动平移，滚轮缩放', 'Drag to pan, scroll to zoom')
        : t(
            '拖动旋转，右键平移，滚轮缩放',
            'Drag to orbit, right-drag to pan, scroll to zoom',
          )) +
      (result.warning ? ' · ' + result.warning : '');
  } catch (error) {
    if (current.signal.aborted) return;
    clear();
    const reason = error?.message || String(error);
    el('status').textContent = /webgl/i.test(reason)
      ? t(
          '浏览器无法启动 WebGL，请启用硬件加速后重试。',
          'WebGL is unavailable. Enable hardware acceleration and try again.',
        )
      : t('无法打开文件：', 'Could not open file: ') + reason;
  }
}
el('open').onclick = () => el('file').click();
el('file').onchange = event => {
  const [file] = event.target.files;
  event.target.value = '';
  openFile(file);
};
el('cancel').onclick = () => {
  clear();
  el('status').textContent = t('已取消', 'Cancelled');
};
window.addEventListener('dragover', event => {
  event.preventDefault();
  document.body.classList.add('dragging');
});
window.addEventListener('dragleave', event => {
  if (!event.relatedTarget) document.body.classList.remove('dragging');
});
window.addEventListener('drop', event => {
  event.preventDefault();
  document.body.classList.remove('dragging');
  openFile(event.dataTransfer.files[0]);
});
window.addEventListener('pagehide', clear);
