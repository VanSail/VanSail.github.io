import type {ReactNode} from 'react';
import styles from './styles.module.css';

/**
 * 首页卡片与标签之间的占位区块。
 * 仅用于占好内容区域位置，具体模块由用户后续替换。
 */
export default function SectionPlaceholder({
  label = '内容占位区',
  hint = '后续在此放置专题 / 教程 / 导航等模块',
}: {
  label?: string;
  hint?: string;
}): ReactNode {
  return (
    <section className={styles.placeholder} aria-label={label}>
      <div className={styles.box}>
        <span className={styles.label}>{label}</span>
        <span className={styles.hint}>{hint}</span>
      </div>
    </section>
  );
}
