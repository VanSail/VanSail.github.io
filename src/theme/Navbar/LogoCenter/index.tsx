import React, {type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// 居中 logo：在导航栏中央左右来回移动，
// 运动范围 = 首页内容区域（--content-width）的 60%。
export default function NavbarLogoCenter(): ReactNode {
  const logo = useBaseUrl('img/logo-icon.svg');
  return (
    <span
      className={styles.sailWrap}
      role="img"
      aria-label="VanSail"
      title="扬帆起航，探索无界"
    >
      <img
        className={styles.sailImg}
        src={logo}
        alt=""
        width={28}
        height={28}
      />
    </span>
  );
}
