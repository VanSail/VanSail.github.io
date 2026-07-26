import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import styles from './LocaleDropdownNavbarItem.module.css';

export default function LocaleDropdownNavbarItem(): React.JSX.Element {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternatePageUtils = useAlternatePageUtils();

  // 语种缩写：中文「中」、英文「EN」
  const localeList = locales.map(locale => ({
    key: locale,
    short: locale === 'zh-CN' ? '中' : 'EN',
    label: localeConfigs[locale]?.label ?? locale,
  }));

  return (
    <div className={styles.localeSwitcher} role="group" aria-label="Language">
      {localeList.map(({key, short, label}) => {
        const isActive = key === currentLocale;
        const targetPath = alternatePageUtils.createUrl({
          locale: key,
          fullyQualified: false,
        });
        return isActive ? (
          <span
            key={key}
            className={`${styles.segment} ${styles.active}`}
            aria-current="true"
            title={label}
          >
            {short}
          </span>
        ) : (
          <a
            key={key}
            href={targetPath}
            className={styles.segment}
            aria-label={`Switch to ${label}`}
            title={label}
          >
            {short}
          </a>
        );
      })}
    </div>
  );
}
