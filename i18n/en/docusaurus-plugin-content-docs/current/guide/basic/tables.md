---
sidebar_position: 10
---

# Tables

## Basic Usage

Use `| --- | --- |` below the header; the number of columns must match.

<Tabs>
<TabItem value="use" label="Source" default>

````md
| Name | Description |
| --- | --- |
| Heading | Page level |
| List | Item listing |
````

</TabItem>
<TabItem value="effect" label="Result">

| Name | Description |
| --- | --- |
| Heading | Page level |
| List | Item listing |

</TabItem>
</Tabs>

## Column Alignment

Colons in the separator row control alignment: `:---` left, `:--:` center, `---:` right.

<Tabs>
<TabItem value="use" label="Source" default>

````md
| Left | Center | Right |
| :--- | :--: | ---: |
| Apple | 3 | 9.0 |
| Banana | 12 | 2.5 |
````

</TabItem>
<TabItem value="effect" label="Result">

| Left | Center | Right |
| :--- | :--: | ---: |
| Apple | 3 | 9.0 |
| Banana | 12 | 2.5 |

</TabItem>
</Tabs>

## Inline Formatting in Cells

Cells can mix bold, inline code, links, and other Markdown syntax.

<Tabs>
<TabItem value="use" label="Source" default>

````md
| Type | Example |
| --- | --- |
| Bold | **Important** |
| Code | `npm install` |
| Link | [Docusaurus](https://docusaurus.io) |
````

</TabItem>
<TabItem value="effect" label="Result">

| Type | Example |
| --- | --- |
| Bold | **Important** |
| Code | `npm install` |
| Link | [Docusaurus](https://docusaurus.io) |

</TabItem>
</Tabs>

## Line Breaks in Cells

Line breaks inside a cell need HTML `<br/>` (a Markdown newline is not parsed as a break).

<Tabs>
<TabItem value="use" label="Source" default>

````md
| Feature | Description |
| --- | --- |
| Heading<br/>Multi-level | H1–H6<br/>Auto numbering |
| List | Unordered / ordered<br/>Task list |
````

</TabItem>
<TabItem value="effect" label="Result">

| Feature | Description |
| --- | --- |
| Heading<br/>Multi-level | H1–H6<br/>Auto numbering |
| List | Unordered / ordered<br/>Task list |

</TabItem>
</Tabs>
