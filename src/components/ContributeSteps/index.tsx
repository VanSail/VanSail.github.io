import {useEffect, useRef, useState, type ReactNode} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {copyText} from '@site/src/lib/clipboard';
import styles from './styles.module.css';

/**
 * 「贡献指南」页 /join：竖向交错时间线。
 *
 * 一根竖线贯穿全篇，10 个白色圆形序号挂在线上、自上而下 1→10 递增；
 * 步骤卡左右交替排列，始终全部可见（不划分阶段、不折叠）。每一步都带
 * 示意卡、标题、说明、平台切换、可复制命令与参考链接。
 */

type Locale = 'zh' | 'en';

const GITHUB_URL = 'https://github.com/VanSail/VanSail.github.io';
const GITHUB_LABEL = 'github.com/VanSail/VanSail.github.io';

type Text = {
  title: string;
  intro: string;
  repoLabel: string;
  ctaSyntax: string;
  copy: string;
  copied: string;
  copyAria: string;
  tabsAria: string;
  timelineAria: string;
};

const TEXT: Record<Locale, Text> = {
  zh: {
    title: '完成第一次贡献',
    intro:
      '从安装工具链到发起 Pull Request，按顺序照做即可。每一步都写明了命令、不同系统的差别与参考链接。',
    repoLabel: '打开 VanSail 的 GitHub 仓库',
    ctaSyntax: '文档语法',
    copy: '复制',
    copied: '已复制',
    copyAria: '复制命令',
    tabsAria: '操作系统',
    timelineAria: '贡献流程的 10 个步骤',
  },
  en: {
    title: 'Your first contribution',
    intro:
      'From installing the toolchain to opening a Pull Request. Every step comes with copy-ready commands, per-OS variants and reference links.',
    repoLabel: 'Open the VanSail GitHub repository',
    ctaSyntax: 'Docs syntax',
    copy: 'Copy',
    copied: 'Copied',
    copyAria: 'Copy command',
    tabsAria: 'Operating system',
    timelineAria: 'Ten steps of the contribution flow',
  },
};

type StepTab = {id: string; label: Record<Locale, string>; code: string};
type StepLink = {label: Record<Locale, string>; href: string};
type VisualLine = {code: string; ok?: string};
type StepVisualData = {
  head: Record<Locale, string>;
  status?: string;
  lines: VisualLine[];
  foot: Record<Locale, string>;
  footKind?: 'ok' | 'pr';
};
type Step = {
  title: Record<Locale, string>;
  desc?: Record<Locale, ReactNode>;
  code?: string;
  tabs?: StepTab[];
  links?: StepLink[];
  visual: StepVisualData;
};

