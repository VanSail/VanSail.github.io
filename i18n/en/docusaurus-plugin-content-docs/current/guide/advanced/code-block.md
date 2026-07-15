---
sidebar_position: 3
---

# Code Blocks

The custom code blocks on this site are expanded by default and support whole-block / per-line copy. Wrap content with ` ```lang ` and enhance with metadata. Explained by feature below.

## Title and Line Numbers

<Tabs>
<TabItem value="use" label="Source" default>

````md
```bash title="Install command" showLineNumbers
sudo apt update
sudo apt install zsh -y
```
````

</TabItem>
<TabItem value="effect" label="Result">

```bash title="Install command" showLineNumbers
sudo apt update
sudo apt install zsh -y
```

</TabItem>
</Tabs>

## Line Highlighting

<Tabs>
<TabItem value="use" label="Source" default>

````md
```js {2,4-6} title="Line highlight example"
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
```
````

</TabItem>
<TabItem value="effect" label="Result">

```js {2,4-6} title="Line highlight example"
const a = 1;
const b = 2;
const c = 3;
const d = 4;
const e = 5;
const f = 6;
```

</TabItem>
</Tabs>

## Collapse and Copy

Code blocks are expanded by default; click the collapse button at the top right to fold/expand. The copy button at the top right copies the whole block, and hovering a line reveals an icon for per-line copy. No extra config needed.

## Common Metadata

- `title="..."`: title bar text (hidden if omitted)
- `showLineNumbers` / `hideLineNumbers`: show / hide line numbers
- `{line}`: line highlight, supports commas and ranges, e.g. `{2,4-6}`
- languages: `bash` `js` `python` `yaml` `text`, etc.
