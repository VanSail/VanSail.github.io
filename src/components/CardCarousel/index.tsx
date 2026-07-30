import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Card, type CardItem} from '@site/src/data/cards';
import styles from './styles.module.css';

/**
 * 首页横向自动滚动卡片带：一行展示 3 张卡片（响应式 2/1 张）。
 * 卡片复制一份，track 平移 -50% 实现无缝循环；悬停/聚焦暂停便于点击；
 * 左右边缘柔和淡出。复用 data/cards 的 Card 组件，风格与导航分类一致。
 */
export default function CardCarousel({items}: {items: CardItem[]}): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  // 复制一份卡片实现无缝循环滚动
  const loopItems = [...items, ...items];

  return (
    <section className={styles.carousel} aria-label="卡片导航">
      <div className={styles.viewport}>
        <div className={styles.track}>
          {loopItems.map((item, i) => (
            <div className={styles.slide} key={`${item.to}-${i}`}>
              <Card item={item} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
