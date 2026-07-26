---
sidebar_position: 6
mindmap: true
mindmap_direction: right
mindmap_size: 25
---

# Mind Map

Add `mindmap: true` to a doc's frontmatter, and a mind map is auto-generated at the top based on its headings. Click a node to jump to that section.

## Usage

<Tabs>
<TabItem value="use" label="Source" default>

```md
---
mindmap: true
mindmap_direction: right
mindmap_size: 50
---
```

</TabItem>
<TabItem value="effect" label="Result">

The top of this very document shows the generated mind map; click a node to jump to its section.

</TabItem>
</Tabs>

## Parameters

- `mindmap`: set to `true` to enable
- `mindmap_direction`: `right` (default) / `left` / `both`
- `mindmap_size`: width percentage (default 100; centered when smaller than 100)
