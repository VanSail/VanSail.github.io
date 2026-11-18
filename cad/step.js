import {previewModel} from './model-viewer.js';

function readStep(file, signal, t, progress) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./step-worker.js', import.meta.url));
    const cancel = () => {
      worker.terminate();
      reject(signal.reason);
    };
    signal.addEventListener('abort', cancel, {once: true});
    const finish = () => {
      worker.terminate();
      signal.removeEventListener('abort', cancel);
    };
    worker.onerror = () => {
      finish();
      reject(
        new Error(t('模型解析器加载失败。', 'Failed to load the STEP reader.')),
      );
    };
    worker.onmessage = ({data}) => {
      if (data.phase) {
        progress(data.phase, data.loaded, data.total);
        return;
      }
      finish();
      if (data.error)
        reject(
          new Error(
            data.error === 'emptyGeometry'
              ? t(
                  '已读取模型结构，但未生成可显示的三角面。',
                  'The model structure was read, but no displayable triangles were generated.',
                )
              : t(
                  '未读取到有效的 STEP 实体。',
                  'No readable STEP geometry found.',
                ),
          ),
        );
      else resolve(data);
    };
    worker.postMessage(file);
  });
}
export async function preview(options) {
  const data = await readStep(
    options.file,
    options.signal,
    options.t,
    options.progress,
  );
  return previewModel({...options, ...data});
}
