import type {LText} from '@site/src/types';

export interface RosArticle {
  /** 文档 slug 后缀，完整路径为 /docs/robot/ros2/<group>/<slug>；外链请改用 to */
  slug?: string;
  /** 外链地址（https://...）；与 slug 二选一 */
  to?: string;
  title: LText;
}

export interface RosGroup {
  /** 分组目录，用于拼出分组索引页与文章路径 */
  dir: string;
  label: LText;
  articles: RosArticle[];
}

/**
 * 首页「机器人」预览区 ROS 相关的目录数据。
 * 与 docs/robot/ros2 下的实际文档保持对应，新增教程只需在此追加。
 * 分组索引页路径为 /docs/robot/ros2/<dir>，内链文章路径为 /docs/robot/ros2/<dir>/<slug>。
 */
export const ROS_GROUPS: RosGroup[] = [
  {
    dir: 'basic',
    label: {zh: 'ROS 2 基础', en: 'ROS 2 Basics'},
    articles: [
      {
        slug: 'environment-setup',
        title: {zh: '环境搭建', en: 'Environment Setup'},
      },
    ],
  },
];

export const ROS1_GROUPS: RosGroup[] = [
  {
    dir: 'ros1',
    label: {zh: 'ROS 1', en: 'ROS 1'},
    articles: [
      {
        to: 'https://wiki.ros.org/melodic',
        title: {zh: 'Melodic', en: 'Melodic'},
      },
      {to: 'https://wiki.ros.org/noetic', title: {zh: 'Noetic', en: 'Noetic'}},
    ],
  },
];

export const ROS2_DISTRO_GROUPS: RosGroup[] = [
  {
    dir: 'ros2',
    label: {zh: 'ROS 2', en: 'ROS 2'},
    articles: [
      {
        to: 'https://docs.ros.org/en/humble/',
        title: {zh: 'Humble', en: 'Humble'},
      },
      {to: 'https://docs.ros.org/en/jazzy/', title: {zh: 'Jazzy', en: 'Jazzy'}},
    ],
  },
];
