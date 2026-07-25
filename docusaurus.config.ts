import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VanSail',
  tagline: 'With Sincere Mind, Build Tech Sail',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://vansail.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // 代码块折叠交互改用 client module 注入（非阻塞），见下方 clientModules
  clientModules: ['./src/clientModules/codeblockCollapse.ts'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'VanSail', // Usually your GitHub org/user name.
  projectName: 'VanSail.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    localeConfigs: {
      'zh-CN': {
        label: '简体中文',
        htmlLang: 'zh-CN',
      },
      en: {
        label: 'English',
        htmlLang: 'en',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/VanSail/VanSail.github.io/tree/main',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        // The search index is built for docs only (no blog).
        indexBlog: false,
      },
    ],
  ],

  themeConfig: {
    // 默认社交分享卡片（1200×630），生成 og:image / twitter:image
    image: 'img/social-card.png',
    metadata: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {
        name: 'keywords',
        content: 'VanSail, 教程, 文档, ROS, AI, 网页工具, Zsh, Git',
      },
      {
        name: 'description',
        content: '教程文档与网页工具 · With Sincere Mind, Build Tech Sail',
      },
      {property: 'og:type', content: 'website'},
      {property: 'og:site_name', content: 'VanSail'},
    ],
    colorMode: {
      disableSwitch: true,
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'VanSail',
      logo: {
        alt: 'VanSail Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/processor-compare',
          position: 'right',
          className: 'header-icon-link header-chip-link',
          'aria-label': 'Processor Compare',
        },
        {
          href: 'https://github.com/VanSail/VanSail.github.io',
          position: 'right',
          className: 'header-icon-link header-github-link',
          'aria-label': 'GitHub repository',
        },
        {
          to: '/docs/guide/',
          position: 'right',
          className: 'header-icon-link header-guide-link',
          'aria-label': '使用指南',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: undefined,
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
