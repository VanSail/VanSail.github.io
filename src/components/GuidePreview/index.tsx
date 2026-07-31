import type {ReactElement} from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import {GUIDE_GROUPS} from '@site/src/data/guideNav';

/**
 * 首页中段「文档指南」预览区：左侧书本 logo + 简介 + 查看全部，
 * 右侧用一个可滚动的目录框列出文档分组与文章，点击文章跳转对应文档页。
 * 数据来自 guideNav.tsx。
 */
export default function GuidePreview(): ReactElement {
  const {pathname} = useLocation();
  const locale: 'zh' | 'en' = pathname.startsWith('/en/') ? 'en' : 'zh';
  const isZh = locale === 'zh';
  // 文档根：英文下带 /en 前缀
  const docsRoot = locale === 'en' ? '/en/docs/guide' : '/docs/guide';

  return (
    <section
      className={styles.wrap}
      aria-label={isZh ? '文档指南' : 'Documentation Guide'}
    >
      <div className={styles.inner}>
        {/* 左侧：教程 logo + 简介 */}
        <aside className={styles.aside}>
          <div className={styles.logoBox} aria-hidden="true">
            <svg
              className={styles.bookLogo}
              viewBox="0 0 48 48"
              role="img"
              aria-label={isZh ? '文档指南' : 'Documentation Guide'}
            >
              {/* 左书页 */}
              <path
                d="M24 11C19 7 11 7 7 9v28c4-2 12-2 17 2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              {/* 右书页 */}
              <path
                d="M24 11c5-4 13-4 17-2v28c-4-2-12-2-17 2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              {/* 书脊 */}
              <line
                x1="24"
                y1="11"
                x2="24"
                y2="40"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className={styles.asideTitle}>
            {isZh ? '文档指南' : 'Documentation Guide'}
          </h2>
          <p className={styles.asideDesc}>
            {isZh
              ? '系统讲解本站文档的写作规范与组件用法。'
              : 'How to write docs on this site — specs and components.'}
          </p>
          <Link className={styles.allLink} to={`${docsRoot}`}>
            {isZh ? '查看全部 ›' : 'View all ›'}
          </Link>
        </aside>

        {/* 右侧：可滚动的目录框 */}
        <div className={styles.catalogBox}>
          {GUIDE_GROUPS.map(group => (
            <div className={styles.group} key={group.dir}>
              <Link
                className={styles.groupTitle}
                to={`${docsRoot}/${group.dir}`}
              >
                {isZh ? group.label.zh : group.label.en}
              </Link>
              <ul className={styles.list}>
                {group.articles.map(article => (
                  <li key={article.slug}>
                    <Link
                      className={styles.item}
                      to={`${docsRoot}/${group.dir}/${article.slug}`}
                    >
                      {isZh ? article.title.zh : article.title.en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
