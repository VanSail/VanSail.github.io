import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VanSail',
  tagline: '扬帆起航，探索无界',
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

  themeConfig: {
    // 默认社交分享卡片（1200×630），生成 og:image / twitter:image
    image: 'img/social-card.png',
    metadata: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {
        name: 'keywords',
        content: 'VanSail, 教程, 文档, ROS, AI, Zsh, Git',
      },
      {
        name: 'description',
        content: '扬帆起航，探索无界',
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
        src: 'img/logo.svg',
        alt: 'VanSail',
      },
      items: [
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
