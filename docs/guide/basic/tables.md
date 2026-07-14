---
sidebar_position: 10
---

# 表格

## 基础用法

表头下方用 `| --- | --- |` 分隔，列数需一致。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
| 名称 | 说明 |
| --- | --- |
| 标题 | 页面层级 |
| 列表 | 条目罗列 |
````

</TabItem>
<TabItem value="effect" label="实际效果">

| 名称 | 说明 |
| --- | --- |
| 标题 | 页面层级 |
| 列表 | 条目罗列 |

</TabItem>
</Tabs>

## 列对齐

分隔行的冒号决定对齐方式：`:---` 左对齐、`:--:` 居中、`---:` 右对齐。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
| 左对齐 | 居中 | 右对齐 |
| :--- | :--: | ---: |
| 苹果 | 3 | 9.0 |
| 香蕉 | 12 | 2.5 |
````

</TabItem>
<TabItem value="effect" label="实际效果">

| 左对齐 | 居中 | 右对齐 |
| :--- | :--: | ---: |
| 苹果 | 3 | 9.0 |
| 香蕉 | 12 | 2.5 |

</TabItem>
</Tabs>

## 单元格内联格式

单元格内可混用加粗、行内代码、链接等 Markdown 语法。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
| 类型 | 示例 |
| --- | --- |
| 加粗 | **重要** |
| 代码 | `npm install` |
| 链接 | [Docusaurus](https://docusaurus.io) |
````

</TabItem>
<TabItem value="effect" label="实际效果">

| 类型 | 示例 |
| --- | --- |
| 加粗 | **重要** |
| 代码 | `npm install` |
| 链接 | [Docusaurus](https://docusaurus.io) |

</TabItem>
</Tabs>

## 单元格换行

单元格内换行需用 HTML 的 `<br/>`（Markdown 的回车不会被解析为换行）。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
| 功能 | 说明 |
| --- | --- |
| 标题<br/>多级 | 支持 H1–H6<br/>自动编号 |
| 列表 | 无序 / 有序<br/>任务列表 |
````

</TabItem>
<TabItem value="effect" label="实际效果">

| 功能 | 说明 |
| --- | --- |
| 标题<br/>多级 | 支持 H1–H6<br/>自动编号 |
| 列表 | 无序 / 有序<br/>任务列表 |

</TabItem>
</Tabs>
