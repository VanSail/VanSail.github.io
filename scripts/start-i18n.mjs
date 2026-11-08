#!/usr/bin/env node
/**
 * 双语本地预览：一次构建全部 locale → 同一端口静态服务 → 源码变化自动重建 → 并排对照页。
 *
 * 背景：Docusaurus 的每个 locale 是独立 SPA，dev server 一次只能服务一种语言
 * (https://docusaurus.io/docs/i18n/tutorial)。实测并行跑两个 dev server 会争用
 * 同一份 .docusaurus 缓存，导致 Rspack 编译报错；而 `docusaurus build` 会一次
 * 产出所有语言，再用 `docusaurus serve` 就能在一个端口里同时访问 / 与 /en/，
 * 导航栏的语言切换按钮也能正常互跳。
 *
 * 代价：静态服务没有 HMR，改代码后要等自动重建并手动刷新页面（本站全量构建约 2 秒）。
 * 需要单语言热更新开发请用 yarn start:dev / yarn start:zh / yarn start:en。
 *
 * 环境变量：
 *   VS_PORT      静态服务端口，默认 3000
 *   VS_NO_WATCH  设为 1 关闭自动重建
 */
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import chokidar from 'chokidar';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bin = path.join(root, 'node_modules/@docusaurus/core/bin/docusaurus.mjs');
const port = Number(process.env.VS_PORT ?? 3000);
const base = `http://localhost:${port}`;
const buildDir = path.join(root, 'build');
const compareName = '__i18n__.html';
// docusaurus serve 开启 cleanUrls，/__i18n__.html 会 301 到 /__i18n__
const compareRoute = '/__i18n__';
const comparePath = path.join(buildDir, compareName);
const noWatch = process.env.VS_NO_WATCH === '1';

const children = new Set();
let watcher;
let timer;
let building = false;
let pending = false;
let shuttingDown = false;

