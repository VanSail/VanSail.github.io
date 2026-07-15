---
sidebar_position: 4
---

# Tabs

Use `<Tabs>` and `<TabItem>` to switch between options; they are globally registered in MDX site-wide, no `import` needed.

## Basic Usage

<Tabs>
<TabItem value="use" label="Source" default>

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
<TabItem value="effect" label="Result">

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

## Synced Groups

Give multiple `<Tabs>` the **same `groupId`** and they sync: switching one switches all blocks with the same `groupId` to the matching tab. Useful for splitting "install steps" and "path notes" while keeping a unified choice.

The two independent `<Tabs>` below both use `groupId="os"`; switching either one syncs the other:

<Tabs>
<TabItem value="use" label="Source" default>

````md
<Tabs groupId="os">
<TabItem value="mac" label="macOS" default>

Install on macOS

</TabItem>
<TabItem value="win" label="Windows">

Install on Windows

</TabItem>
</Tabs>

<Tabs groupId="os">
<TabItem value="mac" label="macOS">

macOS path: /Applications

</TabItem>
<TabItem value="win" label="Windows" default>

Windows path: C:\Program Files

</TabItem>
</Tabs>
````

</TabItem>
<TabItem value="effect" label="Result">

<Tabs groupId="os">
<TabItem value="mac" label="macOS" default>

Install on macOS

</TabItem>
<TabItem value="win" label="Windows">

Install on Windows

</TabItem>
</Tabs>

<Tabs groupId="os">
<TabItem value="mac" label="macOS">

macOS path: /Applications

</TabItem>
<TabItem value="win" label="Windows" default>

Windows path: C:\Program Files

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Two Options

There is no limit on the number of options; below is the common two-tab pattern:

<Tabs>
<TabItem value="use" label="Source" default>

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
<TabItem value="effect" label="Result">

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

## Three Options

Below is the three-tab pattern; extend horizontally for more:

<Tabs>
<TabItem value="use" label="Source" default>

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
<TabItem value="effect" label="Result">

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

## Parameters

- `<Tabs>`: container; add `groupId` to sync multiple blocks
- `<TabItem value="..." label="..." default>`: `value` uniquely identifies the tab within its block, `label` is the displayed text, `default` marks the initially selected tab
- **Sync rule**: only `<Tabs>` blocks with the same `groupId` sync (persisted via `localStorage`, kept after refresh); `value` only needs to be unique within its own block and may repeat across blocks. To keep blocks independent, use different `groupId` values.
