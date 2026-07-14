---
sidebar_position: 11
---

# 折叠

用原生 HTML 的 `<details>` 与 `<summary>` 实现可折叠内容块，MDX 直接支持，无需引入额外组件。适合放「展开看更多」「补充说明」等长文折叠场景。

## 基本用法

默认折叠，点击标题即可展开：

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
<details>
  <summary>点击展开安装步骤</summary>

  这里是折叠的内容，可写 **加粗**、`行内代码`、[链接](/docs/guide/basic/links) 等 Markdown。

  - 第一步：安装依赖
  - 第二步：启动项目
</details>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<details>
  <summary>点击展开安装步骤</summary>

  这里是折叠的内容，可写 **加粗**、`行内代码`、[链接](/docs/guide/basic/links) 等 Markdown。

  - 第一步：安装依赖
  - 第二步：启动项目
</details>

</TabItem>
</Tabs>

## 默认展开

给 `<details>` 加上 `open` 属性，页面加载时即为展开状态：

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
<details open>
  <summary>默认展开的内容</summary>

  这段内容打开页面时就是展开的，点击标题可收起。
</details>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<details open>
  <summary>默认展开的内容</summary>

  这段内容打开页面时就是展开的，点击标题可收起。
</details>

</TabItem>
</Tabs>

## 参数说明

- `<details>`：折叠容器；加 `open` 属性则默认展开
- `<summary>`：可点击的标题，写在 `<details>` 内的第一行；不写 `<summary>` 时默认显示「详细信息」
- `<details>` 内部支持任意 Markdown / MDX 内容（加粗、列表、代码块、链接等）
