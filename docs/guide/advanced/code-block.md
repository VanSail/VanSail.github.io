---
sidebar_position: 3
---

# 代码块

本站定制的代码块默认展开、可整块 / 逐行复制。用 ` ```语言 ` 包裹内容，可用元信息增强。下面按功能说明。

## 标题与行号

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
```bash title="安装命令" showLineNumbers
sudo apt update
sudo apt install zsh -y
```
````

</TabItem>
<TabItem value="effect" label="实际效果">

```bash title="安装命令" showLineNumbers
sudo apt update
sudo apt install zsh -y
```

</TabItem>
</Tabs>

## 行高亮

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
```js {2,4-6} title="行高亮示例"
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
```
````

</TabItem>
<TabItem value="effect" label="实际效果">

```js {2,4-6} title="行高亮示例"
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
```

</TabItem>
</Tabs>

## 折叠与复制

代码块默认展开，点击右上角的折叠按钮可收起 / 展开；右上角复制按钮可整块复制，每行 hover 出现图标可逐行复制。无需额外配置。

## 常用元信息

- `title="..."`：标题栏文字（不写则不显示）
- `showLineNumbers` / `hideLineNumbers`：显示 / 隐藏行号
- `{行号}`：行高亮，支持逗号与区间，如 `{2,4-6}`
- 语言：`bash` `js` `python` `yaml` `text` 等
