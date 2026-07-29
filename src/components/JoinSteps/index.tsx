import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Locale = 'zh' | 'en';

interface Step {
  title: Record<Locale, string>;
  desc: Record<Locale, string>;
  code?: string;
}

const steps: Step[] = [
  {
    title: {zh: '准备环境', en: 'Prepare the environment'},
    desc: {
      zh: '安装 Node.js 与 Git；Z Shell 可选，macOS 和 Linux 通常已自带。',
      en: 'Install Node.js and Git. Z Shell is optional—macOS and Linux usually ship with it.',
    },
  },
  {
    title: {zh: 'Fork 仓库', en: 'Fork the repository'},
    desc: {
      zh: '在 GitHub 上点击 Fork，将本项目复制到你的个人账号下。',
      en: 'Click Fork on GitHub to copy this project under your personal account.',
    },
  },
  {
    title: {zh: '克隆源码', en: 'Clone the source'},
    desc: {
      zh: '将你的 Fork 克隆到本地：',
      en: 'Clone your fork to your machine:',
    },
    code: 'git clone https://github.com/<your-name>/VanSail.github.io.git',
  },
  {
    title: {zh: '安装依赖', en: 'Install dependencies'},
    desc: {
      zh: '进入项目目录，安装所需依赖：',
      en: 'Enter the project directory and install dependencies:',
    },
    code: 'yarn install',
  },
  {
    title: {zh: '启动与构建', en: 'Run & build'},
    desc: {
      zh: '本地预览用 yarn start，生成静态产物用 yarn build。',
      en: 'Use yarn start for local preview, yarn build to produce the static site.',
    },
    code: 'yarn start   # 开发预览\nyarn build    # 编译产物',
  },
  {
    title: {zh: '修改并发起 PR', en: 'Edit & open a PR'},
    desc: {
      zh: '编辑代码后提交更改，向主仓库发起 Pull Request，等待评审合并。',
      en: 'After editing, commit your changes and open a Pull Request to the main repo for review.',
    },
  },
];

const heading = {
  zh: '加入我们',
  en: 'Join Us',
};

const intro = {
  zh: '只需几步，即可参与 VanSail 的贡献。',
  en: 'Just a few steps to start contributing to VanSail.',
};

export default function JoinSteps({locale}: {locale: Locale}): ReactNode {
  return (
    <section className={styles.join}>
      <h2 className={styles.title}>{heading[locale]}</h2>
      <p className={styles.intro}>{intro[locale]}</p>

      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li className={styles.step} key={step.title.en}>
            <span className={styles.marker}>{i + 1}</span>
            {i < steps.length - 1 && (
              <span className={styles.line} aria-hidden="true" />
            )}
            <div className={styles.body}>
              <h3 className={styles.stepTitle}>{step.title[locale]}</h3>
              <p className={styles.desc}>{step.desc[locale]}</p>
              {step.code && <pre className={styles.code}>{step.code}</pre>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
