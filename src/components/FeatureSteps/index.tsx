import type {ReactElement} from 'react';
import {useLocation} from '@docusaurus/router';
import styles from './styles.module.css';
import {FEATURE_HIGHLIGHTS} from '@site/src/data/features';

/**
 * 首页中段「网站特点」竖向步骤条。
 * 复用 features.ts 的 FEATURE_HIGHLIGHTS（开源可验证 / 持续更新 / 社区共建），
 * 以竖向带序号与连接线的步骤条呈现，区别于卡片网格。
 */
export default function FeatureSteps(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';

  return (
    <section
      className={styles.wrap}
      aria-label={locale === 'zh' ? '网站特点' : 'Highlights'}
    >
      <div className={styles.inner}>
        <ol className={styles.steps}>
          {FEATURE_HIGHLIGHTS.map((item, i) => (
            <li className={styles.step} key={item.title.zh}>
              <span className={styles.index} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.body}>
                <h3 className={styles.title}>
                  {locale === 'zh' ? item.title.zh : item.title.en}
                </h3>
                <p className={styles.desc}>
                  {locale === 'zh' ? item.desc.zh : item.desc.en}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
