import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import clsx from 'clsx';
import {useLocation} from '@docusaurus/router';
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
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import {tools, toolPath, type ToolId} from '../../../lib/tools';
import styles from './styles.module.css';

const GITHUB_URL = 'https://github.com/VanSail/VanSail.github.io';
const ISSUES_URL = `${GITHUB_URL}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`;

/**
 * 栏目页是独立页面，不是首页滚动锚点；baseUrl 在英文构建里已带 /en/。
 * docs 是导航栏的「产品文档」（随产品上线开放）；syntax 是「文档语法」写作教程。
 */
const SECTION_PATHS = {
  home: '/',
  products: '/products/',
  docs: '/product-docs/',
  syntax: '/docs/',
  join: '/join/',
} as const;

type SectionKey = keyof typeof SECTION_PATHS | ToolId;
/** 导航项允许「tools」作为纯下拉触发器（不对应独立路由） */
type NavSection = SectionKey | 'tools';

type SearchKind = 'page' | 'tool' | 'external';

type SearchItem = {
  id: string;
  zh: string;
  en: string;
  descZh: string;
  descEn: string;
  section?: SectionKey;
  href?: string;
  keywords?: string;
  kind: SearchKind;
};

/**
 * 轻量本地索引：覆盖站内全部页面与工具的具体能力。
 * 不依赖搜索服务，构建时打包进 JS；文档站上线后可平滑换成 DocSearch。
 */
const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'home',
    zh: '首页',
    en: 'Home',
    descZh: '螺旋星系与交互点阵地球',
    descEn: 'Spiral galaxy and interactive dotted Earth',
    section: 'home',
    keywords: 'index start 主页 开始 intro',
    kind: 'page',
  },
  {
    id: 'products',
    zh: '产品中心',
    en: 'Products',
    descZh: '浏览 VanSail 的产品线',
    descEn: 'Browse the VanSail product line',
    section: 'products',
    keywords: 'product 产品 hardware 硬件',
    kind: 'page',
  },
  {
    id: 'productDocs',
    zh: '产品文档',
    en: 'Docs',
    descZh: '产品使用文档 · 随产品上线开放',
    descEn: 'Product documentation · coming with the launch',
    section: 'docs',
    keywords: '产品文档 product docs 使用手册 hardware 硬件 说明书 指南',
    kind: 'page',
  },
  {
    id: 'syntax',
    zh: '文档语法',
    en: 'Docs syntax',
    descZh: 'Markdown 与 Docusaurus 写作教程',
    descEn: 'Markdown and Docusaurus authoring tutorials',
    section: 'syntax',
    keywords:
      '文档语法 markdown mdx 写作 教程 基础语法 进阶语法 标题 表格 代码块 折叠 提示框 tabs 思维导图 doc card',
    kind: 'page',
  },
  ...tools.map(tool => ({...tool, section: tool.id, kind: 'tool' as const})),
  {
    id: 'hex',
    zh: '进制视图',
    en: 'Radix views',
    descZh: '串口数据的文本 / HEX / BIN 显示与输入',
    descEn: 'Text, HEX and BIN views for serial data',
    section: 'serial',
    keywords:
      'hex 十六进制 bin 二进制 字节 bytes 文本 text 视图 view 进制 radix 输入格式',
    kind: 'tool',
  },
  {
    id: 'image-gen',
    zh: '图片生成',
    en: 'Image generation',
    descZh: '用自然语言描述，直接生成图片',
    descEn: 'Describe a scene and generate an image',
    section: 'ai',
    keywords:
      '图片 image 生成 generation 绘画 painting 画幅 比例 分辨率 4k 2k 1080p 提示词 prompt',
    kind: 'tool',
  },
  {
    id: 'github',
    zh: 'GitHub 仓库',
    en: 'GitHub repository',
    descZh: '查看源码与项目动态',
    descEn: 'Source code and project activity',
    href: GITHUB_URL,
    keywords: 'github repo source 源码 仓库 代码',
    kind: 'external',
  },
  {
    id: 'contribute',
    zh: '参与贡献 · good first issues',
    en: 'Contribute · good first issues',
    descZh: '适合第一次参与的 issue 列表',
    descEn: 'Issues that are great for a first contribution',
    href: ISSUES_URL,
    keywords: 'contribute issue 贡献 参与 开源',
    kind: 'external',
  },
  {
    id: 'contributing',
    zh: '贡献指南',
    en: 'Contribution guide',
    descZh: '从环境准备到发起 PR 的完整 10 步',
    descEn: 'Ten detailed steps from setup to your first PR',
    section: 'join',
    keywords:
      'contributing guide 贡献 指南 规范 fork clone yarn build pr pull request 加入我们',
    kind: 'page',
  },
];

