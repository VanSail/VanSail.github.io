---
sidebar_position: 6
mindmap: true
mindmap_direction: right
mindmap_size: 25
---

# 思维导图

给文档 frontmatter 加 `mindmap: true`，顶部会按标题自动生成导图，点击节点跳转章节。

## 用法

<Tabs>
<TabItem value="use" label="实现代码" default>

```md
---
mindmap: true
mindmap_direction: right
mindmap_size: 50
---
```

</TabItem>
<TabItem value="effect" label="实际效果">

本文档顶部即为开启后的思维导图，点击节点可跳转到对应章节。

</TabItem>
</Tabs>

## 参数

- `mindmap`：设为 `true` 开启
- `mindmap_direction`：`right`（默认）/ `left` / `both`
- `mindmap_size`：宽度百分比（默认 100，小于 100 时居中）
