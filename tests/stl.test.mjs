import test from 'node:test';
import assert from 'node:assert/strict';
import {parseStl} from '../cad/stl-geometry.js';

const ascii = `solid triangle
facet normal 0 0 1
outer loop
vertex 0 0 0
vertex 10 0 0
vertex 0 10 0
endloop
endfacet
endsolid triangle`;
const encode = value => new TextEncoder().encode(value).buffer;
function binary() {
  const buffer = new ArrayBuffer(134);
  new Uint8Array(buffer).set(new TextEncoder().encode('solid binary header'));
  const view = new DataView(buffer);
  view.setUint32(80, 1, true);
  view.setFloat32(108, 10, true);
  view.setFloat32(124, 10, true);
  return buffer;
}
test('ASCII and binary (including solid-prefixed header) produce the same mesh', () => {
  const a = parseStl(encode(ascii));
  const b = parseStl(binary());
  assert.deepEqual(a.attributes.position.array, b.attributes.position.array);
  assert.equal(a.attributes.position.array.length, 9);
  assert.deepEqual([...b.attributes.normal.array], [0, 0, 1, 0, 0, 1, 0, 0, 1]);
  assert.equal(a.faceRanges.length, 0);
});
test('empty, truncated, malformed and non-finite files are rejected', () => {
  for (const buffer of [
    new ArrayBuffer(0),
    binary().slice(0, 130),
    encode('solid empty\nendsolid empty'),
    encode('not an stl'),
    encode(ascii.replace('endfacet', '')),
    encode(ascii.replace('vertex 10', 'vertex 1e999')),
    encode(
      ascii
        .replace('vertex 10 0 0', 'vertex 0 0 0')
        .replace('vertex 0 10 0', 'vertex 0 0 0'),
    ),
  ])
    assert.throws(() => parseStl(buffer));
});
test('untrusted binary triangle count is rejected before allocating geometry', () => {
  const buffer = binary();
  new DataView(buffer).setUint32(80, 0xffffffff, true);
  assert.throws(() => parseStl(buffer));
});
