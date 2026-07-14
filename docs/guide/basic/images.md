---
sidebar_position: 9
---

# 图片

## 基础用法

使用 Markdown 语法插入图片，图片放在 `static/img/` 目录，引用路径以 `/img/` 开头。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
![示意图](/img/logo.svg)
````

</TabItem>
<TabItem value="effect" label="实际效果">

![示意图](/img/logo.svg)

</TabItem>
</Tabs>

## 图片居中

Markdown 语法无法直接居中，改用 HTML 用 `<div style={{ textAlign: 'center' }}>` 包裹即可。

<Tabs>
<TabItem value="use" label="实现代码" default>

````jsx
<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="示意图" />
</div>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="示意图" />
</div>

</TabItem>
</Tabs>

## 图片旋转

给 `<img>` 加 `style={{ transform: 'rotate(角度)' }}`，正值为顺时针旋转。

<Tabs>
<TabItem value="use" label="实现代码" default>

````jsx
<img src="/img/logo.svg" alt="示意图" style={{ transform: 'rotate(15deg)' }} />
````

</TabItem>
<TabItem value="effect" label="实际效果">

<img src="/img/logo.svg" alt="示意图" style={{ transform: 'rotate(15deg)' }} />

</TabItem>
</Tabs>

## 图片居中并旋转

居中（外层 `div`）与旋转（内层 `img`）组合使用即可同时生效。

<Tabs>
<TabItem value="use" label="实现代码" default>

````jsx
<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="示意图" style={{ transform: 'rotate(15deg)' }} />
</div>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="示意图" style={{ transform: 'rotate(15deg)' }} />
</div>

</TabItem>
</Tabs>

> 图片路径 `.svg`、`.png`、`.jpg` 等均可；本站已为图片统一加上圆角与细边框（见全局样式 `.markdown img`）。
