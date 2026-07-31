import type {LText} from '@site/src/types';

/** 首页底部流动标签条（Testimonials）展示的网站特点标签。 */
export const FEATURE_TAGS: LText[] = [
  {zh: '开源硬件', en: 'Open Hardware'},
  {zh: '嵌入式开发', en: 'Embedded Dev'},
  {zh: 'AI 智能体', en: 'AI Agents'},
  {zh: 'STM32 工具链', en: 'STM32 Toolchain'},
  {zh: 'ROS 机器人', en: 'ROS Robotics'},
  {zh: '思维导图', en: 'Mind Map'},
  {zh: '串口调试', en: 'Serial Monitor'},
  {zh: '社区共建', en: 'Community'},
];

/** 首页中段竖向步骤条（FeatureSteps）的要点。 */
export const FEATURE_HIGHLIGHTS: {title: LText; desc: LText}[] = [
  {
    title: {zh: '开源可验证', en: 'Open & Verified'},
    desc: {
      zh: '教程配套代码都能直接跑，不藏着掖着',
      en: 'Every tutorial ships runnable code — nothing hidden',
    },
  },
  {
    title: {zh: '持续更新', en: 'Always Fresh'},
    desc: {
      zh: '跟着上游版本走，避免看完就过时',
      en: 'Tracks upstream releases so docs never go stale',
    },
  },
  {
    title: {zh: '社区共建', en: 'Community Built'},
    desc: {
      zh: '任何人都能提交修正、补充案例',
      en: 'Anyone can fix, extend and contribute examples',
    },
  },
];
