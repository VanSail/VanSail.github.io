import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {FEATURE_TAGS} from '@site/src/data/features';
import styles from './styles.module.css';

/** 首页特点流动条：横向无缝滚动，每张卡展示一个网站特点标签。 */
export default function Testimonials(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  // 复制一份实现无缝循环滚动
  const loop = [...FEATURE_TAGS, ...FEATURE_TAGS];

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
