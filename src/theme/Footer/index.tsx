import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ContribHeatmap from '@site/src/components/ContribHeatmap';
import styles from './styles.module.css';

function GithubIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function PawIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      {/* central metacarpal pad */}
      <ellipse
        cx="11.5"
        cy="17"
        rx="4.5"
        ry="4"
        transform="rotate(10 11.5 17)"
      />
      {/* four toe pads in an arc */}
      <ellipse
        cx="5.2"
        cy="8"
        rx="2.4"
        ry="3.2"
        transform="rotate(-22 5.2 8)"
      />
      <ellipse
        cx="9.8"
        cy="5.8"
        rx="2.2"
        ry="3"
        transform="rotate(-6 9.8 5.8)"
      />
      <ellipse
        cx="14.2"
        cy="5.8"
        rx="2.2"
        ry="3"
        transform="rotate(6 14.2 5.8)"
      />
      <ellipse
        cx="18.8"
        cy="8"
        rx="2.4"
        ry="3.2"
        transform="rotate(22 18.8 8)"
      />
    </svg>
  );
}

function WechatIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .545-.027.811-.05a6.05 6.05 0 0 1-.368-2.205c0-3.473 3.19-6.29 7.12-6.29.297 0 .589.023.878.06C15.73 4.805 12.566 2.188 8.691 2.188zM5.705 6.672c.52 0 .94.419.94.94 0 .52-.42.94-.94.94a.939.939 0 0 1 0-1.88zm5.974 0c.52 0 .94.419.94.94 0 .52-.42.94-.94.94a.939.939 0 0 1 0-1.88zm5.69 2.894c-2.934 0-5.32 2.234-5.32 4.988 0 2.754 2.386 4.988 5.32 4.988.58 0 1.14-.084 1.664-.236a.722.722 0 0 1 .593.083l1.45.847a.293.293 0 0 0 .152.046c.135 0 .245-.108.245-.24 0-.06-.023-.119-.047-.171l-.38-1.426a.628.628 0 0 1-.227-.475c0-.017 0-.034.002-.05.358-.276.664-.602.904-.966.072-.108.139-.22.2-.336a4.95 4.95 0 0 0 .283-1.604c0-2.754-2.386-4.985-5.32-4.985zm-2.166 4.04c.422 0 .764.34.764.76 0 .422-.342.762-.764.762a.762.762 0 0 1 0-1.522zm4.333 0c.422 0 .764.34.764.76 0 .422-.342.762-.764.762a.762.762 0 0 1 0-1.522z" />
    </svg>
  );
}

function BilibiliIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.223 3.086a1.25 1.25 0 0 1 0 1.768L17.08 5.996h1.17A3.75 3.75 0 0 1 22 9.747v7.5a3.75 3.75 0 0 1-3.75 3.75H5.75A3.75 3.75 0 0 1 2 17.247v-7.5a3.75 3.75 0 0 1 3.75-3.751h1.166L5.775 4.854a1.25 1.25 0 1 1 1.768-1.768l2.652 2.652c.079.079.145.165.198.258h3.214c.053-.093.119-.179.198-.258l2.652-2.652a1.25 1.25 0 0 1 1.768 0zM18.25 8.496H5.75a1.25 1.25 0 0 0-1.247 1.157l-.003.094v7.5c0 .659.51 1.198 1.157 1.246l.093.004h12.5a1.25 1.25 0 0 0 1.247-1.157l.003-.093v-7.5c0-.69-.56-1.248-1.247-1.248zM8.5 11.996a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1zm7 0a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0v-1.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function QqIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.2c-2.6 0-4.7 2-4.7 4.9 0 1.1.2 1.8.4 2.4-.9.6-2.4 2.1-3 4.6-.4 1.7-.4 3.4.1 4.8.3-.3.6-.6.9-1 .1 1.4.6 2.5 1.3 3.3-.1.4-.1.8 0 1.1.3.9 1.3 1.6 2.6 1.6.9 0 1.7-.3 2.2-.8.4.1.8.1 1.2 0 .5.5 1.3.8 2.2.8 1.3 0 2.3-.7 2.6-1.6.1-.3.1-.7 0-1.1.7-.8 1.2-1.9 1.3-3.3.3.4.6.7.9 1 .5-1.4.5-3.1.1-4.8-.6-2.5-2.1-4-3-4.6.2-.6.4-1.3.4-2.4C16.7 4.2 14.6 2.2 12 2.2zM9.1 7.6c.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1zm5.8 0c.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1z" />
    </svg>
  );
}

export default function Footer(): React.JSX.Element {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale: 'zh' | 'en' = currentLocale === 'en' ? 'en' : 'zh';
  const t = {
    bilibili: locale === 'en' ? 'Bilibili' : '哔哩哔哩',
    wechat: locale === 'en' ? 'WeChat' : '微信',
    qq: locale === 'en' ? 'QQ' : 'QQ',
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.cols}>
          {/* 左：社交联系 — bilibili / 微信 / QQ logo 横向排列，悬停显示二维码 */}
          <div className={`${styles.col} ${styles.socialCol}`}>
            <h3 className={styles.colTitle}>
              <span className={styles.colTitleText}>
                {locale === 'en' ? 'Contact Us' : '联系我们'}
              </span>
            </h3>
            <div className={styles.socialList}>
              <div className={styles.socialItem}>
                <BilibiliIcon className={styles.socialIconBili} />
                <div className={styles.qrPop}>
                  <img
                    className={styles.qr}
                    src={useBaseUrl('/img/vansail-bilibili.png')}
                    alt={t.bilibili}
                  />
                </div>
              </div>
              <div className={styles.socialItem}>
                <WechatIcon className={styles.socialIconWechat} />
                <div className={styles.qrPop}>
                  <img
                    className={styles.qr}
                    src={useBaseUrl('/img/vansali-wechat.png')}
                    alt={t.wechat}
                  />
                </div>
              </div>
              <div className={styles.socialItem}>
                <QqIcon className={styles.socialIconQq} />
                <div className={styles.qrPop}>
                  <img
                    className={styles.qr}
                    src={useBaseUrl('/img/vansali-qq.png')}
                    alt={t.qq}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右：GitHub 足迹 */}
          <div className={`${styles.col} ${styles.heatmapCol}`}>
            <h3 className={styles.colTitle}>
              <GithubIcon className={styles.contribIcon} />
              <PawIcon
                className={styles.contribIcon}
                style={{width: 24, height: 24}}
              />
            </h3>
            <ContribHeatmap />
          </div>
        </div>
      </div>
    </footer>
  );
}