const KIND_LABEL: Record<SearchKind, {zh: string; en: string}> = {
  page: {zh: '页面', en: 'Page'},
  tool: {zh: '工具', en: 'Tool'},
  external: {zh: '外部', en: 'Link'},
};

/** 窄屏用两字短标签，避免顶栏挤压；桌面显示完整栏目名 */
type NavLink = {
  zh: string;
  en: string;
  short: string;
  shortEn: string;
  section: NavSection;
};

const NAV_LINKS: NavLink[] = [
  {
    zh: '产品中心',
    en: 'Products',
    short: '产品',
    shortEn: 'Products',
    section: 'products',
  },
  {
    zh: '产品文档',
    en: 'Docs',
    short: '文档',
    shortEn: 'Docs',
    section: 'docs',
  },
  {
    zh: '网页工具',
    en: 'Tools',
    short: '工具',
    shortEn: 'Tools',
    section: 'tools',
  },
];

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={error =>
            new Error('A theme navbar item failed to render.', {cause: error})
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
  overlay,
}: {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  overlay?: ReactNode;
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
      <div className={styles.centerSlot}>{center}</div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          'navbar__items navbar__items--right',
        )}
      >
        {right}
      </div>
      {overlay}
    </div>
  );
}

export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const {pathname} = useLocation();
  const {
    siteConfig,
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const isZh = currentLocale !== 'en';
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [toolsOpen, setToolsOpen] = useState(false);
  /** 由点击「固定」打开的标记：区分悬停打开，避免点箭头时反而把菜单关掉 */
  const [toolsPinned, setToolsPinned] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toolsCloseTimer = useRef<number | null>(null);

  /** baseUrl 在英文构建里本身已带 /en/，直接用即可，不要再加语言前缀 */
  const sectionHref = (section: SectionKey) =>
    `${siteConfig.baseUrl.replace(/\/$/, '')}${section in SECTION_PATHS ? SECTION_PATHS[section as keyof typeof SECTION_PATHS] : toolPath(section as ToolId)}`;

  /** 胶囊导航的当前栏目高亮；tools 是纯下拉触发器，命中任一工具页也算激活。 */
  const isSectionActive = (section: NavSection): boolean => {
    const path = pathname.replace(/\/+$/, '') || '/';
    if (section === 'tools') return path.includes('/tools/');
    const target = sectionHref(section).replace(/\/+$/, '') || '/';
    return path === target || (target !== '/' && path.startsWith(`${target}/`));
  };

  const resultHref = (item: SearchItem) => {
    if (item.href) return item.href;
    return item.section ? sectionHref(item.section) : '';
  };

  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const otherRightItems = rightItems.filter(
    item => item.type !== 'localeDropdown',
  );
  const localeItems = rightItems.filter(item => item.type === 'localeDropdown');

  /** 空输入不返回任何条目：点击搜索框不出现推荐、记录或历史 */
  const results = useMemo(() => {
    const raw = query.trim().toLowerCase();
    const tokens = raw.split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];

    const scored: Array<{item: SearchItem; score: number}> = [];
    for (const item of SEARCH_ITEMS) {
      const title = `${item.zh} ${item.en}`.toLowerCase();
      const desc = `${item.descZh} ${item.descEn}`.toLowerCase();
      const keywords = (item.keywords ?? '').toLowerCase();
      const haystack = `${title} ${desc} ${keywords}`;
      if (!tokens.every(t => haystack.includes(t))) continue;

      const first = tokens[0];
      const fieldScore = title.startsWith(first)
        ? 0
        : title.includes(first)
          ? 1
          : keywords.includes(first)
            ? 2
            : 3;
      scored.push({
        item,
        score: fieldScore * 10 + (title.includes(raw) ? 0 : 1),
      });
    }
    return scored
      .sort((a, b) => a.score - b.score)
      .slice(0, 6)
      .map(entry => entry.item);
  }, [query]);

  const showResults = searchOpen && query.trim().length > 0;

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const submitSearch = () => {
    if (results.length === 0) {
      inputRef.current?.focus();
      return;
    }
    const target = document.querySelector<HTMLElement>(
      `[data-vs-search-index="${Math.min(activeIndex, results.length - 1)}"]`,
    );
    (target ?? document.getElementById('vansail-search-option-0'))?.click();
  };

  const onSearchKeyDown = (
    event: ReactKeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setActiveIndex(i => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setActiveIndex(i => (i - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      submitSearch();
    }
  };

  /* ---------------- 工具下拉菜单 ---------------- */

  const openTools = useCallback(() => {
    if (toolsCloseTimer.current !== null) {
      window.clearTimeout(toolsCloseTimer.current);
      toolsCloseTimer.current = null;
    }
    setToolsOpen(true);
  }, []);

  const scheduleToolsClose = useCallback(() => {
    if (toolsCloseTimer.current !== null) {
      window.clearTimeout(toolsCloseTimer.current);
    }
    // 触发区与菜单之间留有透明桥接区，这里再给一点缓冲避免鼠标穿越时闪退
    toolsCloseTimer.current = window.setTimeout(() => {
      setToolsOpen(false);
      toolsCloseTimer.current = null;
    }, 160);
  }, []);

  const closeTools = useCallback(() => {
    if (toolsCloseTimer.current !== null) {
      window.clearTimeout(toolsCloseTimer.current);
      toolsCloseTimer.current = null;
    }
    setToolsOpen(false);
    setToolsPinned(false);
  }, []);

  const toggleToolsPinned = () => {
    // 悬停已经打开时，首次点击只把它「固定」住，再次点击才关闭
    if (toolsPinned) {
      closeTools();
    } else {
      openTools();
      setToolsPinned(true);
    }
  };

  const onToolsBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      scheduleToolsClose();
    }
  };

  /* ---------------- 全局事件 ---------------- */

  useEffect(() => {
    if (!searchOpen && !toolsOpen) return undefined;

    const onPointerDown = (event: Event) => {
      const target = event.target as Node;
      if (
        searchOpen &&
        searchRef.current &&
        !searchRef.current.contains(target)
      ) {
        closeSearch();
      }
      if (
        toolsOpen &&
        !document.getElementById('vansail-tools-menu')?.contains(target) &&
        !(
          target instanceof Element && target.closest('[data-vs-tools-trigger]')
        )
      ) {
        closeTools();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch();
        closeTools();
        inputRef.current?.blur();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [searchOpen, toolsOpen, closeSearch, closeTools]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(
    () => () => {
      if (toolsCloseTimer.current !== null) {
        window.clearTimeout(toolsCloseTimer.current);
      }
    },
    [],
  );

  return (
    <NavbarContentLayout
      left={
        <>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
          <NavbarItems items={leftItems} />
        </>
      }
      center={
        <div className={styles.centerBar}>
          <nav
            className={styles.navLinks}
            aria-label={isZh ? '主导航' : 'Main navigation'}
          >
            {NAV_LINKS.map(link =>
              link.section === 'tools' ? (
                <div
                  key={link.section}
                  data-vs-tools-trigger
                  className={styles.toolsTrigger}
                  onMouseEnter={openTools}
                  onMouseLeave={scheduleToolsClose}
                  onFocus={openTools}
                  onBlur={onToolsBlur}
                >
                  <button
                    type="button"
                    className={clsx(styles.navLink, styles.navTriggerBtn, {
                      [styles.navLinkActive]: isSectionActive('tools'),
                    })}
                    onClick={toggleToolsPinned}
                    aria-haspopup="true"
                    aria-expanded={toolsOpen}
                    aria-controls="vansail-tools-menu"
                  >
                    <span className={styles.navTextFull}>
                      {isZh ? link.zh : link.en}
                    </span>
                    <span className={styles.navTextShort}>
                      {isZh ? link.short : link.shortEn}
                    </span>
                    <svg
                      className={clsx(styles.inlineCaret, {
                        [styles.caretOn]: toolsOpen,
                      })}
                      viewBox="0 0 10 6"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 1l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <a
                  key={link.section}
                  href={sectionHref(link.section)}
                  className={clsx(styles.navLink, {
                    [styles.navLinkActive]: isSectionActive(link.section),
                  })}
                  aria-current={
                    isSectionActive(link.section) ? 'page' : undefined
                  }
                >
                  <span className={styles.navTextFull}>
                    {isZh ? link.zh : link.en}
                  </span>
                  <span className={styles.navTextShort}>
                    {isZh ? link.short : link.shortEn}
                  </span>
                </a>
              ),
            )}
          </nav>

          {/* 胶囊搜索：输入框在左、放大镜在右；空输入不显示任何列表 */}
          <div className={styles.searchPill} ref={searchRef}>
            <input
              ref={inputRef}
              className={styles.pillInput}
              type="text"
              value={query}
              placeholder={isZh ? '搜索' : 'Search'}
              aria-label={isZh ? '搜索' : 'Search'}
              role="combobox"
              aria-expanded={showResults}
              aria-controls="vansail-search-results"
              aria-autocomplete="list"
              aria-activedescendant={
                showResults && results.length > 0
                  ? `vansail-search-option-${Math.min(activeIndex, results.length - 1)}`
                  : undefined
              }
              autoComplete="off"
              spellCheck={false}
              onChange={event => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={onSearchKeyDown}
            />
            {query.length > 0 && (
              <button
                type="button"
                className={styles.pillClear}
                aria-label={isZh ? '清除搜索' : 'Clear search'}
                onClick={() => {
                  setQuery('');
                  setActiveIndex(0);
                  inputRef.current?.focus();
                }}
              >
                ×
              </button>
            )}
            <button
              type="button"
              className={styles.pillIcon}
              aria-label={isZh ? '搜索' : 'Search'}
              onClick={submitSearch}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M15.5 15.5 L20 20"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {showResults ? (
              <div
                id="vansail-search-results"
                className={styles.searchPanel}
                role="listbox"
                aria-label={isZh ? '搜索结果' : 'Search results'}
              >
                {results.length === 0 ? (
                  <p className={styles.searchEmpty}>
                    {isZh ? '没有找到相关内容' : 'No matches'}
                  </p>
                ) : (
                  results.map((item, i) => (
                    <a
                      key={item.id}
                      id={`vansail-search-option-${i}`}
                      data-vs-search-index={i}
                      className={clsx(styles.searchItem, {
                        [styles.searchItemActive]: i === activeIndex,
                      })}
                      role="option"
                      aria-selected={i === activeIndex}
                      href={resultHref(item)}
                      {...(item.href
                        ? {target: '_blank', rel: 'noreferrer'}
                        : {})}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={closeSearch}
                    >
                      <span className={styles.searchItemMain}>
                        <span className={styles.searchItemTitle}>
                          {isZh ? item.zh : item.en}
                        </span>
                        <span className={styles.searchItemDesc}>
                          {isZh ? item.descZh : item.descEn}
                        </span>
                      </span>
                      <span className={styles.searchItemTag} aria-hidden="true">
                        {isZh
                          ? KIND_LABEL[item.kind].zh
                          : KIND_LABEL[item.kind].en}
                      </span>
                    </a>
                  ))
                )}
                <p className={styles.searchTip}>
                  {isZh
                    ? '↑ ↓ 选择 · Enter 打开 · Esc 关闭'
                    : '↑ ↓ select · Enter open · Esc close'}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      }
      right={
        <>
          <NavbarItems items={otherRightItems} />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={styles.githubLink}
            aria-label="GitHub"
            title="GitHub"
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
      overlay={
        toolsOpen ? (
          <div
            id="vansail-tools-menu"
            className={styles.toolsMenu}
            onMouseEnter={openTools}
            onMouseLeave={scheduleToolsClose}
          >
            <div className={styles.toolsMenuInner} role="menu">
              {tools.map(item => (
                <a
                  key={item.id}
                  className={styles.toolItem}
                  href={sectionHref(item.id)}
                  role="menuitem"
                  onClick={closeTools}
                >
                  <span className={styles.toolTitle}>
                    {isZh ? item.zh : item.en}
                  </span>
                  <span className={styles.toolDesc}>
                    {isZh ? item.descZh : item.descEn}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ) : null
      }
    />
  );
}
