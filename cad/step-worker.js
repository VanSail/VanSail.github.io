importScripts('./occt-import-js.js', './step-batches.js');
self.onmessage = async ({data: file}) => {
  try {
    const parser = occtimportjs();
    const reading = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = event =>
        self.postMessage({
          phase: 'fetch',
          loaded: event.loaded,
          total: file.size,
        });
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      self.postMessage({phase: 'fetch', loaded: 0, total: file.size});
      reader.readAsArrayBuffer(file);
    });
    const [occt, buffer] = await Promise.all([parser, reading]);
    self.postMessage({phase: 'parse'});
    const large = file.size >= 32 * 1024 * 1024;
    const params = large
      ? {linearDeflection: 0.004, angularDeflection: 0.9}
      : null;
    const header = new TextDecoder()
      .decode(buffer.slice(0, 4096))
      .split('ENDSEC;')[0];
    const batchReader =
      large &&
      header.includes('CREO PARAMETRIC') &&
      header.includes('CONFIG_CONTROL_DESIGN')
        ? stepBatches(buffer)
        : [];
    const meshes = [];
    const transfers = [];
    const root = {name: '', meshes: [], children: []};
    for (const batch of batchReader) {
      const result = occt.ReadStepFile(batch.bytes, params);
      if (!result.success) throw new Error('STEP');
      function appendNode(node, offset) {
        node.meshes = (node.meshes || []).map(i => i + offset);
        for (const child of node.children || []) appendNode(child, offset);
      }
      appendNode(result.root, meshes.length);
      root.children.push(...result.root.children);
      root.meshes.push(...result.root.meshes);
      packMeshes(result, transfers);
      for (const mesh of result.meshes) meshes.push(mesh);
      self.postMessage({
        phase: 'parse',
        loaded: batch.done,
        total: batch.total,
      });
    }
    let output = {root, meshes};
    if (!meshes.length) {
      output = occt.ReadStepFile(new Uint8Array(buffer), params);
      if (!output.success || !output.meshes?.length) throw new Error('STEP');
      packMeshes(output, transfers);
    }
    if (!output.meshes.some(mesh => mesh.index.array.length >= 3)) {
      self.postMessage({error: 'emptyGeometry'});
      return;
    }
    self.postMessage({phase: 'prepare'});
    const circles = readCircles(buffer);
    transfers.push(circles.buffer);
    self.postMessage(
      {root: output.root, meshes: output.meshes, circles},
      transfers,
    );
  } catch {
    self.postMessage({error: true});
  }
};

function packMeshes(result, transfers) {
  for (const mesh of result.meshes) {
    for (const attribute of [
      mesh.attributes.position,
      mesh.attributes.normal,
    ]) {
      if (!attribute) continue;
      attribute.array = Float32Array.from(attribute.array);
      transfers.push(attribute.array.buffer);
    }
    mesh.faceRanges = Uint32Array.from(
      mesh.brep_faces.flatMap(face =>
        face.first <= face.last && face.last < mesh.index.array.length / 3
          ? [face.first, face.last]
          : [],
      ),
    );
    transfers.push(mesh.faceRanges.buffer);
    delete mesh.brep_faces;
    const Index =
      mesh.attributes.position.array.length / 3 <= 65535
        ? Uint16Array
        : Uint32Array;
    mesh.index.array = Index.from(mesh.index.array);
    transfers.push(mesh.index.array.buffer);
  }
}

// Match source circles to measured rims in model space. Unmatched assembly
// placements and unsupported unit contexts retain the mesh estimate.
function readCircles(buffer) {
  const source = new TextDecoder().decode(buffer);
  const units = [
    ...source.matchAll(
      /LENGTH_UNIT\s*\(\s*\)\s*NAMED_UNIT\s*\(\s*\*\s*\)\s*SI_UNIT\s*\(\s*([^,]+),\s*\.METRE\.\s*\)/gi,
    ),
  ];
  if (
    !units.length ||
    units.some(m => m[1].trim().toUpperCase() !== '.MILLI.') ||
    /CONVERSION_BASED_UNIT\s*\(/i.test(source)
  )
    return new Float64Array();
  const curves = [];
  const axes = new Map(),
    points = new Map(),
    directions = new Map();
  for (const m of source.matchAll(
    /=\s*CIRCLE\s*\(\s*'(?:''|[^'])*'\s*,\s*#(\d+)\s*,\s*([+\d.Ee-]+)\s*\)/gi,
  )) {
    curves.push([m[1], Number(m[2])]);
    axes.set(m[1], null);
  }
  if (!curves.length) return new Float64Array();
  for (const m of source.matchAll(
    /#(\d+)\s*=\s*AXIS2_PLACEMENT_3D\s*\(\s*'(?:''|[^'])*'\s*,\s*#(\d+)\s*,\s*(?:#(\d+)|\$)/gi,
  )) {
    if (!axes.has(m[1])) continue;
    axes.set(m[1], [m[2], m[3]]);
    points.set(m[2], null);
    if (m[3]) directions.set(m[3], null);
  }
  for (const m of source.matchAll(
    /#(\d+)\s*=\s*(CARTESIAN_POINT|DIRECTION)\s*\(\s*'(?:''|[^'])*'\s*,\s*\(([^()]*)\)/gi,
  )) {
    const map = m[2].toUpperCase() === 'DIRECTION' ? directions : points;
    if (!map.has(m[1])) continue;
    const xyz = m[3].split(',').map(Number);
    if (xyz.length === 3 && xyz.every(Number.isFinite)) map.set(m[1], xyz);
  }
  const rows = [];
  for (const [id, radius] of curves) {
    const axis = axes.get(id);
    if (!axis || !(radius > 0)) continue;
    const center = points.get(axis[0]),
      normal = axis[1] ? directions.get(axis[1]) : [0, 0, 1];
    if (center && normal) rows.push([...center, ...normal, radius]);
  }
  rows.sort((a, b) => a[0] - b[0]);
  return Float64Array.from(rows.flat());
}
