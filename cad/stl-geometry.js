import {STLLoader} from 'three/addons/loaders/STLLoader.js';

// Check binary counts before the loader allocates arrays; binary headers may
// start with "solid", so the exact byte length takes precedence over text.
export function parseStl(buffer) {
  const bytes = new Uint8Array(buffer);
  const count =
    bytes.length >= 84 ? new DataView(buffer).getUint32(80, true) : 0;
  const binary = bytes.length >= 84 && 84 + count * 50 === bytes.length;
  let expectedTriangles = count;
  if (!binary) {
    const text = new TextDecoder('utf-8', {fatal: true}).decode(bytes).trim();
    if (!/^solid\b/i.test(text) || !/endsolid[^\r\n]*$/i.test(text))
      throw new Error('Invalid STL');
    const facets = text.match(/\bfacet\s+normal\b/gi)?.length || 0;
    expectedTriangles = facets;
    const vertices = text.match(/\bvertex\b/gi)?.length || 0;
    const ends = text.match(/\bendfacet\b/gi)?.length || 0;
    if (!facets || ends !== facets || vertices !== facets * 3)
      throw new Error('Invalid STL');
  }
  const geometry = new STLLoader().parse(buffer);
  const position = geometry.getAttribute('position');
  if (
    !position ||
    !position.count ||
    position.count !== expectedTriangles * 3 ||
    !position.array.every(Number.isFinite)
  ) {
    geometry.dispose();
    throw new Error('Invalid STL');
  }
  // Recompute normals so missing or invalid source normals cannot hide a mesh.
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  if (
    !(geometry.boundingSphere.radius > 0) ||
    !Number.isFinite(geometry.boundingSphere.radius)
  ) {
    geometry.dispose();
    throw new Error('Invalid STL');
  }
  const mesh = {
    attributes: {
      position: {array: position.array},
      normal: {array: geometry.getAttribute('normal').array},
    },
    faceRanges: new Uint32Array(),
  };
  geometry.dispose();
  return mesh;
}
