---
sidebar_position: 9
---

# Images

## Basic Usage

Insert images with Markdown syntax. Place image files under `static/img/` and reference them with a path starting with `/img/`.

<Tabs>
<TabItem value="use" label="Source" default>

````md
![diagram](/img/logo.svg)
````

</TabItem>
<TabItem value="effect" label="Result">

![diagram](/img/logo.svg)

</TabItem>
</Tabs>

## Center an Image

Markdown cannot center images directly; wrap them in a `<div style={{ textAlign: 'center' }}>` instead.

<Tabs>
<TabItem value="use" label="Source" default>

````jsx
<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="diagram" />
</div>
````

</TabItem>
<TabItem value="effect" label="Result">

<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="diagram" />
</div>

</TabItem>
</Tabs>

## Rotate an Image

Add `style={{ transform: 'rotate(deg)' }}` to `<img>`; positive values rotate clockwise.

<Tabs>
<TabItem value="use" label="Source" default>

````jsx
<img src="/img/logo.svg" alt="diagram" style={{ transform: 'rotate(15deg)' }} />
````

</TabItem>
<TabItem value="effect" label="Result">

<img src="/img/logo.svg" alt="diagram" style={{ transform: 'rotate(15deg)' }} />

</TabItem>
</Tabs>

## Center and Rotate

Combine centering (outer `div`) and rotation (inner `img`) to apply both at once.

<Tabs>
<TabItem value="use" label="Source" default>

````jsx
<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="diagram" style={{ transform: 'rotate(15deg)' }} />
</div>
````

</TabItem>
<TabItem value="effect" label="Result">

<div style={{ textAlign: 'center' }}>
  <img src="/img/logo.svg" alt="diagram" style={{ transform: 'rotate(15deg)' }} />
</div>

</TabItem>
</Tabs>

> Image paths `.svg`, `.png`, `.jpg`, etc. all work; this site applies a uniform rounded corner and thin border to images (see the global `.markdown img` style).
