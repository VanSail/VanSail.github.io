import type {LText} from '@site/src/types';
import {
  ROS_GROUPS,
  ROS1_GROUPS,
  ROS2_DISTRO_GROUPS,
  type RosArticle,
} from './rosNav';

const rosLink = (dir: string, a: RosArticle) => ({
  label: a.title,
  to: a.to ?? `/docs/robot/ros2/${dir}/${a.slug}`,
});

const toGroups = (
  groups: {dir: string; label: LText; articles: RosArticle[]}[],
) =>
  groups.map(g => ({
    label: g.label,
    links: g.articles.map(a => rosLink(g.dir, a)),
  }));

export type TutorialIcon = 'book' | 'mcu' | 'ros' | 'ai' | 'docker';

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
  /** 文档根路径：内部文档（自动加 /en 前缀）或外链。用于「查看全部」 */
  entry: string;
  /** 导航栏分类链接地址（覆盖 entry）。仅用于导航栏跳转，需为站内路径 */
  navTo?: string;
  /** 本站是否有对应的真实教程文档；true 时右列以卡片+「查看全部」呈现，
   *  false 时仅平铺展示分类与分类下的内容（不暗示有站内完整体系） */
  hasDocs?: boolean;
  /** 详情区分组目录 */
  groups: TutorialGroup[];
}

/**
 * 首页「探索」联动区的教程数据：左侧竖向滚动的教程卡片，
 * 右侧详情区随居中卡片切换。新增教程只需在此追加一项。
 */
