import React, {type ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import clsx from 'clsx';
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import {TUTORIALS} from '@site/src/data/tutorials';

import styles from './styles.module.css';

/** 导航栏分类：与探索板块数据同源，避免路径漂移 */
const NAV_CATEGORY_IDS = ['ai', 'toolbox', 'ros', 'embedded'];
const navCategories = TUTORIALS.filter(t => NAV_CATEGORY_IDS.includes(t.id));

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={error =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }
        >
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({
  left,
  center,
  right,
}: {
  left: ReactNode;
  center?: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className={clsx('navbar__inner', styles.navbarInner)}>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          'navbar__items',
        )}
      >
        {left}
      </div>
      {center && (
        <div className={clsx(styles.searchCenter, 'navbar__items')}>
          {center}
        </div>
      )}
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right',
        )}
      >
        {right}
      </div>
    </div>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const {pathname} = useLocation();
  const docsPrefix = pathname.startsWith('/en/') ? '/en' : '';
  const isZh = !pathname.startsWith('/en/');

  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  // 语言切换始终置于最右侧
  const localeItems = rightItems.filter(item => item.type === 'localeDropdown');
  const otherRightItems = rightItems.filter(
    item => item.type !== 'localeDropdown',
  );

  return (
    <NavbarContentLayout
      left={
        // TODO stop hardcoding items?
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <NavbarItems items={leftItems} />
          <div className="navbarCats">
            {navCategories.map(cat => {
              const to = cat.navTo ?? cat.entry;
              const external = to.startsWith('http');
              const href = external ? to : `${docsPrefix}${to}`;
              const active =
                !external &&
                (pathname === href || pathname.startsWith(`${href}/`));
              return (
                <a
                  key={cat.id}
                  href={href}
                  className={
                    'navbar__link navbarCatLink' +
                    (active ? ' navbar__link--active' : '')
                  }
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                >
                  {isZh ? cat.title.zh : cat.title.en}
                </a>
              );
            })}
          </div>
        </>
      }
      right={
        // TODO stop hardcoding items?
        // Ask the user to add the respective navbar items => more flexible
        <>
          <NavbarItems items={otherRightItems} />
          <a
            href={`${docsPrefix}/mindmap`}
            className={styles.githubLink}
            aria-label="思维导图"
            title="思维导图"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={styles.githubIcon}
            >
              <path d="M12 12 12 4M12 12 20 8M12 12 20 16M12 12 12 20M12 12 4 16M12 12 4 8" />
              <circle
                cx="12"
                cy="12"
                r="2.4"
                fill="currentColor"
                stroke="none"
              />
              <circle cx="12" cy="4" r="1.6" />
              <circle cx="20" cy="8" r="1.6" />
              <circle cx="20" cy="16" r="1.6" />
              <circle cx="12" cy="20" r="1.6" />
              <circle cx="4" cy="16" r="1.6" />
              <circle cx="4" cy="8" r="1.6" />
            </svg>
          </a>
          <a
            href="https://github.com/VanSail/VanSail.github.io"
            target="_blank"
            rel="noreferrer"
            className={styles.githubLink}
            aria-label="GitHub"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={styles.githubIcon}
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
          <NavbarItems items={localeItems} />
        </>
      }
    />
  );
}
