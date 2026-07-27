import React, {type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// 居中 logo：在导航栏中央左右来回移动，
// 运动范围与首页 Hero 点阵地球的宽度（.page 内容列 = 60vw）一致。
export default function NavbarLogoCenter(): ReactNode {
  const logo = useBaseUrl('img/logo.svg');
  return (
    <span
      className={styles.sailWrap}
      role="img"
      aria-label="VanSail"
      title="With Sincere Mind, Build Tech Sail"
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
