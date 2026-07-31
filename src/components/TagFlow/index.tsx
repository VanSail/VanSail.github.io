import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type {LText} from '@site/src/types';
import styles from './styles.module.css';

/** 首页流动的特色标签。可按需增删 label/to，点击跳转到对应教程/页面。 */
const TAGS: {label: LText; to: string}[] = [
  {label: {zh: '思维导图', en: 'Mind Map'}, to: '/mindmap'},
  {label: {zh: '串口调试', en: 'Serial Monitor'}, to: '/serial-monitor'},
  {
    label: {zh: '处理器对比', en: 'Processor Compare'},
    to: '/processor-compare',
  },
  {label: {zh: 'ROS 机器人', en: 'ROS Robotics'}, to: '/robots'},
  {label: {zh: '嵌入式开发', en: 'Embedded Dev'}, to: '/embedded'},
  {label: {zh: 'AI 智能体', en: 'AI Agents'}, to: '/ai'},
  {label: {zh: 'STM32 工具', en: 'STM32 Tools'}, to: '/docs/stm32/dev-tools'},
  {label: {zh: '社区共建', en: 'Join Us'}, to: '/join'},
];

/** 基于索引的确定性伪随机，保证 SSR 与客户端渲染一致（避免 hydration 不匹配）。 */
const rand = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 1.3) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * 首页偏下的标签面板：3 列网格排布，每个便签各自做无规则的三角轨迹漂浮，
 * 不再是整体向右滑动；悬停某便签时暂停其漂浮，便于点击跳转。
 */
export default function TagFlow(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  return (
    <section className={styles.flow} aria-label="特色标签">
      <div className={styles.viewport}>
        <div className={styles.grid}>
          {TAGS.map((t, i) => {
            const dur = (4 + rand(i + 1) * 4).toFixed(2);
            const delay = (-rand(i + 2) * Number(dur)).toFixed(2);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={styles.tag}
                style={
                  {
                    '--dur': `${dur}s`,
                    '--delay': `${delay}s`,
                  } as React.CSSProperties
                }
              >
                <span className={styles.tagDot} aria-hidden="true" />
                {t.label[locale]}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
