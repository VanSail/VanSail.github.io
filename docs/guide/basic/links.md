---
sidebar_position: 8
---

# 链接

## 站内链接（绝对路径）

站内文档使用 `/docs/...` 绝对路径，点击后在本站内部跳转，不受当前页面位置影响。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
[指南首页](/docs/guide/)
````

</TabItem>
<TabItem value="effect" label="实际效果">

[指南首页](/docs/guide/)

</TabItem>
</Tabs>

## 站内链接（相对路径）

相对路径以 `./` 表示当前目录、`../` 表示上一级目录，相对**当前文档所在位置**跳转。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
[代码教程](./code)
[方案切换](../advanced/tabs)
````

</TabItem>
<TabItem value="effect" label="实际效果">

[代码教程](./code)

[方案切换](../advanced/tabs)

</TabItem>
</Tabs>

- `./code`：跳到同目录（basic）下的「代码」教程
- `../advanced/tabs`：跳到上一级的 `advanced` 目录下的「方案切换」教程

## 锚点链接（页内跳转）

Docusaurus 会为**每个标题自动生成锚点 id**（规则：去除标点、空格转为连字符）。页面内用 `#id` 跳转，跨页面则在 `#id` 前加上文档路径。本页「站内链接（绝对路径）」的锚点 id 即 `站内链接绝对路径`。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
[跳到「站内链接（绝对路径）」](#站内链接绝对路径)

[跳到链接教程的锚点](/docs/guide/basic/links#站内链接绝对路径)
````

</TabItem>
<TabItem value="effect" label="实际效果">

[跳到「站内链接（绝对路径）」](#站内链接绝对路径)

[跳到链接教程的锚点](/docs/guide/basic/links#站内链接绝对路径)
</TabItem>
</Tabs>

> 锚点 id 可在浏览器地址栏或标题旁的「#」链接中查看。如需语义化英文 id，可在标题后写 `## 标题 {#custom-id}`（需 MDX 配置支持）。

## 站外链接

站外链接使用完整的 `https://` 地址，点击后自动在新标签页打开。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
[Docusaurus 官网](https://docusaurus.io)
````

</TabItem>
<TabItem value="effect" label="实际效果">

[Docusaurus 官网](https://docusaurus.io)

</TabItem>
</Tabs>
