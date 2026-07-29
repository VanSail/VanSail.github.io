// 让 webpack 的 require.context 在 TypeScript 下可用（Docusaurus 基于 webpack 构建）。
// 此文件为全局声明脚本，不要添加任何 import / export，否则会变为模块而失去全局增强效果。

interface WebpackRequireContext {
  keys(): string[];
  <T = unknown>(id: string): T;
}

declare namespace NodeJS {
  interface Require {
    context(
      directory: string,
      deep?: boolean,
      filter?: RegExp,
    ): WebpackRequireContext;
  }
}
