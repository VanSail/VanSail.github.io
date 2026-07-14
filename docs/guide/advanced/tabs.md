---
sidebar_position: 4
---

# 方案切换

用 `<Tabs>` 与 `<TabItem>` 在多个方案中切换，已在全站 MDX 全局注册，无需 `import`。

## 基本用法

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
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
````

</TabItem>
<TabItem value="effect" label="实际效果">

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

</TabItem>
</Tabs>

## 多块联动

给多个 `<Tabs>` 设置**相同的 `groupId`**，它们就会联动：切换其中一个，所有同 `groupId` 的块都会同步切到对应标签。常用于「安装步骤」与「路径说明」分开写，但保持统一选择。

下面两个独立的 `<Tabs>` 都带 `groupId="os"`，切换任一个，另一个会跟着联动：

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
<Tabs groupId="os">
<TabItem value="mac" label="macOS" default>

在 macOS 上安装

</TabItem>
<TabItem value="win" label="Windows">

在 Windows 上安装

</TabItem>
</Tabs>

<Tabs groupId="os">
<TabItem value="mac" label="macOS">

macOS 路径：/Applications

</TabItem>
<TabItem value="win" label="Windows" default>

Windows 路径：C:\Program Files

</TabItem>
</Tabs>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<Tabs groupId="os">
<TabItem value="mac" label="macOS" default>

在 macOS 上安装

</TabItem>
<TabItem value="win" label="Windows">

在 Windows 上安装

</TabItem>
</Tabs>

<Tabs groupId="os">
<TabItem value="mac" label="macOS">

macOS 路径：/Applications

</TabItem>
<TabItem value="win" label="Windows" default>

Windows 路径：C:\Program Files

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## 两个选项

选项数量没有限制，下面是两个选项卡的常见写法：

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install docusaurus
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add docusaurus
```

</TabItem>
</Tabs>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<Tabs>
<TabItem value="npm" label="npm" default>

```bash
npm install docusaurus
```

</TabItem>
<TabItem value="yarn" label="yarn">

```bash
yarn add docusaurus
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## 三个选项

下面是三个选项卡的写法，可横向扩展更多：

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
<Tabs>
<TabItem value="js" label="JavaScript" default>

```js
console.log("JS");
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```ts
console.log("TS");
```

</TabItem>
<TabItem value="py" label="Python">

```python
print("Python")
```

</TabItem>
</Tabs>
````

</TabItem>
<TabItem value="effect" label="实际效果">

<Tabs>
<TabItem value="js" label="JavaScript" default>

```js
console.log("JS");
```

</TabItem>
<TabItem value="ts" label="TypeScript">

```ts
console.log("TS");
```

</TabItem>
<TabItem value="py" label="Python">

```python
print("Python")
```

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## 参数说明

- `<Tabs>`：容器；可加 `groupId` 让多个块联动
- `<TabItem value="..." label="..." default>`：`value` 在同一块内唯一标识，`label` 显示文字，`default` 设为默认选中
- **联动规则**：只有 `groupId` 相同的 `<Tabs>` 块才会相互联动（基于 `localStorage` 持久化，刷新页面仍保持）；`value` 仅需在各自块内唯一，不同块之间可重复。如需让某些块互不干扰，请使用不同的 `groupId`
