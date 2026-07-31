import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {FEATURE_HIGHLIGHTS} from '@site/src/data/features';
import styles from './styles.module.css';

/** 首页卡片与特点流动框之间的特性介绍区块。 */
export default function SectionPlaceholder(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  return (
    <section className={styles.placeholder} aria-label="网站特点">
      {FEATURE_HIGHLIGHTS.map(h => (
        <div className={styles.item} key={h.title.en}>
          <span className={styles.itemTitle}>{h.title[locale]}</span>
          <span className={styles.itemDesc}>{h.desc[locale]}</span>
        </div>
      ))}
    </section>
  );
}
