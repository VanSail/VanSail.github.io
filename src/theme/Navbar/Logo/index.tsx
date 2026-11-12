import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

export default function NavbarLogo(): ReactNode {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();

  return (
    <Link to={useBaseUrl('/')} className="navbar__brand" aria-label={title}>
      <img src={useBaseUrl('img/logo.svg')} width={32} height={32} alt="" />
      <span className={styles.mask}>
        <span className={clsx('navbar__title', styles.wordmark)}>{title}</span>
      </span>
    </Link>
  );
}
