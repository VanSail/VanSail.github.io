import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig, type NavbarLogo} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import styles from './styles.module.css';

// 导航栏品牌：图标在左，右侧「凡塞」(中文) 在上、「VanSail」(英文) 在下堆叠，
// 与 houmoai 等站点的 logo 排版一致，体现中文名 / 英文名 / 图标三者合一。
export default function NavbarLogo(): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {logo},
  } = useThemeConfig();
  const logoLink = useBaseUrl(logo?.href || '/');
  const alt = logo?.alt ?? title;
  const sources = {
    light: useBaseUrl(logo!.src),
    dark: useBaseUrl(logo!.srcDark || logo!.src),
  };

  return (
    <Link
      to={logoLink}
      className="navbar__brand"
      {...(logo?.target && {target: logo.target})}
    >
      {logo && (
        <div className="navbar__logo">
          <ThemedImage
            className={logo.className}
            sources={sources}
            height={logo.height}
            width={logo.width}
            alt={alt}
            style={logo.style}
          />
        </div>
      )}
      <span className={styles.brandStack}>
        <span className={styles.brandCn}>凡塞</span>
        <span className={styles.brandEn}>{title}</span>
      </span>
    </Link>
  );
}
