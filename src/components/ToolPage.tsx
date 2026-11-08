import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from '../pages/tools/tool.module.css';
import type {ToolId} from '../lib/tools';
type Copy = {title: string; desc: string; frameTitle: string};

export default function ToolPage({
  id,
  copy,
}: {
  id: ToolId;
  copy: {zh: Copy; en: Copy};
}): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const c = currentLocale === 'en' ? copy.en : copy.zh;
  const frameSrc = useBaseUrl(`apps/${id}/`);

  return (
    <Layout
      title={c.title}
      description={c.desc}
      noFooter
      wrapperClassName={styles.wrapper}
    >
      <main className={`${styles.page} vs-tools-main`}>
        <div className={styles.shell}>
          <div className={styles.frameCard}>
            <iframe
              className={styles.frame}
              src={currentLocale === 'en' ? `${frameSrc}?lang=en` : frameSrc}
              title={c.frameTitle}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
