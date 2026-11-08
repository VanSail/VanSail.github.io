// Build smaller Creo AP203 assembly documents with their original placements.
// Each batch includes the selected part definitions and every usage up to the root.
function* stepBatches(buffer) {
  const source = new TextDecoder().decode(buffer);
  const data = /\bDATA\s*;/i.exec(source);
  if (!data) return;
  const header = source.slice(0, data.index + data[0].length);
  const records = new Map();
  const definitions = new Map();
  const usages = new Map();
  const styles = [];
  const presentations = [];
  const entities =
    /#(\d+)\s*=\s*((?:'(?:''|[^'])*'|\/\*[\s\S]*?\*\/|[^;'/]|\/(?!\*))*)\s*;/g;
  entities.lastIndex = header.length;
  const refs = value =>
    Array.from(
      value.matchAll(/'(?:''|[^'])*'|\/\*[\s\S]*?\*\/|#(\d+)/g),
      m => m[1] && Number(m[1]),
    ).filter(Boolean);
  for (const [, id, value] of source.matchAll(entities)) {
    records.set(Number(id), value);
  }
  const references = id => refs(records.get(id) || '');
  let usageCount = 0;
  let placementCount = 0;
  for (const [id, value] of records) {
    if (value.startsWith('NEXT_ASSEMBLY_USAGE_OCCURRENCE(')) usageCount++;
    // These relationships can attach geometry outside the assembly paths below.
    if (value.startsWith('SHAPE_REPRESENTATION_RELATIONSHIP(')) return;
    if (value.startsWith('SHAPE_DEFINITION_REPRESENTATION(')) {
      const [shape] = references(id);
      const [product] = references(shape);
      if (records.get(product)?.startsWith('PRODUCT_DEFINITION(')) {
        if (!definitions.has(product)) definitions.set(product, []);
        definitions.get(product).push(id);
      }
    } else if (value.startsWith('CONTEXT_DEPENDENT_SHAPE_REPRESENTATION(')) {
      const [, shape] = references(id);
      const [usage] = references(shape);
      if (!records.get(usage)?.startsWith('NEXT_ASSEMBLY_USAGE_OCCURRENCE('))
        continue;
      const [parent, child] = references(usage);
      if (!usages.has(child)) usages.set(child, []);
      usages.get(child).push({parent, id});
      placementCount++;
    } else if (value.startsWith('STYLED_ITEM(')) styles.push(id);
    else if (
      value.startsWith(
        'MECHANICAL_DESIGN_GEOMETRIC_PRESENTATION_REPRESENTATION(',
      )
    )
      presentations.push(id);
  }
  const parents = new Set();
  for (const edges of usages.values())
    for (const {parent} of edges) parents.add(parent);
  if (usageCount !== placementCount) return;
  // An assembly carrying geometry of its own would repeat it in each batch.
  for (const parent of parents) {
    if (!definitions.has(parent)) return;
    for (const definition of definitions.get(parent)) {
      const [, representation] = references(definition);
      if (!records.get(representation)?.startsWith('SHAPE_REPRESENTATION('))
        return;
      for (const item of references(representation).slice(0, -1)) {
        if (!records.get(item)?.startsWith('AXIS2_PLACEMENT_3D(')) return;
      }
    }
  }
  const leaves = [...definitions.keys()].filter(id => !parents.has(id));
  if (!usages.size || leaves.length < 2) return;
  const encoder = new TextEncoder();
  const batchSize = Math.min(32, Math.ceil(leaves.length / 2));
  for (let start = 0; start < leaves.length; start += batchSize) {
    const seeds = [];
    const visited = new Set();
    const pending = leaves.slice(start, start + batchSize);
    while (pending.length) {
      const product = pending.pop();
      if (visited.has(product)) continue;
      visited.add(product);
      seeds.push(...(definitions.get(product) || []));
      for (const {parent, id} of usages.get(product) || []) {
        seeds.push(id);
        pending.push(parent);
      }
    }
    const included = new Set();
    function include() {
      while (seeds.length) {
        const id = seeds.pop();
        if (included.has(id) || !records.has(id)) continue;
        included.add(id);
        for (const ref of references(id)) seeds.push(ref);
      }
    }
    include();
    for (const id of styles)
      if (included.has(references(id).at(-1))) seeds.push(id);
    include();
    const lines = [header];
    for (const id of presentations) {
      const value = records.get(id);
      const match = /^(.*?,\s*\()([\s\d,#]+)(\)\s*,\s*#(\d+)\s*\))$/.exec(
        value,
      );
      if (!match) continue;
      const active = refs(match[2]).filter(ref => included.has(ref));
      if (!active.length) continue;
      lines.push(
        '#' +
          id +
          '=' +
          match[1] +
          active.map(ref => '#' + ref).join(',') +
          match[3] +
          ';',
      );
      seeds.push(Number(match[4]));
    }
    include();
    for (const id of included)
      lines.push('#' + id + '=' + records.get(id) + ';');
    lines.push('ENDSEC;', 'END-ISO-10303-21;');
    yield {
      bytes: encoder.encode(lines.join('\n')),
      done: Math.min(start + batchSize, leaves.length),
      total: leaves.length,
    };
  }
}
