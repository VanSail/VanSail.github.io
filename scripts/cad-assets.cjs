// Build the standalone viewer for both local development and static Pages exports.
const {build} = require('esbuild');
const {copyFile, mkdir, readdir, unlink} = require('node:fs/promises');
const path = require('node:path');

module.exports = function cadAssets({siteDir}) {
  return {
    name: 'cad-viewer-assets',
    getPathsToWatch() {
      return [path.join(siteDir, 'cad/*.js')];
    },
    async loadContent() {
      const outdir = path.join(siteDir, 'static/apps/cad/generated');
      await mkdir(outdir, {recursive: true});
      const bundle = await build({
        metafile: true,
        absWorkingDir: siteDir,
        entryPoints: ['cad/step.js', 'cad/dxf.js', 'cad/dxf-worker.js'],
        outdir,
        bundle: true,
        splitting: true,
        format: 'esm',
        target: 'es2022',
        minify: true,
        legalComments: 'eof',
      });
      const outputs = new Set(
        Object.keys(bundle.metafile.outputs).map(file => path.basename(file)),
      );
      for (const file of await readdir(outdir)) {
        if (/^chunk-[A-Z0-9]+\.js$/.test(file) && !outputs.has(file))
          await unlink(path.join(outdir, file));
      }
      const dist = path.dirname(require.resolve('occt-import-js'));
      for (const name of [
        'occt-import-js.js',
        'occt-import-js.wasm',
        'license.occt.txt',
        'license.occt-import-js.txt',
      ]) {
        await copyFile(path.join(dist, name), path.join(outdir, name));
      }
      for (const file of ['step-worker.js', 'step-batches.js']) {
        await copyFile(
          path.join(siteDir, 'cad', file),
          path.join(outdir, file),
        );
      }
      for (const [pkg, license] of [
        ['three', 'LICENSE'],
        ['dxf-viewer', 'LICENSE'],
      ]) {
        await copyFile(
          path.join(siteDir, 'node_modules', pkg, license),
          path.join(outdir, pkg + '-LICENSE.txt'),
        );
      }
    },
  };
};
