import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig, type NavbarLogo} from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import styles from './styles.module.css';

// 导航栏品牌：左侧显示透明 logo（含「凡赛 VanSail」文字，见 static/img/logo-text.webp），
// 单一图形即承载图标 + 中英文品牌名，不再叠加独立文字。
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
    </Link>
  );
}
