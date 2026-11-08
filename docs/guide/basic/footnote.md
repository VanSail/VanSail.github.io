---
title: "脚注"
description: "脚注写法：为正文补充引用与说明，并在文末自动汇总。"
sidebar_position: 5
---

# 脚注

在正文中用 `[^标记]` 引用，文末用 `[^标记]: 内容` 定义脚注，标记需前后一致。

<Tabs>
<TabItem value="use" label="实现代码" default>

````md
正文有注释[^1]。

[^1]: 脚注内容。
````

</TabItem>
<TabItem value="effect" label="实际效果">

正文有注释[^1]。

[^1]: 脚注内容。

</TabItem>
</Tabs>
