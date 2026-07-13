---
sidebar_position: 2
---

# 组件使用指南

本指南介绍本站文档中常用的组件写法。本站基于 Docusaurus，并针对**代码块**做了定制增强，下面重点说明。

> 注意：本站所有代码块在页面加载时**默认处于折叠状态**（只显示标题栏）。阅读下方示例时，请先点击标题栏或折叠箭头将其展开——这一行为本身就是本站代码块的定制特性。

## 1. 代码块（Code Block）

一个代码块的完整结构为「标题栏 + 代码区」，支持折叠、复制、行号、行高亮等能力。

### 1.1 基本写法

在代码块起始行使用元信息：`语言 title="标题" showLineNumbers`。

```bash title="安装命令" showLineNumbers
sudo apt update
sudo apt install zsh -y
echo "done"
```

- `title="..."`：显示在标题栏左侧，说明这段代码的作用。
- `showLineNumbers`：显示行号。

### 1.2 默认折叠与展开

所有代码块默认折叠，点击**标题栏**或标题栏右侧的**折叠箭头**即可展开 / 收起，并带有平滑动画：

- 折叠箭头**向内（黄色）**：表示当前已展开，点击可收起。
- 折叠箭头**向外（蓝色）**：表示当前已收起，点击可展开。

此特性由全站脚本 `static/js/codeblock-toggle.js` 与自定义主题 `src/theme/CodeBlock` 共同实现。

### 1.3 复制代码

代码块提供两种复制方式：

- 标题栏右侧的「复制」按钮：一键复制**整段**代码。
- 鼠标悬停任意一行，该行右侧会出现复制图标，点击可**仅复制该行**。

### 1.4 自动换行

当某行代码过长、出现横向滚动条时，标题栏会出现换行切换按钮，点击可在「横向滚动」与「自动换行」之间切换。

### 1.5 行高亮

Docusaurus 内置功能：在语言后添加 `{行号}` 可高亮指定行，支持逗号与区间。

```js {2,4-6} title="高亮示例"
const a = 1;
const b = 2;     // 这一行被高亮
const c = 3;
const d = 4;     // 这几行被高亮
const e = 5;
const f = 6;
```

### 1.6 多语言 / 多方案切换

使用 `<Tabs>` 与 `<TabItem>` 把多种写法放在一个可切换的卡片里：

<Tabs>
<TabItem value="bash" label="Bash" default>

```bash
echo "Hello from Bash"
```

</TabItem>
<TabItem value="python" label="Python">

```python
print("Hello from Python")
```

</TabItem>
</Tabs>

> 说明：`Tabs` / `TabItem` 已在全站 MDX 组件中全局注册（见 `src/theme/MDXComponents.js`），文档里可直接使用，无需 `import`。

## 2. 提示框（Admonitions）

用于突出重要信息，写法为 `:::类型` 包裹内容，支持 `note` / `tip` / `info` / `warning` / `danger` / `caution`。

:::note
普通说明，蓝色。
:::

:::tip
实用建议，绿色。
:::

:::info
补充信息，蓝色（info）。
:::

:::warning
注意事项，黄色。
:::

:::danger
危险操作，红色。
:::

:::caution
谨慎操作，橙色。
:::

可附加标题，格式为 `:::tip[小技巧] 内容`。

## 3. 卡片列表（DocCardList）

在分类首页使用 `<DocCardList />` 可自动列出当前目录下的所有文档卡片，无需手动维护链接：

```md
<DocCardList />
```

本栏目的首页正是这样生成的——新增文档后卡片会自动出现。

## 4. 小结

| 组件 | 关键写法 | 说明 |
| --- | --- | --- |
| 代码块 | ```` ```lang title="..." showLineNumbers ```` | 默认折叠、可整块/逐行复制 |
| 行高亮 | ```` ```js {2,4-6} ```` | 高亮指定行 |
| 多方案 | `<Tabs>` / `<TabItem>` | 语言或方案切换 |
| 提示框 | `:::tip[标题]` | 6 种语义颜色 |
| 卡片列表 | `<DocCardList />` | 自动聚合本目录文档 |
