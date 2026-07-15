---
sidebar_position: 8
---

# Links

## Internal Links (Absolute Path)

Use `/docs/...` absolute paths for in-site docs; clicks navigate within the site regardless of the current page location.

<Tabs>
<TabItem value="use" label="Source" default>

````md
[Guide Home](/docs/guide/)
````

</TabItem>
<TabItem value="effect" label="Result">

[Guide Home](/docs/guide/)

</TabItem>
</Tabs>

## Internal Links (Relative Path)

Relative paths use `./` for the current directory and `../` for the parent; they resolve relative to **the current document's location**.

<Tabs>
<TabItem value="use" label="Source" default>

````md
[Code tutorial](./code)
[Tabs tutorial](../advanced/tabs)
````

</TabItem>
<TabItem value="effect" label="Result">

[Code tutorial](./code)
[Tabs tutorial](../advanced/tabs)

</TabItem>
</Tabs>

- `./code`: jumps to the "Code" tutorial in the same directory (basic)
- `../advanced/tabs`: jumps to the "Tabs" tutorial in the parent `advanced` directory

## Anchor Links (In-page)

Docusaurus **auto-generates an anchor id for every heading** (rule: strip punctuation, spaces become hyphens). Use `#id` for in-page jumps, and prepend the doc path for cross-page jumps. The anchor id of this page's "Internal Links (Absolute Path)" section is `internal-links-absolute-path`.

<Tabs>
<TabItem value="use" label="Source" default>

````md
[Jump to "Internal Links (Absolute Path)"](#internal-links-absolute-path)

[Jump to the anchor of the Links tutorial](/docs/guide/basic/links#internal-links-absolute-path)
````

</TabItem>
<TabItem value="effect" label="Result">

[Jump to "Internal Links (Absolute Path)"](#internal-links-absolute-path)

[Jump to the anchor of the Links tutorial](/docs/guide/basic/links#internal-links-absolute-path)
</TabItem>
</Tabs>

> You can view the anchor id in the browser address bar or the "#" link next to a heading. For a semantic English id, write `## Heading {#custom-id}` after the heading (requires MDX config support).

## External Links

External links use a full `https://` address and open in a new tab automatically.

<Tabs>
<TabItem value="use" label="Source" default>

````md
[Docusaurus website](https://docusaurus.io)
````

</TabItem>
<TabItem value="effect" label="Result">

[Docusaurus website](https://docusaurus.io)

</TabItem>
</Tabs>
