// JupyterLite copies opened examples into its per-site IndexedDB workspace.
export function retireExamples(root) {
  const originals = {
    '开始使用.ipynb':
      '# Python 实验室\n选中代码单元，按 **Shift + Enter** 运行。修改下面的温度数据，再运行两个代码单元。',
    'Welcome.ipynb':
      '# Python Lab\nSelect a code cell and press **Shift + Enter** to run it.',
  };
  const average =
    'temperature = [22.1, 22.8, 23.6, 23.2, 24.0, 23.7]\nprint(sum(temperature) / len(temperature))';
  const plot =
    'import matplotlib.pyplot as plt\n\nplt.plot(temperature, marker="o")\nplt.xlabel("Sample")\nplt.ylabel("Temperature (°C)")\nplt.grid(alpha=0.25)\nplt.show()';
  return new Promise((resolve, reject) => {
    const open = indexedDB.open('JupyterLite Storage - ' + root);
    // A first-time visitor has no saved examples to migrate.
    open.onupgradeneeded = () => open.transaction.abort();
    open.onerror = () =>
      open.error.name === 'AbortError' ? resolve() : reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains('files')) {
        db.close();
        resolve();
        return;
      }
      const stores = ['files', 'checkpoints'].filter(name =>
        db.objectStoreNames.contains(name),
      );
      const tx = db.transaction(stores, 'readwrite');
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onabort = () => {
        db.close();
        reject(tx.error);
      };
      const files = tx.objectStore('files');
      for (const [name, intro] of Object.entries(originals)) {
        const request = files.get(name);
        request.onsuccess = () => {
          const cells = request.result?.content?.cells;
          if (!Array.isArray(cells)) return;
          const sources = cells.map(cell =>
            Array.isArray(cell.source) ? cell.source.join('') : cell.source,
          );
          // Running the example can append empty code cells after the original three.
          if (
            sources[0] === intro &&
            sources[1] === average &&
            sources[2] === plot &&
            sources.slice(3).every(source => source === '')
          ) {
            for (const store of stores) tx.objectStore(store).delete(name);
          }
        };
      }
    };
  });
}
