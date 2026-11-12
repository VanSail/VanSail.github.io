// Build the static JupyterLite distribution once for both Docusaurus locales.
const {execFileSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

module.exports = function pythonLab({siteDir, i18n}) {
  return {
    name: 'python-lab',
    loadContent() {
      const source = path.join(siteDir, 'python-lab');
      const output = path.join(siteDir, 'static/apps/python/generated');
      const cache = path.join(siteDir, 'node_modules/.cache/vansail-python');
      const digest = crypto.createHash('sha256');
      for (const file of [
        'requirements.txt',
        ...fs
          .readdirSync(path.join(source, 'notebooks'))
          .sort()
          .map(name => 'notebooks/' + name),
      ]) {
        digest.update(file).update(fs.readFileSync(path.join(source, file)));
      }
      const key = digest.digest('hex');
      const stamp = path.join(output, '.build-key');
      if (fs.existsSync(stamp) && fs.readFileSync(stamp, 'utf8') === key)
        return;
      const env = process.env.VANSAIL_JUPYTER_ENV || path.join(cache, 'venv');
      const bin = path.join(
        env,
        process.platform === 'win32' ? 'Scripts' : 'bin',
      );
      const exe = name =>
        path.join(bin, name + (process.platform === 'win32' ? '.exe' : ''));
      const run = (cmd, args) =>
        execFileSync(cmd, args, {
          cwd: cache,
          stdio: 'inherit',
          env: {...process.env, PATH: bin + path.delimiter + process.env.PATH},
        });
      fs.mkdirSync(cache, {recursive: true});
      if (!fs.existsSync(exe('python')))
        run(
          process.env.PYTHON ||
            (process.platform === 'win32' ? 'python' : 'python3'),
          ['-m', 'venv', env],
        );
      run(exe('python'), [
        '-m',
        'pip',
        'install',
        '--disable-pip-version-check',
        '-q',
        '-r',
        path.join(source, 'requirements.txt'),
      ]);
      // Drop stale notebook files and their index before regenerating the catalog.
      for (const dir of ['files', 'api/contents']) {
        fs.rmSync(path.join(output, dir), {recursive: true, force: true});
      }
      run(exe('jupyter'), [
        'lite',
        'build',
        '--contents',
        path.join(source, 'notebooks'),
        '--output-dir',
        output,
      ]);
      fs.writeFileSync(stamp, key);
    },
    async postBuild({outDir}) {
      const file = path.join(
        outDir,
        'apps/python/generated/lab/jupyter-lite.json',
      );
      const config = JSON.parse(await fs.promises.readFile(file, 'utf8'));
      const data = config['jupyter-config-data'];
      data.settingsOverrides = {
        ...data.settingsOverrides,
        '@jupyterlab/translation-extension:plugin': {
          locale: i18n.currentLocale === 'en' ? 'en' : 'zh_CN',
        },
      };
      await fs.promises.writeFile(file, JSON.stringify(config, null, 2));
    },
  };
};