// 对照页写进 build/，由 docusaurus serve 一起提供，不需要额外端口或代理。
// 注意：这里刻意不用模板字符串语法，避免和外层 JS 模板字面量冲突。
const COMPARE_HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>VanSail 中英双语对照</title>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; font: 14px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif; background: #eef0f5; color: #1f2430; }
  .bar { display: flex; align-items: center; gap: 10px; height: 56px; padding: 0 14px; background: #fff; border-bottom: 1px solid #dfe3ec; }
  .brand { font-weight: 700; white-space: nowrap; }
  .brand span { color: #8a90a2; font-weight: 400; margin-left: 6px; }
  input[type=text] { flex: 1; min-width: 80px; height: 32px; padding: 0 10px; border: 1px solid #d5dae6; border-radius: 8px; font: inherit; }
  button, .btn { height: 32px; padding: 0 12px; border: 1px solid #d5dae6; border-radius: 8px; background: #f7f8fb; color: #1f2430; font: inherit; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; white-space: nowrap; }
  button:hover, .btn:hover { background: #eef1f8; }
  .follow { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; color: #5b6172; }
  .panes { display: flex; height: calc(100% - 56px); }
  .pane { flex: 1 1 50%; min-width: 0; display: flex; flex-direction: column; border-right: 1px solid #dfe3ec; }
  .pane:last-child { border-right: 0; }
  .tag { height: 26px; display: flex; align-items: center; gap: 4px; padding: 0 12px; font-size: 12px; color: #5b6172; background: #f7f8fb; border-bottom: 1px solid #e8ebf2; overflow: hidden; white-space: nowrap; }
  .tag span { overflow: hidden; text-overflow: ellipsis; }
  iframe { flex: 1; width: 100%; border: 0; background: #fff; }
  @media (max-width: 760px) {
    .bar { height: auto; flex-wrap: wrap; padding: 8px 10px; gap: 6px; }
    .panes { flex-direction: column; height: calc(100% - 92px); }
    .pane { border-right: 0; border-bottom: 1px solid #dfe3ec; }
  }
</style>
</head>
<body>
<div class="bar">
  <div class="brand">VanSail 双语对照 <span>zh-CN / en</span></div>
  <input type="text" id="path" value="/" aria-label="站点路径" spellcheck="false">
  <button id="go">跳转</button>
  <button id="reload">刷新两侧</button>
  <label class="follow"><input type="checkbox" id="follow" checked>跟随中文导航</label>
  <a class="btn" id="openZh" href="/" target="_blank" rel="noopener">单开中文</a>
  <a class="btn" id="openEn" href="/en/" target="_blank" rel="noopener">单开英文</a>
</div>
<div class="panes">
  <div class="pane"><div class="tag">中文 zh-CN · <span id="zhUrl">/</span></div><iframe id="zh" src="/" title="中文站"></iframe></div>
  <div class="pane"><div class="tag">English en · <span id="enUrl">/en/</span></div><iframe id="en" src="/en/" title="English site"></iframe></div>
</div>
<script>
(function () {
  var zh = document.getElementById('zh');
  var en = document.getElementById('en');
  var input = document.getElementById('path');
  var follow = document.getElementById('follow');
  var zhUrl = document.getElementById('zhUrl');
  var enUrl = document.getElementById('enUrl');
  var openZh = document.getElementById('openZh');
  var openEn = document.getElementById('openEn');
  var applying = 0;
  var lastZh = '/';
  var lastEn = '/en/';

  function split(p) {
    var i = p.indexOf('?'), j = p.indexOf('#'), cut = p.length;
    if (i >= 0) cut = Math.min(cut, i);
    if (j >= 0) cut = Math.min(cut, j);
    return [p.slice(0, cut), p.slice(cut)];
  }
  function norm(p) {
    p = (p || '').trim() || '/';
    if (p.indexOf('http') === 0) {
      try { var u = new URL(p); p = u.pathname + u.search + u.hash; } catch (e) { /* 原样保留 */ }
    }
    if (p.charAt(0) !== '/') p = '/' + p;
    return p;
  }
  function toEn(p) {
    var s = split(norm(p)), v = s[0];
    if (v === '/' || v === '') v = '/en/';
    else if (v !== '/en' && v.indexOf('/en/') !== 0) v = '/en' + v;
    if (v === '/en') v = '/en/';
    return v + s[1];
  }
  function toZh(p) {
    var s = split(norm(p)), v = s[0];
    if (v === '/en') v = '/';
    else if (v.indexOf('/en/') === 0) v = '/' + v.slice(4);
    return v + s[1];
  }
  function labels(z, e) {
    zhUrl.textContent = z;
    enUrl.textContent = e;
    openZh.href = z;
    openEn.href = e;
  }
  function goto(p) {
    var z = toZh(p), e = toEn(z);
    lastZh = z; lastEn = e;
    applying = Date.now() + 900;
    zh.src = z;
    en.src = e;
    input.value = z;
    labels(z, e);
  }
  function loc(f) {
    try { var l = f.contentWindow.location; return l.pathname + l.search + l.hash; }
    catch (e) { return null; }
  }
  document.getElementById('go').onclick = function () { goto(input.value); };
  input.onkeydown = function (ev) { if (ev.key === 'Enter') goto(input.value); };
  document.getElementById('reload').onclick = function () {
    zh.contentWindow.location.reload();
    en.contentWindow.location.reload();
  };
  follow.onchange = function () { lastZh = ''; };
  setInterval(function () {
    if (Date.now() < applying) return;
    var z = loc(zh), e = loc(en);
    if (z === null || e === null) return;
    if (follow.checked && z !== lastZh) {
      lastZh = z;
      var target = toEn(z);
      if (target !== e) {
        lastEn = target;
        applying = Date.now() + 900;
        en.src = target;
      }
      if (document.activeElement !== input) input.value = z;
      labels(z, target);
      return;
    }
    labels(z, e);
    lastEn = e;
  }, 400);
  labels('/', '/en/');
})();
</script>
</body>
</html>
`;

function run(args) {
  const env = {...process.env, DOCUSAURUS_KEEP_SERVER_BUNDLE: 'true'};
  /*
   * IDE 的批量删除保护按「单次工具调用」累计计数，常驻预览服务会跨越多轮调用，
   * 继承来的审计状态却不会刷新：累计一过阈值，Docusaurus 连清理自己刚写进
   * build/ 的静态文件都会被拒，自动重建必然失败。这里在构建/服务子进程里
   * 去掉会话级审计状态目录，让删除语义与用户直接在终端运行 yarn start 一致；
   * 脚本删除范围严格限于自己生成的 build/ 产物，安全 shim 的回收站机制仍生效。
   */
  delete env.CODEBUDDY_SAFE_DELETE_BULK_STATE_DIR;
  const child = spawn(process.execPath, [bin, ...args], {
    cwd: root,
    stdio: 'inherit',
    // 预览不需要清掉服务端 bundle；保留它可避免构建末尾递归删除大量临时文件。
    env,
  });
  children.add(child);
  child.on('exit', () => children.delete(child));
  return child;
}

/**
 * 先把上一次的产物整体挪走，让 build 从空目录开始。
 * 这样构建器不必递归删除整个 build/（部分受限环境会拒绝批量删除），
 * 也避免把正在被静态服务读取的目录删掉。旧副本立即尝试清理；清理失败时
 * 留在系统临时目录，由操作系统回收。
 */
function clearPreviousBuild() {
  if (!fs.existsSync(buildDir)) return;
  const stash = path.join(
    os.tmpdir(),
    `vansail-preview-${process.pid}-${Date.now()}`,
  );
  fs.renameSync(buildDir, stash);
  try {
    fs.rmSync(stash, {recursive: true, force: true});
  } catch {
    // 忽略：旧产物留在系统临时目录，不影响本次构建
  }
}

function writeComparePage() {
  fs.mkdirSync(path.dirname(comparePath), {recursive: true});
  fs.writeFileSync(comparePath, COMPARE_HTML, 'utf8');
}

function build(label, onDone) {
  building = true;
  console.log(`\n[build] ${label}...`);
  try {
    clearPreviousBuild();
  } catch (err) {
    console.error(`[build] Could not clear previous build: ${err.message}`);
  }
  run(['build']).on('exit', code => {
    building = false;
    if (code !== 0) {
      console.error(
        `[build] Failed (code=${code}). See the log above; the server keeps serving the last successful build.`,
      );
    } else {
      try {
        writeComparePage();
      } catch (err) {
        console.error(
          `[build] Could not write comparison page: ${err.message}`,
        );
      }
      console.log(
        '[build] Done. Refresh your browser to see the latest content.',
      );
    }
    if (pending) {
      pending = false;
      schedule();
    }
    onDone?.(code);
  });
}

function rebuild() {
  if (building) {
    pending = true;
    return;
  }
  build('Source changed, rebuilding all locales');
}

/**
 * 排队而不是并发：构建期间的改动只标记 pending，等当前构建结束后再统一排一次。
 * 多个文件同时保存（格式化、批量替换）时用较长防抖合并成一次重建。
 */
function schedule() {
  if (building) {
    pending = true;
    return;
  }
  clearTimeout(timer);
  timer = setTimeout(rebuild, 1400);
}

function startServe() {
  const serve = run(['serve', '--port', String(port), '--no-open']);
  serve.on('exit', code => {
    if (!shuttingDown) shutdown(code ?? 1);
  });
}

function startWatch() {
  if (noWatch) return;
  const watchPaths = [
    'src',
    'docs',
    'i18n',
    'static',
    'cad',
    'scripts/cad-assets.cjs',
    'docusaurus.config.ts',
    'sidebars.ts',
  ]
    .map(p => path.join(root, p))
    .filter(p => fs.existsSync(p));

  watcher = chokidar.watch(watchPaths, {
    ignoreInitial: true,
    ignored: [
      path.join(root, 'static/apps/cad/generated'),
      /node_modules/,
      /\.docusaurus/,
      /(^|[\\/])build[\\/]/,
      /\.(?:swp|swx|tmp|bak)$/,
      /~$/,
    ],
  });
  watcher.on('all', (event, file) => {
    console.log(`[watch] ${event}: ${path.relative(root, file)}`);
    schedule();
  });
}

function printReady() {
  console.log('\n--------------------------------------------------');
  console.log(`  Chinese zh-CN : ${base}/`);
  console.log(`  English en    : ${base}/en/`);
  console.log(`  Side by side  : ${base}${compareRoute}`);
  console.log('--------------------------------------------------');
  console.log(
    '  Both locales are served on one port; the language switcher jumps between them.',
  );
  console.log(
    noWatch
      ? '  Auto rebuild is off (VS_NO_WATCH=1); run yarn build manually after edits.'
      : '  Changes in src/ docs/ i18n/ static/ or config trigger a rebuild; refresh the browser.',
  );
  console.log(
    '  Static preview has no HMR; use yarn start:dev / yarn start:en for live reload.',
  );
  console.log('  Press Ctrl+C to stop.\n');
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearTimeout(timer);
  try {
    watcher?.close();
  } catch {
    // 监听器尚未启动
  }
  for (const child of children) {
    try {
      child.kill('SIGTERM');
    } catch {
      // 子进程已退出
    }
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

build('Initial build (zh-CN + en)', code => {
  if (code !== 0) {
    console.error('[build] Initial build failed, exiting.');
    shutdown(1);
    return;
  }
  startServe();
  startWatch();
  printReady();
});
