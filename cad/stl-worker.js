import {parseStl} from './stl-geometry.js';

self.onmessage = async ({data: file}) => {
  try {
    self.postMessage({phase: 'fetch'});
    const buffer = await file.arrayBuffer();
    self.postMessage({phase: 'parse'});
    const mesh = parseStl(buffer);
    mesh.name = file.name;
    self.postMessage(
      {
        meshes: [mesh],
        root: {name: file.name, meshes: [0], children: []},
        circles: new Float64Array(),
      },
      [
        mesh.attributes.position.array.buffer,
        mesh.attributes.normal.array.buffer,
      ],
    );
  } catch {
    self.postMessage({error: true});
  }
};
