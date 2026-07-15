import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './WechatQrcode.module.css';

const WECHAT_PATH =
  'M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .545-.027.811-.05a6.05 6.05 0 0 1-.368-2.205c0-3.473 3.19-6.29 7.12-6.29.297 0 .589.023.878.06C15.73 4.805 12.566 2.188 8.691 2.188zM5.705 6.672c.52 0 .94.419.94.94 0 .52-.42.94-.94.94a.939.939 0 0 1 0-1.88zm5.974 0c.52 0 .94.419.94.94 0 .52-.42.94-.94.94a.939.939 0 0 1 0-1.88zm5.69 2.894c-2.934 0-5.32 2.234-5.32 4.988 0 2.754 2.386 4.988 5.32 4.988.58 0 1.14-.084 1.664-.236a.722.722 0 0 1 .593.083l1.45.847a.293.293 0 0 0 .152.046c.135 0 .245-.108.245-.24 0-.06-.023-.119-.047-.171l-.38-1.426a.628.628 0 0 1-.227-.475c0-.017 0-.034.002-.05.358-.276.664-.602.904-.966.072-.108.139-.22.2-.336a4.95 4.95 0 0 0 .283-1.604c0-2.754-2.386-4.985-5.32-4.985zm-2.166 4.04c.422 0 .764.34.764.76 0 .422-.342.762-.764.762a.762.762 0 0 1 0-1.522zm4.333 0c.422 0 .764.34.764.76 0 .422-.342.762-.764.762a.762.762 0 0 1 0-1.522z';

export default function WechatQrcode(): React.JSX.Element {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const caption = locale === 'en' ? 'Scan to add WeChat' : '扫码添加微信';
  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={caption}
        aria-haspopup="dialog">
        <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
          <path d={WECHAT_PATH} />
        </svg>
      </button>
      <div className={styles.popup} role="dialog" aria-label={caption}>
        <img src="/img/wechat.webp" alt={caption} className={styles.qr} />
        <span className={styles.caption}>{caption}</span>
      </div>
    </div>
  );
}
