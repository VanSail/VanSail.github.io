import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import TableConverter from '@site/src/components/TableConverter/TableConverter';

const T = {
  title: {zh: '格式转换', en: 'Format Converter'},
  desc: {
    zh: '在浏览器本地实时互转、双向编辑 Markdown 与 Excel 表格',
    en: 'Real-time, two-way conversion and editing between Markdown and Excel tables',
  },
};

export default function TableConverterPage(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const locale = currentLocale === 'en' ? 'en' : 'zh';
  return (
    <Layout title={T.title[locale]} description={T.desc[locale]}>
      <TableConverter locale={locale} />
    </Layout>
  );
}
