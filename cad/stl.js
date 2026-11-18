import {previewModel} from './model-viewer.js';

function readStl({file, signal, t, progress}) {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./stl-worker.js', import.meta.url), {
      type: 'module',
    });
    const finish = () => {
      worker.terminate();
      signal.removeEventListener('abort', cancel);
    };
    const cancel = () => {
      finish();
      reject(signal.reason);
    };
    signal.addEventListener('abort', cancel, {once: true});
    worker.onerror = () => {
      finish();
      reject(
        new Error(t('STL 解析器加载失败。', 'Failed to load the STL reader.')),
      );
    };
    worker.onmessage = ({data}) => {
      if (data.phase) {
        progress(data.phase);
        return;
      }
      finish();
      if (data.error)
        reject(
          new Error(
            t(
              '未读取到有效的 STL 三角网格。',
              'No valid STL triangle mesh found.',
            ),
          ),
        );
      else resolve(data);
    };
    worker.postMessage(file);
  });
}

export async function preview(options) {
  const data = await readStl(options);
  return previewModel({...options, ...data, meshOnly: true});
}
