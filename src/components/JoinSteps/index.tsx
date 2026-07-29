import {useState, type ReactNode} from 'react';
import styles from './styles.module.css';
import {JoinIcon} from '@site/src/components/FloatingJoinLogo';

type Locale = 'zh' | 'en';

interface StepTab {
  id: string;
  label: Record<Locale, string>;
  code: string;
}

interface StepLink {
  label: Record<Locale, string>;
  href: string;
}

interface Step {
  title: Record<Locale, string>;
  desc: Record<Locale, ReactNode>;
  code?: string;
  tabs?: StepTab[];
  links?: StepLink[];
}

const steps: Step[] = [
  {
    title: {zh: '安装 Z Shell（可选）', en: 'Install Z Shell (optional)'},
    desc: {zh: '', en: ''},
    tabs: [
      {
        id: 'macos',
        label: {zh: 'macOS', en: 'macOS'},
        code: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"\nbrew install zsh',
      },
      {
        id: 'linux',
        label: {zh: 'Linux', en: 'Linux'},
        code: 'sudo apt update\nsudo apt install zsh',
      },
    ],
    links: [
      {
        label: {zh: '插件化增强：Oh My Zsh', en: 'Plugins: Oh My Zsh'},
        href: 'https://ohmyz.sh/',
      },
      {
        label: {zh: '终端建议插件', en: 'Terminal autosuggestions'},
        href: 'https://github.com/zsh-users/zsh-autosuggestions',
      },
    ],
  },
  {
    title: {zh: '安装 Git', en: 'Install Git'},
    desc: {zh: '', en: ''},
    tabs: [
      {
        id: 'macos',
        label: {zh: 'macOS', en: 'macOS'},
        code: 'brew install git',
      },
      {
        id: 'linux',
        label: {zh: 'Linux', en: 'Linux'},
        code: 'sudo apt update\nsudo apt install git',
      },
      {
        id: 'windows',
        label: {zh: 'Windows', en: 'Windows'},
        code: '# 前往 Git 官网下载 Windows 安装程序（.exe）并运行\n# https://git-scm.com/download/win',
      },
    ],
    links: [
      {
        label: {zh: 'Git 官网', en: 'Git official'},
        href: 'https://git-scm.com/',
      },
      {
        label: {zh: 'Git 文档', en: 'Git docs'},
        href: 'https://git-scm.com/book/',
      },
    ],
  },
  {
    title: {zh: '安装 Node.js', en: 'Install Node.js'},
    desc: {
      zh: (
        <>
          前往{' '}
          <a
            className={styles.descLink}
            href="https://nodejs.org/zh-cn/download/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Node.js 官网下载页
          </a>
          ，选择你的操作系统与版本，下载安装包后运行即可。
        </>
      ),
      en: (
        <>
          Go to the{' '}
          <a
            className={styles.descLink}
            href="https://nodejs.org/zh-cn/download/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Node.js download page
          </a>
          , pick your OS and version, then run the installer.
        </>
      ),
    },
    links: [
      {
        label: {zh: 'Node.js 官网', en: 'Node.js official'},
        href: 'https://nodejs.org/zh-cn/',
      },
      {
        label: {zh: 'Node.js 文档', en: 'Node.js docs'},
        href: 'https://nodejs.org/zh-cn/docs/',
      },
    ],
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

/* 命令代码块：沿用文档代码块风格（深色凹陷 + hover 复制按钮） */
function CodeBlock({code}: {code: string}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 剪贴板不可用时静默忽略 */
    }
  };

  return (
    <div className={styles.codeWrap}>
      <pre className={styles.code}>{code}</pre>
      <button
        type="button"
        className={styles.copyBtn}
        onClick={copy}
        aria-label="复制命令"
      >
        {copied ? '✓' : '复制'}
      </button>
    </div>
  );
}

/* 平台切换命令行：点击不同系统显示对应安装命令 */
function PlatformTabs({tabs, locale}: {tabs: StepTab[]; locale: Locale}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find(t => t.id === active) ?? tabs[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabBar} role="tablist" aria-label="操作系统">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === active}
            className={`${styles.tab} ${t.id === active ? styles.tabActive : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label[locale]}
          </button>
        ))}
      </div>
      <CodeBlock code={current.code} />
    </div>
  );
}

export default function JoinSteps({locale}: {locale: Locale}): ReactNode {
  return (
    <section className={styles.join}>
      <header className={styles.hero}>
        <span className={styles.heroLogo} aria-hidden="true">
          <JoinIcon />
        </span>
        <h2 className={styles.title}>{heading[locale]}</h2>
      </header>
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
              {step.desc[locale] && (
                <p className={styles.desc}>{step.desc[locale]}</p>
              )}
              {step.code && <CodeBlock code={step.code} />}
              {step.tabs && <PlatformTabs tabs={step.tabs} locale={locale} />}
              {step.links && (
                <div className={styles.links}>
                  {step.links.map(link => (
                    <a
                      key={link.href}
                      className={styles.link}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label[locale]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