export const TUTORIALS: Tutorial[] = [
  {
    id: 'embedded',
    title: {zh: '嵌入式', en: 'Embedded'},
    desc: {
      zh: '面向 STM32 等微控制器的嵌入式开发教程与开发工具说明。',
      en: 'Embedded development tutorials and tooling for STM32 and more.',
    },
    icon: 'mcu',
    entry: '/docs/embedded',
    navTo: '/embedded',
    hasDocs: true,
    groups: [
      {
        label: {zh: '开发工具', en: 'Dev Tools'},
        links: [
          {
            label: {zh: '开发工具', en: 'Dev Tools'},
            to: '/docs/embedded/dev-tools',
          },
          {
            label: {zh: '串口助手', en: 'Serial Monitor'},
            to: '/serial-monitor',
          },
        ],
      },
    ],
  },
  {
    id: 'ros',
    title: {zh: '机器人', en: 'Robotics'},
    desc: {
      zh: '机器人操作系统 ROS 的发行版与核心概念教程，覆盖 ROS 1 到 ROS 2。',
      en: 'ROS distributions and core concepts, from ROS 1 to ROS 2.',
    },
    icon: 'ros',
    entry: '/docs/robot/ros2',
    navTo: '/robots',
    hasDocs: true,
    groups: [
      ...toGroups(ROS1_GROUPS),
      ...toGroups(ROS2_DISTRO_GROUPS),
      ...toGroups(ROS_GROUPS),
    ],
  },
  {
    id: 'ai',
    title: {zh: '智能体', en: 'Agents'},
    desc: {
      zh: '开源 AI 代理框架与模型，自主规划并调用工具完成目标。',
      en: 'Open-source AI agent frameworks and models that plan and use tools.',
    },
    icon: 'ai',
    entry: 'https://opencode.ai',
    navTo: '/ai',
    groups: [
      {
        label: {zh: '代理与模型', en: 'Agents & Models'},
        links: [
          {label: {zh: 'OpenCode', en: 'OpenCode'}, to: 'https://opencode.ai'},
          {label: {zh: 'OpenClaw', en: 'OpenClaw'}, to: 'https://openclaw.ai'},
          {
            label: {zh: 'Hermes Agent', en: 'Hermes Agent'},
            to: 'https://hermes-agent.org',
          },
        ],
      },
    ],
  },
  {
    id: 'toolbox',
    title: {zh: '工具箱', en: 'Toolbox'},
    desc: {
      zh: '实用软件与开发工具的使用教程，聚合 Docker、Conda、思维导图等。',
      en: 'Usage guides for handy software and dev tools — Docker, Conda, Mind Map and more.',
    },
    icon: 'docker',
    entry: '/toolbox',
    navTo: '/toolbox',
    groups: [
      {
        label: {zh: 'Docker 基础', en: 'Docker Basics'},
        links: [
          {
            label: {zh: '什么是 Docker', en: 'What is Docker'},
            to: '/docs/docker/basics/what-is-docker',
          },
          {
            label: {zh: '核心概念', en: 'Core Concepts'},
            to: '/docs/docker/basics/concepts',
          },
          {
            label: {zh: '安装 Docker', en: 'Install Docker'},
            to: '/docs/docker/basics/install',
          },
        ],
      },
      {
        label: {zh: 'Docker 命令', en: 'Docker Commands'},
        links: [
          {
            label: {zh: '镜像命令', en: 'Image Commands'},
            to: '/docs/docker/commands/images',
          },
          {
            label: {zh: '容器命令', en: 'Container Commands'},
            to: '/docs/docker/commands/containers',
          },
          {
            label: {zh: '数据卷命令', en: 'Volume Commands'},
            to: '/docs/docker/commands/volume',
          },
          {
            label: {zh: '网络命令', en: 'Network Commands'},
            to: '/docs/docker/commands/network',
          },
          {
            label: {zh: 'Compose 命令', en: 'Compose Commands'},
            to: '/docs/docker/commands/compose',
          },
        ],
      },
      {
        label: {zh: 'Docker 实战', en: 'Docker Hands-on'},
        links: [
          {
            label: {zh: '编写 Dockerfile', en: 'Writing a Dockerfile'},
            to: '/docs/docker/hands-on/dockerfile',
          },
          {
            label: {zh: '镜像瘦身', en: 'Image Slimming'},
            to: '/docs/docker/hands-on/image-slimming',
          },
        ],
      },
      {
        label: {zh: 'Docker 速查', en: 'Docker Reference'},
        links: [
          {
            label: {zh: '命令速查表', en: 'Command Cheatsheet'},
            to: '/docs/docker/reference/cheatsheet',
          },
        ],
      },
      {
        label: {zh: 'Conda 基础', en: 'Conda Basics'},
        links: [
          {
            label: {zh: '什么是 Conda', en: 'What is Conda'},
            to: '/docs/conda/basics/what-is-conda',
          },
          {
            label: {zh: '核心概念', en: 'Core Concepts'},
            to: '/docs/conda/basics/concepts',
          },
          {
            label: {
              zh: '安装 Anaconda / Miniconda',
              en: 'Install Anaconda / Miniconda',
            },
            to: '/docs/conda/basics/install',
          },
        ],
      },
      {
        label: {zh: 'Conda 命令', en: 'Conda Commands'},
        links: [
          {
            label: {zh: '环境管理', en: 'Environment'},
            to: '/docs/conda/commands/environment',
          },
          {
            label: {zh: '包管理', en: 'Packages'},
            to: '/docs/conda/commands/packages',
          },
        ],
      },
      {
        label: {zh: 'Conda 实战', en: 'Conda Hands-on'},
        links: [
          {
            label: {zh: 'Jupyter 开发', en: 'Jupyter'},
            to: '/docs/conda/hands-on/jupyter',
          },
          {
            label: {zh: '导出导入环境', en: 'Export / Import'},
            to: '/docs/conda/hands-on/export-import',
          },
        ],
      },
      {
        label: {zh: 'Conda 速查', en: 'Conda Reference'},
        links: [
          {
            label: {zh: '命令速查表', en: 'Command Cheatsheet'},
            to: '/docs/conda/reference/cheatsheet',
          },
        ],
      },
      {
        label: {zh: '网页工具', en: 'Web Tools'},
        links: [
          {label: {zh: '思维导图', en: 'Mind Map'}, to: '/mindmap'},
          {label: {zh: '芯片参数', en: 'Chip Specs'}, to: '/processor-compare'},
        ],
      },
    ],
  },
];
