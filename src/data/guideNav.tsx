import type {LText} from '@site/src/types';

export interface GuideArticle {
  /** 文档 slug 后缀，完整路径为 /docs/guide/<group>/<slug> */
  slug: string;
  title: LText;
}

export interface GuideGroup {
  /** 分组目录，用于拼出分组索引页与文章路径 */
  dir: string;
  label: LText;
  articles: GuideArticle[];
}

/**
 * 首页「文档指南」预览区的目录数据。
 * 与 docs/guide 下的实际文档保持对应，新增教程只需在此追加。
 * 分组索引页路径为 /docs/guide/<dir>，文章路径为 /docs/guide/<dir>/<slug>。
 */
export const GUIDE_GROUPS: GuideGroup[] = [
  {
    dir: 'basic',
    label: {zh: '基础语法', en: 'Basics'},
    articles: [
      {slug: 'code', title: {zh: '代码块', en: 'Code Blocks'}},
      {slug: 'details', title: {zh: '折叠块', en: 'Details'}},
      {slug: 'emphasis', title: {zh: '强调与标注', en: 'Emphasis'}},
      {slug: 'footnote', title: {zh: '脚注', en: 'Footnotes'}},
      {slug: 'images', title: {zh: '图片', en: 'Images'}},
      {slug: 'links', title: {zh: '链接', en: 'Links'}},
      {slug: 'lists', title: {zh: '列表', en: 'Lists'}},
      {slug: 'paragraph', title: {zh: '段落与换行', en: 'Paragraphs'}},
      {slug: 'tables', title: {zh: '表格', en: 'Tables'}},
      {slug: 'text', title: {zh: '文本格式', en: 'Text'}},
    ],
  },
  {
    dir: 'advanced',
    label: {zh: '进阶语法', en: 'Advanced'},
    articles: [
      {slug: 'admonitions', title: {zh: '提示框', en: 'Admonitions'}},
      {slug: 'code-block', title: {zh: '代码块进阶', en: 'Code Blocks+'}},
      {slug: 'doc-cards', title: {zh: '文档卡片', en: 'Doc Cards'}},
      {slug: 'mindmap', title: {zh: '思维导图', en: 'Mind Map'}},
      {slug: 'tabs', title: {zh: '选项卡', en: 'Tabs'}},
    ],
  },
];
