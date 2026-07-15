import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './LocaleDropdownNavbarItem.module.css';

export default function LocaleDropdownNavbarItem(): JSX.Element {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();

  // 在默认语言(zh-CN) 与英文(en) 之间来回切换
  const otherLocale = locales.find((l) => l !== currentLocale) ?? 'en';
  const targetPath = alternatePageUtils.createUrl({locale: otherLocale});
  const targetLabel = localeConfigs[otherLocale]?.label ?? 'English';
  const logoSrc = useBaseUrl('img/logo.svg');

  return (
    <a
      href={targetPath}
      className={styles.localeSwitcher}
      aria-label={`Switch to ${targetLabel}`}
      title={`Switch to ${targetLabel}`}>
      <img src={logoSrc} alt="" className={styles.logo} />
    </a>
  );
}
