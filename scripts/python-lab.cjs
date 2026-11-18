// Build the static JupyterLite distribution once for both Docusaurus locales.
const {execFileSync, spawnSync} = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Match the Python floor of the pinned JupyterLite/JupyterLab packages.
function compatiblePython(executable) {
  return (
    spawnSync(
      executable,
      ['-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)'],
      {stdio: 'ignore', timeout: 10000},
    ).status === 0
  );
}

function findPython() {
  const candidates = process.env.PYTHON
    ? [process.env.PYTHON]
    : [
        'python3.12',
        'python3',
        'python',
        'python3.14',
        'python3.13',
        'python3.11',
        'python3.10',
      ];
  const executable = candidates.find(compatiblePython);
  if (!executable)
    throw new Error(
      'Python 实验室需要 Python >=3.10（推荐 3.12）。请安装后通过 PYTHON 指定兼容的解释器路径。 / Python >=3.10 is required; set PYTHON to a compatible executable.',
    );
  return executable;
}

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
      const env =
        process.env.VANSAIL_JUPYTER_ENV || path.join(cache, 'venv-py310');
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
      if (!fs.existsSync(exe('python'))) run(findPython(), ['-m', 'venv', env]);
      if (!compatiblePython(exe('python')))
        throw new Error(
          `JupyterLite 虚拟环境需要 Python >=3.10：${env}。请将 VANSAIL_JUPYTER_ENV 指向兼容环境，或使用新路径重建。`,
        );
      console.info(
        '[python-lab] Installing JupyterLite dependencies (Python >=3.10)...',
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
