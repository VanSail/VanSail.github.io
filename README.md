# VanSail

开源硬件与实测教程站点，基于 Docusaurus 3，简体中文 / English 双语。

- [VanSail 官网](https://www.vansail.cn/)
- 网页工具
    - [串口助手](https://www.vansail.cn/tools/serial/)
    - [蓝牙探针](https://www.vansail.cn/tools/bluetooth/)
    - [CAD 看图](https://www.vansail.cn/tools/cad/)
    - [AI 实验室](https://www.vansail.cn/tools/ai/)

## 本地开发

要求 Node `>=20 <25`（CI 固定 24，见 `.nvmrc`）与 Yarn 1.22.22。

```bash
yarn install --frozen-lockfile
yarn start          # 双语预览（zh-CN + en，同一端口）
yarn typecheck      # tsc --noEmit
yarn format         # prettier --write
yarn format:check   # 与 CI / 部署流程使用同一条格式检查
yarn build          # 构建 zh-CN + en 到 build/
yarn serve          # 预览构建产物
```

### 双语预览与单语言热更新

Docusaurus 的每个 locale 是独立 SPA，单个 dev server 一次只能服务一种语言，并行启动多个 dev server 会争用同一份 `.docusaurus` 缓存而报错。因此默认 `yarn start`（`scripts/start-i18n.mjs`）改用「一次 `docusaurus build` 构建全部语言 → `docusaurus serve` 一个端口同时提供」的方式：

| 地址 | 内容 |
| --- | --- |
| `http://localhost:3000/` | 简体中文 |
| `http://localhost:3000/en/` | English |
| `http://localhost:3000/__i18n__` | 中英并排对照（可输入路径同步跳转、跟随中文导航） |

导航栏的语言切换按钮在预览里可以直接互跳。脚本会监听 `src/`、`docs/`、`i18n/`、`static/`、`docusaurus.config.ts`、`sidebars.ts`，变化后自动重建，刷新浏览器即生效（本站全量构建约 2 秒）。对照页由脚本写入 `build/`，无需额外端口。

代价是静态预览没有 HMR。改动前端代码需要热更新时，改用单语言 dev server：

```bash
yarn start:dev      # 默认 zh-CN，带 HMR（等同旧版 yarn start）
yarn start:zh       # 同上
yarn start:en       # --locale en，端口 3001
```

可用环境变量：`VS_PORT` 修改预览端口（默认 3000），`VS_NO_WATCH=1` 关闭自动重建。

## 目录结构

- `src/pages/`：首页、产品、贡献指南、工具页（工具页用 iframe 嵌入 `static/apps/`）
- `src/components/`：首页各区块与复用组件；`src/theme/`：Docusaurus 主题覆盖
- `docs/`：中文文档语法教程；`i18n/en/docusaurus-plugin-content-docs/current/`：英文翻译，需与 `docs/` 一一对应
- `static/`：静态资源（CNAME、robots.txt、工具应用、图片）
- `scripts/start-i18n.mjs`：本地双语预览（构建 + 静态服务 + 自动重建 + 并排对照页）
- `_archive/` 与 `design/`：历史归档与视觉概念稿，**非构建输入**，已移出版本控制，如需留存请放到独立归档分支或对象存储

## 内容与链接约定

- 文档内站内链接用相对路径（`./code`、`../advanced/tabs`），Docusaurus 会自动补当前语言前缀。根绝对路径 `/docs/...` 总是指向默认语言（简体中文），在英文站会跳回中文页面。
- 每篇文档需带 `title` 与 `description` frontmatter，用于页面标题与搜索结果描述。
- 新增文档后同步补英文翻译，否则英文站会回退到中文内容。

## 部署

push 到 `main` 触发 `.github/workflows/deploy.yml`：先跑 `yarn typecheck` 与 `yarn format:check`，再构建两份语言产物，通过 GitHub Actions 部署到 GitHub Pages（自定义域名 `www.vansail.cn` 由 `static/CNAME` 指定）。PR 额外跑 commitlint 与工具页冒烟测试（`.github/workflows/ci.yml`）。

站点会生成 `sitemap.xml` 与 `en/sitemap.xml`，两者都在 `static/robots.txt` 中声明。
