import React, {type ReactNode, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

export default function NavbarSearchBar(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale = currentLocale as 'en' | 'zh-CN';
  const [query, setQuery] = useState('');

  const searchPlaceholder = translate({
    id: 'theme.navbar.searchBar.placeholder',
    message: '搜索',
    description: 'Navbar custom search input placeholder',
  });
  const searchAriaLabel = translate({
    id: 'theme.navbar.searchBar.ariaLabel',
    message: '搜索',
    description: 'Navbar custom search input aria-label',
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      return;
    }
    // The local-search plugin serves a results page at /search (en: /en/search)
    // that auto-runs the ?q= query.
    const searchPath = locale === 'en' ? '/en/search' : '/search';
    window.location.href = `${searchPath}?q=${encodeURIComponent(q)}`;
  };

  return (
    <form className={styles.searchBar} onSubmit={onSearch} role="search">
      <svg
        className={styles.searchIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className={styles.searchInput}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchAriaLabel}
      />
    </form>
  );
}
