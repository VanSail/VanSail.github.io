import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/* “加入”图标：人物 + 加号（邀请/加入 crew 的通用语义） */
export function JoinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="8" r="3.3" />
      <path d="M3.6 19c0-3.04 2.46-5.5 5.4-5.5 1.7 0 3.2.75 4.2 1.94" />
      <line x1="17.2" y1="7.6" x2="17.2" y2="14.4" />
      <line x1="13.9" y1="11" x2="20.5" y2="11" />
    </svg>
  );
}

export default function FloatingJoinLogo() {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const to = locale === 'en' ? '/en/join' : '/join';

  return (
    <Link
      to={to}
      className={styles.wrap}
      aria-label={locale === 'zh' ? '加入我们' : 'Join Us'}
    >
      <span className={styles.badge}>
        <span className={styles.icon}>
          <JoinIcon />
        </span>
      </span>
      <span className={styles.text}>
        {locale === 'zh' ? '加入我们' : 'Join Us'}
      </span>
    </Link>
  );
}
