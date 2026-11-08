import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/** 左上角品牌：纯 VanSail 字标，不带图形 mark。 */
export default function NavbarLogo(): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();

  return (
    <Link to={useBaseUrl('/')} className="navbar__brand" aria-label={title}>
      <span className={clsx('navbar__title', styles.wordmark)}>{title}</span>
    </Link>
  );
}
