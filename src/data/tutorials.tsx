import type {LText} from '@site/src/types';
import {GUIDE_GROUPS} from './guideNav';

export type TutorialIcon = 'book' | 'mcu' | 'ros' | 'ai';

export interface TutorialLink {
  label: LText;
  /** 内部文档路径（组件会自动加 /en 前缀）或以 http 开头的外链 */
  to: string;
}

export interface TutorialGroup {
  label: LText;
  links: TutorialLink[];
}

export interface Tutorial {
  id: string;
  title: LText;
  desc: LText;
  icon: TutorialIcon;
  /** 文档根路径（内部文档，组件自动加 /en 前缀），用于「查看全部」 */
  entry: string;
  /** 详情区分组目录 */
  groups: TutorialGroup[];
}

/**
 * 首页「探索」联动区的教程数据：左侧竖向滚动的教程卡片，
 * 右侧详情区随居中卡片切换。新增教程只需在此追加一项。
 */
export const TUTORIALS: Tutorial[] = [
  {
    id: 'doc-guide',
    title: {zh: '文档指南', en: 'Documentation Guide'},
    desc: {
      zh: '从基础语法到进阶技巧，系统讲解本站文档的写作规范与组件用法。',
      en: 'From basics to advanced tips — how to write docs on this site.',
    },
    icon: 'book',
    entry: '/docs/guide',
    // 复用文档指南目录数据
    groups: GUIDE_GROUPS.map(g => ({
      label: g.label,
      links: g.articles.map(a => ({
        label: a.title,
        to: `/docs/guide/${g.dir}/${a.slug}`,
      })),
    })),
  },
  {
    id: 'stm32',
    title: {zh: 'STM32 教程', en: 'STM32 Tutorials'},
    desc: {
      zh: '面向 STM32 系列单片机的嵌入式开发教程与开发工具说明。',
      en: 'Embedded development tutorials and tooling for the STM32 family.',
    },
    icon: 'mcu',
    entry: '/docs/stm32',
    groups: [
      {
        label: {zh: '开发工具', en: 'Dev Tools'},
        links: [
          {
            label: {zh: '开发工具', en: 'Dev Tools'},
            to: '/docs/stm32/dev-tools',
          },
        ],
      },
    ],
  },
  {
    id: 'ros',
    title: {zh: 'ROS 机器人', en: 'ROS Robotics'},
    desc: {
      zh: '机器人操作系统 ROS 的发行版与核心概念教程，覆盖 Noetic 到 Jazzy。',
      en: 'ROS distributions and core concepts, from Noetic to Jazzy.',
    },
    icon: 'ros',
    entry: 'https://docs.ros.org',
    groups: [
      {
        label: {zh: 'ROS 发行版', en: 'ROS Distros'},
        links: [
          {
            label: {zh: 'Noetic', en: 'Noetic'},
            to: 'https://wiki.ros.org/noetic',
          },
          {
            label: {zh: 'Humble', en: 'Humble'},
            to: 'https://docs.ros.org/en/humble/',
          },
          {
            label: {zh: 'Jazzy', en: 'Jazzy'},
            to: 'https://docs.ros.org/en/jazzy/',
          },
        ],
      },
    ],
  },
  {
    id: 'ai',
    title: {zh: 'AI 代理', en: 'AI Agents'},
    desc: {
      zh: '开源 AI 代理框架与模型，自主规划并调用工具完成目标。',
      en: 'Open-source AI agent frameworks and models that plan and use tools.',
    },
    icon: 'ai',
    entry: 'https://opencode.ai',
    groups: [
      {
        label: {zh: '代理与模型', en: 'Agents & Models'},
        links: [
          {label: {zh: 'OpenCode', en: 'OpenCode'}, to: 'https://opencode.ai'},
          {label: {zh: 'OpenClaw', en: 'OpenClaw'}, to: 'https://opencode.ai'},
          {label: {zh: 'Hermes', en: 'Hermes'}, to: 'https://opencode.ai'},
        ],
      },
    ],
  },
];
