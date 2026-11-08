import {Vector3} from 'three';

const vertex = (attr, i) => new Vector3().fromBufferAttribute(attr, i);
function fitRing(points) {
  if (points.length < 6) return;
  const a = points[0];
  const farthest = score =>
    points.reduce((best, p) => (score(p) > score(best) ? p : best), a);
  const u = farthest(p => p.distanceToSquared(a))
    .clone()
    .sub(a);
  const v = new Vector3(),
    cross = new Vector3();
  const c = farthest(p => cross.crossVectors(u, v.subVectors(p, a)).lengthSq());
  v.subVectors(c, a);
  const n = new Vector3().crossVectors(u, v);
  const scale = n.lengthSq();
  if (scale <= 1e-12 * u.lengthSq() ** 2) return;
  const center = new Vector3()
    .crossVectors(v, n)
    .multiplyScalar(u.lengthSq())
    .addScaledVector(cross.crossVectors(n, u), v.lengthSq())
    .multiplyScalar(0.5 / scale)
    .add(a);
  n.normalize();
  const radius = center.distanceTo(a);
  const tolerance = Math.max(0.00002, radius * 0.0005);
  if (
    points.some(
      p =>
        Math.abs(p.distanceTo(center) - radius) > tolerance ||
        Math.abs(v.subVectors(p, center).dot(n)) > tolerance,
    )
  )
    return;
  return {center, normal: n, radius};
}

function sourceRing(ring, circles) {
  const {center, normal, radius} = ring,
    tol = Math.max(0.00002, radius * 0.00005, center.length() * 2e-7);
  let lo = 0,
    hi = circles.length / 7;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (circles[mid * 7] < center.x - tol) lo = mid + 1;
    else hi = mid;
  }
  for (
    let i = lo * 7;
    i < circles.length && circles[i] <= center.x + tol;
    i += 7
  ) {
    const p = new Vector3().fromArray(circles, i),
      n = new Vector3().fromArray(circles, i + 3).normalize();
    if (
      p.distanceTo(center) <= tol &&
      Math.abs(radius - circles[i + 6]) <= tol &&
      Math.abs(n.dot(normal)) > 0.999999
    )
      return {center: p, normal: n, radius: circles[i + 6], exact: true};
  }
  return ring;
}

function faceRings(geometry, first, last) {
  const attr = geometry.attributes.position,
    index = geometry.index.array;
  const points = [],
    ids = new Map(),
    edges = new Map();
  function pointId(i) {
    const p = vertex(attr, i),
      key = p.toArray().join(',');
    if (!ids.has(key)) {
      ids.set(key, points.length);
      points.push(p);
    }
    return ids.get(key);
  }
  for (let i = 3 * first; i < 3 * (last + 1); i += 3) {
    const tri = [
      pointId(index[i]),
      pointId(index[i + 1]),
      pointId(index[i + 2]),
    ];
    for (let j = 0; j < 3; j++) {
      const a = tri[j],
        b = tri[(j + 1) % 3],
        key = Math.min(a, b) + ',' + Math.max(a, b);
      if (edges.has(key)) edges.delete(key);
      else if (a !== b) edges.set(key, [a, b]);
    }
  }
  const adj = new Map();
  for (const [a, b] of edges.values()) {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
  }
  const rings = [],
    seen = new Set();
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const pending = [start],
      loop = [];
    let closed = true;
    while (pending.length) {
      const i = pending.pop();
      if (seen.has(i)) continue;
      seen.add(i);
      loop.push(points[i]);
      const next = adj.get(i);
      if (next.length !== 2) closed = false;
      pending.push(...next);
    }
    const ring = closed && fitRing(loop);
    if (ring) rings.push(ring);
  }
  // Split cylindrical faces often have a rectangular boundary joining two arcs.
  // Parallel axial rows identify both end circles even for a half-cylinder.
  const normals = geometry.attributes.normal;
  if (!rings.length && normals && points.length >= 12) {
    const base = vertex(normals, index[3 * first]),
      axis = new Vector3();
    let tangent;
    for (let i = 3 * first; i < 3 * (last + 1); i++) {
      const d = vertex(normals, index[i]).sub(base);
      if (d.lengthSq() < 0.01) continue;
      if (!tangent) tangent = d;
      else if (axis.crossVectors(tangent, d).lengthSq() > 0.0001) break;
    }
    if (axis.lengthSq() > 0.0001) {
      axis.normalize();
      const levels = points.map(p => p.dot(axis));
      let min = Infinity,
        max = -Infinity;
      for (const h of levels) {
        min = Math.min(min, h);
        max = Math.max(max, h);
      }
      const tol = Math.max(0.00003, (max - min) * 0.0001);
      const ends = [min, max].map(h =>
        fitRing(points.filter((_, i) => Math.abs(levels[i] - h) < tol)),
      );
      if (
        ends.every(Boolean) &&
        Math.abs(ends[0].radius - ends[1].radius) <
          Math.max(tol, ends[0].radius * 0.001) &&
        ends.every(r => Math.abs(r.normal.dot(axis)) > 0.9999)
      )
        rings.push(...ends);
    }
  }
  return rings;
}

export function pickedRing(hit, circles, tolerance) {
  const geometry = hit.object.geometry,
    ranges = geometry.userData.faceRanges;
  let lo = 0,
    hi = ranges.length / 2;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (ranges[mid * 2 + 1] < hit.faceIndex) lo = mid + 1;
    else hi = mid;
  }
  if (lo * 2 >= ranges.length || hit.faceIndex < ranges[lo * 2]) return;
  const cache = (geometry.userData.rings ??= new Map());
  if (!cache.has(lo))
    cache.set(
      lo,
      faceRings(geometry, ranges[lo * 2], ranges[lo * 2 + 1]).map(r =>
        sourceRing(r, circles),
      ),
    );
  let best,
    nearest = Infinity;
  for (const r of cache.get(lo)) {
    const delta = hit.point.clone().sub(r.center),
      height = delta.dot(r.normal);
    const radial = Math.abs(
      delta.addScaledVector(r.normal, -height).length() - r.radius,
    );
    if (radial > Math.max(tolerance, r.radius * 0.06)) continue;
    const score = Math.hypot(height, radial);
    if (score < nearest) {
      best = r;
      nearest = score;
    }
  }
  return best;
}
