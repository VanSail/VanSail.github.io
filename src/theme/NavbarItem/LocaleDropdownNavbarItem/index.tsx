import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import styles from './LocaleDropdownNavbarItem.module.css';

export default function LocaleDropdownNavbarItem(): React.JSX.Element {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();

  // 在默认语言(zh-CN) 与英文(en) 之间来回切换
  const otherLocale = locales.find(l => l !== currentLocale) ?? 'en';
  const targetPath = alternatePageUtils.createUrl({
    locale: otherLocale,
    fullyQualified: false,
  });
  const targetLabel = localeConfigs[otherLocale]?.label ?? 'English';

  return (
    <a
      href={targetPath}
      className={styles.localeSwitcher}
      aria-label={`Switch to ${targetLabel}`}
      title={`Switch to ${targetLabel}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={styles.globe}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
      <span className={styles.localeText}>中/E</span>
    </a>
  );
}
