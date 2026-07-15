---
sidebar_position: 11
---

# Collapsible Content

Use native HTML `<details>` and `<summary>` to create collapsible content blocks. MDX supports them directly without importing any extra component. They are ideal for "expand to read more" or "supplementary notes" long-form folding scenarios.

## Basic Usage

Collapsed by default; click the title to expand:

<Tabs>
<TabItem value="use" label="Source" default>

````md
<details>
  <summary>Click to expand installation steps</summary>

  This is the collapsed content. You can write **bold**, `inline code`, [links](/docs/guide/basic/links) and other Markdown here.

  - Step 1: Install dependencies
  - Step 2: Start the project
</details>
````

</TabItem>
<TabItem value="effect" label="Result">

<details>
  <summary>Click to expand installation steps</summary>

  This is the collapsed content. You can write **bold**, `inline code`, [links](/docs/guide/basic/links) and other Markdown here.

  - Step 1: Install dependencies
  - Step 2: Start the project
</details>

</TabItem>
</Tabs>

## Expanded by Default

Add the `open` attribute to `<details>` so it is expanded when the page loads:

<Tabs>
<TabItem value="use" label="Source" default>

````md
<details open>
  <summary>Content expanded by default</summary>

  This content is expanded when the page opens; click the title to collapse it.
</details>
````

</TabItem>
<TabItem value="effect" label="Result">

<details open>
  <summary>Content expanded by default</summary>

  This content is expanded when the page opens; click the title to collapse it.
</details>

</TabItem>
</Tabs>

## Parameter Reference

- `<details>`: the collapsible container; add the `open` attribute to expand by default
- `<summary>`: the clickable title, written as the first line inside `<details>`; when omitted, it shows "Details" by default
- Inside `<details>` you can use any Markdown / MDX content (bold, lists, code blocks, links, etc.)