const STEPS: Step[] = [
  {
    title: {zh: '安装 Z Shell（可选）', en: 'Install Z Shell (optional)'},
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
    visual: {
      head: {zh: '终端', en: 'Terminal'},
      status: '$',
      lines: [{code: 'brew install zsh'}, {code: 'zsh --version', ok: '5.9'}],
      foot: {zh: '可选：不装也能继续', en: 'Optional — you can skip this'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '安装 Git', en: 'Install Git'},
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
    visual: {
      head: {zh: '终端', en: 'Terminal'},
      status: '$',
      lines: [{code: 'brew install git'}, {code: 'git --version', ok: '✓'}],
      foot: {zh: '必需', en: 'Required'},
      footKind: 'ok',
    },
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
            rel="noreferrer"
          >
            Node.js 官网下载页
          </a>
          ，选择你的操作系统与版本，按照命令或者下载安装包进行安装。
          <br />
          推荐使用 Yarn 进行包管理。
        </>
      ),
      en: (
        <>
          Go to the{' '}
          <a
            className={styles.descLink}
            href="https://nodejs.org/en/download/"
            target="_blank"
            rel="noreferrer"
          >
            Node.js download page
          </a>
          , pick your OS and version, then run the installer.
          <br />
          We recommend Yarn for package management.
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
    visual: {
      head: {zh: '版本检查', en: 'Version check'},
      status: '≥ 20',
      lines: [
        {code: 'node -v', ok: 'v20.x'},
        {code: 'yarn -v', ok: '1.22'},
      ],
      foot: {zh: '推荐用 Yarn 管理依赖', en: 'Yarn is recommended'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: 'Fork 仓库', en: 'Fork the repository'},
    desc: {
      zh: (
        <>
          点击{' '}
          <a
            className={styles.descLink}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            VanSail 项目主页
          </a>
          ，将本项目 Fork 到你的个人账号下。
        </>
      ),
      en: (
        <>
          Open the{' '}
          <a
            className={styles.descLink}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            VanSail project page
          </a>{' '}
          and fork it under your own account.
        </>
      ),
    },
    visual: {
      head: {zh: 'GitHub', en: 'GitHub'},
      status: 'fork ✓',
      lines: [{code: 'github.com/VanSail/…'}, {code: '→ your-name/VanSail…'}],
      foot: {zh: 'Fork 到个人账号', en: 'Forked to your account'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '克隆源码', en: 'Clone the source'},
    desc: {
      zh: '将你的 Fork 克隆到本地：',
      en: 'Clone your fork to your machine:',
    },
    code: 'git clone git@github.com:/<your-name>/VanSail.github.io.git',
    visual: {
      head: {zh: '仓库', en: 'Repository'},
      lines: [
        {code: 'git clone git@github.com:…'},
        {code: 'cd VanSail.github.io'},
      ],
      foot: {zh: '代码已到本地', en: 'Source on your machine'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '安装依赖', en: 'Install dependencies'},
    desc: {
      zh: '进入项目目录，安装所需依赖：',
      en: 'Enter the project directory and install dependencies:',
    },
    code: 'cd VanSail.github.io\nyarn install',
    visual: {
      head: {zh: '依赖', en: 'Dependencies'},
      lines: [{code: 'yarn install'}, {code: 'Done in 3.2s', ok: '✓'}],
      foot: {zh: '依赖就绪', en: 'Dependencies ready'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '启动本地预览', en: 'Start local preview'},
    desc: {
      zh: 'yarn start 会一次构建中英双语并在同一端口预览，改动后自动重建；需要单语言实时热更新请用 yarn start:dev：',
      en: 'yarn start builds both locales and serves them on one port with auto rebuild; use yarn start:dev for single-locale live reload:',
    },
    code: 'yarn start\nyarn start:dev',
    visual: {
      head: {zh: '本地预览', en: 'Local preview'},
      status: 'LIVE',
      lines: [
        {code: 'yarn start', ok: 'zh+en'},
        {code: 'yarn start:dev', ok: 'HMR'},
      ],
      foot: {zh: 'localhost:3000', en: 'localhost:3000'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '编译产物', en: 'Build the site'},
    desc: {
      zh: '将源码编译为静态站点，产物输出到 build 目录：',
      en: 'Compile the source into a static site, output to the build directory:',
    },
    code: 'yarn build',
    visual: {
      head: {zh: '构建', en: 'Build'},
      lines: [{code: 'yarn build'}, {code: 'build/', ok: '✓'}],
      foot: {zh: '静态站点产物', en: 'Static output'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '预览编译产物', en: 'Serve the build'},
    desc: {
      zh: '本地启动已编译的静态站点，用于正式发布前检查最终效果：',
      en: 'Serve the compiled static site locally to verify the final result before publishing:',
    },
    code: 'yarn serve',
    visual: {
      head: {zh: '产物预览', en: 'Serve'},
      lines: [{code: 'yarn serve'}, {code: ':3000', ok: '✓'}],
      foot: {zh: '发布前检查', en: 'Final check before deploy'},
      footKind: 'ok',
    },
  },
  {
    title: {zh: '修改并发起 PR', en: 'Edit & open a PR'},
    desc: {
      zh: '编辑代码后提交更改，向主仓库发起 Pull Request，等待评审合并。',
      en: 'After editing, commit your changes and open a Pull Request to the main repo for review.',
    },
    visual: {
      head: {zh: '提交与 PR', en: 'Commit & PR'},
      lines: [
        {code: 'git commit -m "feat: …"'},
        {code: 'git push origin main'},
      ],
      foot: {zh: '发起 Pull Request', en: 'Open a Pull Request'},
      footKind: 'pr',
    },
  },
];

function MockLine({code, ok}: {code: string; ok?: string}) {
  return (
    <div className={styles.mockLine}>
      <span aria-hidden="true">$</span>
      <code>{code}</code>
      {ok ? <em>{ok}</em> : null}
    </div>
  );
}

/** 单步示意卡：纯 CSS 绘制，中英文案同步；纯装饰，对读屏隐藏。 */
function StepVisual({data, locale}: {data: StepVisualData; locale: Locale}) {
  return (
    <div className={styles.mockCard} aria-hidden="true">
      <div className={styles.mockHead}>
        <span className={styles.mockDots}>
          <i />
          <i />
          <i />
        </span>
        <span>{data.head[locale]}</span>
        {data.status ? (
          <span className={styles.mockStatus}>{data.status}</span>
        ) : null}
      </div>
      <div className={styles.mockTerminal}>
        {data.lines.map(line => (
          <MockLine key={line.code} code={line.code} ok={line.ok} />
        ))}
      </div>
      <div className={styles.mockFoot}>
        {data.footKind === 'pr' ? (
          <span className={styles.mockPr}>PR</span>
        ) : (
          <span className={styles.mockOk} />
        )}
        {data.foot[locale]}
      </div>
    </div>
  );
}

/** 命令行代码块：深色凹陷 + 复制按钮（剪贴板不可用时静默降级） */
function CodeBlock({code, text}: {code: string; text: Text}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const copy = async () => {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={styles.codeWrap}>
      <pre className={styles.code}>
        <code>{code}</code>
      </pre>
      <button
        type="button"
        className={styles.copyBtn}
        onClick={copy}
        aria-label={text.copyAria}
      >
        {copied ? text.copied : text.copy}
      </button>
    </div>
  );
}

/** 平台切换命令行：macOS / Linux / Windows */
function PlatformTabs({
  tabs,
  locale,
  text,
}: {
  tabs: StepTab[];
  locale: Locale;
  text: Text;
}) {
  const [active, setActive] = useState(tabs[0]?.id);
  const current = tabs.find(tab => tab.id === active) ?? tabs[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabBar} role="tablist" aria-label={text.tabsAria}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === active}
            className={`${styles.tab} ${tab.id === active ? styles.tabActive : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label[locale]}
          </button>
        ))}
      </div>
      <CodeBlock code={current.code} text={text} />
    </div>
  );
}

/**
 * 竖向时间线：一根贯穿的发丝竖线，进入视口后自上而下描出
 * （与 1→10 的序号递增方向一致）；reduced-motion 直接完整显示。
 */
function Timeline({locale, text}: {locale: Locale; text: Text}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDrawn(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      {threshold: 0.05},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={styles.timelineWrap}
      ref={rootRef}
      data-drawn={drawn ? 'true' : 'false'}
    >
      <span className={styles.spine} aria-hidden="true" />
      <ol className={styles.timeline} aria-label={text.timelineAria}>
        {STEPS.map((step, i) => (
          <StepCard
            key={step.title.en}
            step={step}
            index={i}
            locale={locale}
            text={text}
          />
        ))}
      </ol>
    </div>
  );
}

/** 时间线上的一步：序号挂在中线，卡片按奇偶左右交替。 */
function StepCard({
  step,
  index,
  locale,
  text,
}: {
  step: Step;
  index: number;
  locale: Locale;
  text: Text;
}) {
  const side = index % 2 === 0 ? styles.itemLeft : styles.itemRight;
  return (
    <li className={`${styles.item} ${side}`} id={`vansail-step-${index + 1}`}>
      <span className={styles.node} aria-hidden="true">
        {index + 1}
      </span>
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <h3 className={styles.stepTitle}>{step.title[locale]}</h3>
        </div>
        <div className={styles.visualWrap}>
          <StepVisual data={step.visual} locale={locale} />
        </div>
        <div className={styles.stepDetail}>
          {step.desc ? (
            <p className={styles.desc}>{step.desc[locale]}</p>
          ) : null}
          {step.tabs ? (
            <PlatformTabs tabs={step.tabs} locale={locale} text={text} />
          ) : null}
          {step.code ? <CodeBlock code={step.code} text={text} /> : null}
          {step.links ? (
            <div className={styles.links}>
              {step.links.map(link => (
                <a
                  key={link.href}
                  className={styles.link}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label[locale]}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default function ContributeSteps({locale}: {locale: Locale}): ReactNode {
  const text = TEXT[locale];
  const syntaxHref = useBaseUrl('docs/');

  return (
    <section
      className={styles.join}
      id="contribute"
      aria-labelledby="vansail-join-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 className={styles.title} id="vansail-join-title">
            {text.title}
          </h2>
          <p className={styles.intro}>{text.intro}</p>
          <a
            className={styles.repoLink}
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={`${text.repoLabel}: ${GITHUB_LABEL}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={styles.repoIcon}
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            <span>{GITHUB_LABEL}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </header>

        <Timeline locale={locale} text={text} />

        <div className={styles.actions}>
          <a className={styles.ghostButton} href={syntaxHref}>
            {text.ctaSyntax}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
