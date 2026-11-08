import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ContributeSteps from '@site/src/components/ContributeSteps';

/** 首页「贡献指南」按钮的落地页：完整的 10 步加入流程。 */
const COPY = {
  zh: {
    title: '贡献指南 · VanSail',
    desc: '完整 10 步：从安装 Zsh、Git 与 Node.js，到 Fork 与克隆仓库、安装依赖、本地预览、编译产物，最后发起 Pull Request，带你完成第一次开源贡献。',
  },
  en: {
    title: 'Contribution Guide · VanSail',
    desc: 'Ten detailed steps for your first open-source contribution: installing the toolchain, forking and cloning, installing dependencies, previewing, building, and opening a Pull Request.',
  },
};

export default function JoinPage(): ReactNode {
  const {
    i18n: {currentLocale},
  } = useDocusaurusContext();
  const isEn = currentLocale === 'en';
  const c = isEn ? COPY.en : COPY.zh;

  return (
    <Layout title={c.title} description={c.desc} noFooter>
      <ContributeSteps locale={isEn ? 'en' : 'zh'} />
    </Layout>
  );
}
