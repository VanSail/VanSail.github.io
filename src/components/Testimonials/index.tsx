import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {LText} from '@site/src/types';
import styles from './styles.module.css';

/** 首页流动卡片框：横向无缝滚动，每张卡展示一个网站特点标签。 */
const FEATURES: LText[] = [
  {zh: '开源硬件', en: 'Open Hardware'},
  {zh: '嵌入式开发', en: 'Embedded Dev'},
  {zh: 'AI 智能体', en: 'AI Agents'},
  {zh: 'STM32 工具链', en: 'STM32 Toolchain'},
  {zh: 'ROS 机器人', en: 'ROS Robotics'},
  {zh: '思维导图', en: 'Mind Map'},
  {zh: '串口调试', en: 'Serial Monitor'},
  {zh: '社区共建', en: 'Community'},
];

export default function Testimonials(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  // 复制一份实现无缝循环滚动
  const loop = [...FEATURES, ...FEATURES];

  return (
    <section className={styles.section} aria-label="网站特点">
      <div className={styles.viewport}>
        <div className={styles.track}>
          {loop.map((f, i) => (
            <div className={styles.card} key={i}>
              <span className={styles.tag}>{f[locale]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
