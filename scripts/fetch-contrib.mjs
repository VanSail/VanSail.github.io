// 构建时抓取 GitHub 贡献数据，写入 static/contrib-data.json。
// 组件改为读取本地静态文件，避免运行时依赖第三方 API（解决图加载失败的问题）。
// 抓取失败时：若已存在缓存文件则保留，否则生成占位数据，保证构建不中断、图仍可渲染。
import {writeFile, access} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outPath = resolve(root, 'static', 'contrib-data.json');

const API = 'https://github-contributions-api.jogruber.de/v4/VanSail';

async function fetchData() {
  const resp = await fetch(API, {headers: {'User-Agent': 'VanSail-site'}});
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const json = await resp.json();
  const raw = json.contributions ?? json.contribs ?? [];
  const contributions = raw.map((d) => ({
    date: String(d.date),
    count: Number(d.count ?? 0),
    level: [0, 1, 2, 3, 4].includes(d.level) ? d.level : 0,
  }));
  return {contributions};
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function writePlaceholder(p) {
  const contributions = [];
  const today = new Date();
  for (let i = 0; i < 371; i += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - (371 - i));
    contributions.push({
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    });
  }
  await writeFile(p, JSON.stringify({contributions}));
}

async function main() {
  try {
    const data = await fetchData();
    if (!data.contributions.length) throw new Error('empty payload');
    await writeFile(outPath, JSON.stringify(data));
    console.log(
      `[fetch-contrib] wrote ${data.contributions.length} days to static/contrib-data.json`,
    );
  } catch (err) {
    console.warn(`[fetch-contrib] upstream fetch failed: ${err.message}`);
    if (await fileExists(outPath)) {
      console.log('[fetch-contrib] keeping existing static/contrib-data.json');
    } else {
      await writePlaceholder(outPath);
      console.log(
        '[fetch-contrib] wrote placeholder static/contrib-data.json (no upstream data)',
      );
    }
  }
}

main();
