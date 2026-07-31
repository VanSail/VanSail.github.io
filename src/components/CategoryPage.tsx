import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Card, AnimatedSection, type CardItem} from '@site/src/data/cards';
import type {LText} from '@site/src/types';
import PageHero from '@site/src/components/PageHero';
import styles from '@site/src/pages/index.module.css';

type HeroType = 'ai' | 'robots' | 'embedded';

interface CategoryPageProps {
  /** 对应 PageHero 的动画类型 */
  heroType: HeroType;
  /** 页面标题与描述（中英文） */
  meta: {title: LText; desc: LText};
  /** 卡片数据数组，直接引用 data/cards.tsx 中导出的数组 */
  items: CardItem[];
}

/**
 * 分类页统一骨架：动态动画区 + 卡片网格。
 *
 * 维护要点：
 * - 新增一个分类：在 src/data/cards.tsx 定义数据数组，
 *   再新建一个极简页面调用本组件即可，无需重复样板代码。
 * - 卡片宽度：网格固定 3 列，单张卡片自动按 1/3 宽度居中显示，
 *   不会铺满整行，各页面视觉统一。
 */
export default function CategoryPage({
  heroType,
  meta,
  items,
}: CategoryPageProps): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  return (
    <Layout title={meta.title[locale]} description={meta.desc[locale]}>
      <main className={styles.page}>
        <PageHero type={heroType} />
        <AnimatedSection>
          <div className={styles.grid}>
            {items.map(item => (
              <Card key={item.to} item={item} locale={locale} />
            ))}
          </div>
        </AnimatedSection>
      </main>
    </Layout>
  );
}
