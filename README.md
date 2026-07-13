# VanSail

> With Sincere Mind, Build Tech Sail

VanSail 是一个基于 [Docusaurus](https://docusaurus.io/) 构建的个人技术站点。

## 环境要求

- **Node.js**：>= 20.0
- **Yarn**：1.x（classic）
- **Git**：任意较新版本

```bash
node --version   # 需 >= 20
```

## 本地开发

```bash
git clone https://github.com/VanSail/VanSail.github.io.git
cd VanSail.github.io
yarn install
yarn start
```

开发服务器默认运行在 `http://localhost:3000`，支持热更新。

## 构建与预览

```bash
yarn build     # 生成静态站点到 build/
yarn serve     # 本地预览生产构建
```

## 部署

站点通过 GitHub Pages 部署：

```bash
yarn deploy
```

## 项目结构

```
.
├── docs/                    # 文档教程（ros2、zsh 等分类）
├── src/
│   ├── components/          # 自定义组件（如微信二维码悬停弹层）
│   ├── pages/               # 页面（首页 index.tsx、串口监视器等）
│   ├── theme/               # 覆盖的 Docusaurus 主题（导航栏等）
│   └── css/                 # 全局样式 custom.css
├── static/
│   └── img/                 # 静态图片（logo、favicon、微信二维码等）
├── docusaurus.config.ts     # 站点配置（标题、导航栏、主题等）
├── sidebars.ts              # 文档侧边栏配置
└── package.json
```

## 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 配合 husky 与 commitlint 进行提交校验。

格式：`<type>(<scope>): <description>`。类型小写、主题不以句号结尾、长度不超过 100 字符。
允许的类型：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`。
