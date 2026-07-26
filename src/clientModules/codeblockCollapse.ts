import type {ClientModule} from '@docusaurus/types';

/**
 * 代码块折叠交互（替代原先阻塞渲染的 static/js/codeblock-toggle.js）。
 * 以 Docusaurus client module 形式注入：不作为 <head> 内的阻塞脚本，
 * 随主 bundle 异步执行，并在 SPA 路由切换后自动对新页面的代码块生效。
 *
 * 注意：代码块默认全部展开；折叠仅由用户点击标题或折叠按钮触发，
 * 不在路由切换时自动折叠所有代码块，以免内容默认被隐藏。
 */

function handleClick(e: MouseEvent): void {
  const target = e.target as HTMLElement | null;
  const title = target?.closest('[class*="codeBlockTitle"]');
  if (!title) return;
  const container = title.closest('[class*="codeBlockContainer"]');
  if (!container) return;
  const isCollapsed = container.getAttribute('data-collapsed') === 'true';
  container.setAttribute('data-collapsed', isCollapsed ? 'false' : 'true');
}

/** 为正文图片补充原生懒加载与异步解码，减少长文首屏压力 */
function lazyLoadImages(): void {
  document.querySelectorAll<HTMLImageElement>('.markdown img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  });
}

// 点击监听只需注册一次（事件委托到 document，路由切换后依旧有效）
if (typeof document !== 'undefined') {
  document.addEventListener('click', handleClick);
}

const clientModule: ClientModule = {
  onRouteDidUpdate() {
    // 每次进入/切换页面后，对图片启用懒加载
    lazyLoadImages();
  },
};

export default clientModule;
