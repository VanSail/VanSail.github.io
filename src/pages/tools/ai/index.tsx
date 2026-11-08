import ToolPage from '../../../components/ToolPage';

const COPY = {
  zh: {
    title: 'AI 实验室 · VanSail 网页工具',
    desc: '自带 API Key 连接任意大模型接口：多轮对话、图片生成、联网搜索，兼容 Chat Completions 与 Responses 协议，密钥只存在页面内存中。',
    frameTitle: 'AI 实验室 · 大模型连接台',
  },
  en: {
    title: 'AI Lab · VanSail Tools',
    desc: 'Bring your own key to any AI endpoint: multi-turn chat, image generation and web search, compatible with Chat Completions and Responses protocols.',
    frameTitle: 'AI Lab · AI connection console',
  },
};

export default function Page() {
  return <ToolPage id="ai" copy={COPY} />;
}
