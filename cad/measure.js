import * as T from 'three';
import {pickedRing} from './measure-geometry.js';

export function measurement({
  panel,
  model,
  scene,
  camera,
  canvas,
  circles,
  t,
  draw,
  signal,
  selection,
}) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = t('测量', 'Measure');
  const mode = document.createElement('select');
  mode.setAttribute('aria-label', summary.textContent);
  for (const [value, title] of [
    ['distance', t('两点距离', 'Point distance')],
    ['bounds', t('长宽高', 'Dimensions')],
    ['diameter', t('孔径', 'Hole diameter')],
    ['centers', t('孔中心距', 'Hole center distance')],
  ])
    mode.add(new Option(title, value));
  const output = document.createElement('output');
  output.setAttribute('aria-live', 'polite');
  const snapLabel = document.createElement('label'),
    snap = document.createElement('input');
  snap.type = 'checkbox';
  snap.checked = true;
  snapLabel.append(snap, t('吸附顶点', 'Snap to vertices'));
  const scope = document.createElement('select');
  scope.setAttribute('aria-label', t('测量范围', 'Measurement scope'));
  scope.add(new Option(t('整个模型', 'Whole model'), 'all'));
  scope.add(new Option(t('选中部件', 'Selected part'), 'part'));
  const clear = document.createElement('button');
  clear.textContent = t('重新测量', 'Measure again');
  details.append(summary, mode, scope, snapLabel, output, clear);
  panel.append(details);
  const marks = new T.Group();
  scene.add(marks);
  const lineMaterial = new T.LineBasicMaterial({
    color: 0xffd454,
    depthTest: false,
    depthWrite: false,
  });
  const dotMaterial = new T.PointsMaterial({
    color: 0xffd454,
    size: 8,
    sizeAttenuation: false,
    depthTest: false,
    depthWrite: false,
  });
  let first,
    finished = false,
    estimated = false;
  function clearMarks() {
    for (const child of marks.children) child.geometry.dispose();
    marks.clear();
    first = null;
    finished = false;
    estimated = false;
  }
  function mark(points, kind) {
    const geom = new T.BufferGeometry().setFromPoints(points);
    const obj =
      kind === 'dot'
        ? new T.Points(geom, dotMaterial)
        : new T.Line(geom, lineMaterial);
    obj.renderOrder = 100;
    marks.add(obj);
  }
  signal.addEventListener(
    'abort',
    () => {
      clearMarks();
      lineMaterial.dispose();
      dotMaterial.dispose();
      scene.remove(marks);
    },
    {once: true},
  );
  const num = n =>
    (Number(n.toFixed(3)) || 0).toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
  const axes = v =>
    ['x', 'y', 'z'].map(k => k.toUpperCase() + ' ' + num(v[k])).join(' · ') +
    ' mm';
  function dimensions() {
    clearMarks();
    const part = selection();
    if (scope.value === 'part' && !part) {
      output.textContent = t('请选择一个部件', 'Select a component');
      draw();
      return;
    }
    const box = new T.Box3();
    for (const obj of scope.value === 'part'
      ? part.indices.map(i => model.children[i])
      : model.children)
      box.union(obj.geometry.boundingBox);
    if (!box.isEmpty()) {
      const helper = new T.Box3Helper(box, 0xffd454);
      helper.material.dispose();
      helper.material = lineMaterial;
      helper.renderOrder = 100;
      marks.add(helper);
      output.textContent = axes(box.getSize(new T.Vector3()));
    }
    draw();
  }
  function reset() {
    clearMarks();
    scope.hidden = mode.value !== 'bounds';
    snapLabel.hidden = mode.value !== 'distance';
    if (details.open && mode.value === 'bounds') {
      dimensions();
      return;
    }
    output.textContent =
      mode.value === 'distance'
        ? t('点选第一个点', 'Pick the first point')
        : t('点选孔口边缘或内壁', 'Pick a rim or hole wall');
    draw();
  }
  mode.onchange = scope.onchange = clear.onclick = details.ontoggle = reset;
  reset();
  function pick(hit) {
    if (!details.open || mode.value === 'bounds') return false;
    const depth = Math.abs(
      hit.point.clone().applyMatrix4(camera.matrixWorldInverse).z,
    );
    const perPixel =
      (2 * depth * Math.tan(T.MathUtils.degToRad(camera.fov / 2))) /
      canvas.clientHeight;
    const hole = mode.value !== 'distance';
    let point = hit.point.clone(),
      ring;
    if (hole) {
      ring = pickedRing(hit, circles, 8 * perPixel);
      if (!ring) {
        output.textContent = t(
          '未识别到圆孔，请靠近孔口边缘点选',
          'No circle found. Pick closer to the rim.',
        );
        return true;
      }
      point = ring.center;
    } else if (snap.checked) {
      const projected = point.clone().project(camera);
      let nearest = 9;
      for (const i of [hit.face.a, hit.face.b, hit.face.c]) {
        const v = new T.Vector3().fromBufferAttribute(
          hit.object.geometry.attributes.position,
          i,
        );
        const q = v.clone().project(camera);
        const d = Math.hypot(
          ((q.x - projected.x) * canvas.clientWidth) / 2,
          ((q.y - projected.y) * canvas.clientHeight) / 2,
        );
        if (d < nearest) {
          nearest = d;
          point = v;
        }
      }
    }
    if (finished) clearMarks();
    if (first && point.distanceToSquared(first) < 1e-14) {
      output.textContent = t('请选择另一个位置', 'Pick a different position');
      return true;
    }
    if (ring) {
      const u = new T.Vector3()
        .crossVectors(
          ring.normal,
          Math.abs(ring.normal.z) < 0.9
            ? new T.Vector3(0, 0, 1)
            : new T.Vector3(1, 0, 0),
        )
        .normalize();
      const v = new T.Vector3().crossVectors(ring.normal, u);
      mark(
        Array.from({length: 65}, (_, i) =>
          point
            .clone()
            .addScaledVector(u, ring.radius * Math.cos((i * Math.PI) / 32))
            .addScaledVector(v, ring.radius * Math.sin((i * Math.PI) / 32)),
        ),
      );
      estimated ||= !ring.exact;
    }
    mark([point], 'dot');
    const quality = estimated
      ? t('（网格估算）', ' (mesh estimate)')
      : t('（STEP 圆）', ' (STEP circle)');
    if (mode.value === 'diameter') {
      output.textContent = 'Ø ' + num(ring.radius * 2) + ' mm' + quality;
      finished = true;
    } else if (first) {
      mark([first, point]);
      output.textContent =
        num(first.distanceTo(point)) +
        ' mm' +
        (hole ? quality : '\nΔ ' + axes(point.clone().sub(first)));
      finished = true;
    } else {
      first = point;
      output.textContent = hole
        ? t('点选第二个孔口', 'Pick the second rim')
        : t('点选第二个点', 'Pick the second point');
    }
    draw();
    return true;
  }
  return {
    pick,
    selected() {
      if (details.open && mode.value === 'bounds' && scope.value === 'part')
        dimensions();
    },
  };
}
