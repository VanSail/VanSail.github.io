import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VanSail',
  tagline: '扬帆起航，探索无界',
  favicon: 'img/favicon-blue-sail.ico',

  future: {
    v4: true,
  },

  url: 'https://www.vansail.cn',
  baseUrl: '/',

  // GitHub Pages 部署信息
  organizationName: 'VanSail',
  projectName: 'VanSail.github.io',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en'],
    localeConfigs: {
      'zh-CN': {label: '简体中文', htmlLang: 'zh-CN'},
      en: {label: 'English', htmlLang: 'en'},
    },
  },

  plugins: [require.resolve('./scripts/cad-assets.cjs')],

  presets: [
    [
      'classic',
      {
        // 文档语法教程（/docs）：guide 写作教程，中英双语；产品文档另有独立入口
        docs: {
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // 代码块折叠交互与正文图片懒加载（随主 bundle 异步执行，路由切换后依旧生效）
  clientModules: ['./src/clientModules/codeblockCollapse'],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      {name: 'twitter:card', content: 'summary_large_image'},
      {
        name: 'keywords',
        content:
          'VanSail, 开源硬件, open source hardware, 开源文档, 实测教程, hands-on tutorials, 社区共建, community, 嵌入式, embedded',
      },
      {
        name: 'description',
        content:
          '开源硬件与实测教程：硬件、文档皆开源，由社区共同构建。Open-source hardware and hands-on tutorials, with hardware and docs built by the community.',
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
      // 左上角直接使用站点名字符；胶囊章节导航由主题组件渲染
      title: 'VanSail',
      items: [{type: 'localeDropdown', position: 'right'}],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
