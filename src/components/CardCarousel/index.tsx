import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Card, type CardItem} from '@site/src/data/cards';
import styles from './styles.module.css';

/**
 * 首页横向自动滚动卡片带：两行卡片、方向相反，构成交错流动效果。
 * 每行复制一份实现无缝循环滚动；悬停/聚焦暂停便于点击；左右边缘柔和淡出。
 * 复用 data/cards 的 Card 组件，风格与导航分类一致。
 */
export default function CardCarousel({items}: {items: CardItem[]}): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';

  // 将卡片拆成两行，避免同一卡片在相邻行重复出现
  // 首行向右循环、次行向左循环，形成交错流动效果
  const mid = Math.ceil(items.length / 2);
  const rows: {list: CardItem[]; reverse: boolean}[] = [
    {list: items.slice(0, mid), reverse: true},
    {list: items.slice(mid), reverse: false},
  ];

  return (
    <section className={styles.carousel} aria-label="卡片导航">
      {rows.map(({list, reverse}, r) => {
        // 复制一份卡片实现无缝循环滚动
        const loopItems = [...list, ...list];
        return (
          <div className={styles.viewport} key={r}>
            <div
              className={`${styles.track} ${reverse ? styles.trackReverse : ''}`}
            >
              {loopItems.map((item, i) => (
                <div className={styles.slide} key={`${item.to}-${i}`}>
                  <Card item={item} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
