import {photoPicker} from './photo-color.js';
import {measurement} from './measure.js';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

function readStep(file, signal, t, progress) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./step-worker.js', import.meta.url));
    const cancel = () => {
      worker.terminate();
      reject(signal.reason);
    };
    signal.addEventListener('abort', cancel, {once: true});
    const finish = () => {
      worker.terminate();
      signal.removeEventListener('abort', cancel);
    };
    worker.onerror = () => {
      finish();
      reject(
        new Error(t('模型解析器加载失败。', 'Failed to load the STEP reader.')),
      );
    };
    worker.onmessage = ({data}) => {
      if (data.phase) {
        progress(data.phase, data.loaded, data.total);
        return;
      }
      finish();
      if (data.error)
        reject(
          new Error(
            data.error === 'emptyGeometry'
              ? t(
                  '已读取模型结构，但未生成可显示的三角面。',
                  'The model structure was read, but no displayable triangles were generated.',
                )
              : t(
                  '未读取到有效的 STEP 实体。',
                  'No readable STEP geometry found.',
                ),
          ),
        );
      else resolve(data);
    };
    worker.postMessage(file);
  });
}
export async function preview({file, view, signal, items, t, progress}) {
  const {meshes, root, circles} = await readStep(file, signal, t, progress);
  signal.throwIfAborted();
  progress('render');
  await new Promise(resolve => setTimeout(resolve, 0));
  signal.throwIfAborted();
  const renderer = new T.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x182730);
  view.append(renderer.domElement);
  const scene = new T.Scene();
  const model = new T.Group();
  scene.add(model, new T.HemisphereLight(0xffffff, 0x809caf, 2));
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 1000);
  camera.up.set(0, 0, 1);
  const light = new T.DirectionalLight(0xffffff, 2);
  light.position.set(2, -3, 5);
  scene.add(light);
  const controls = new OrbitControls(camera, renderer.domElement);
  const draw = () => renderer.render(scene, camera);
  controls.addEventListener('change', draw);
  function resize() {
    const w = Math.max(1, view.clientWidth),
      h = Math.max(1, view.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    draw();
  }
  const observer = new ResizeObserver(resize);
  signal.addEventListener(
    'abort',
    () => {
      observer.disconnect();
      controls.dispose();
      for (const obj of model.children) {
        obj.geometry.dispose();
        obj.userData.base.dispose();
        for (const mat of obj.userData.faces.values()) mat.dispose();
      }
      renderer.dispose();
      renderer.forceContextLoss();
    },
    {once: true},
  );
  let lastYield = performance.now();
  for (const mesh of meshes) {
    if (performance.now() - lastYield > 20) {
      progress('render', model.children.length, meshes.length);
      await new Promise(resolve => setTimeout(resolve, 0));
      signal.throwIfAborted();
      lastYield = performance.now();
    }
    const geometry = new T.BufferGeometry();
    geometry.setAttribute(
      'position',
      new T.BufferAttribute(mesh.attributes.position.array, 3),
    );
    geometry.userData.faceRanges = mesh.faceRanges;
    geometry.setIndex(new T.BufferAttribute(mesh.index.array, 1));
    if (mesh.attributes.normal)
      geometry.setAttribute(
        'normal',
        new T.BufferAttribute(mesh.attributes.normal.array, 3),
      );
    else geometry.computeVertexNormals();
    const material = new T.MeshStandardMaterial({
      color: mesh.color ? new T.Color(...mesh.color) : 0x9ecdc9,
      side: T.DoubleSide,
    });
    const obj = new T.Mesh(geometry, material);
    obj.userData.base = material;
    obj.userData.faces = new Map();
    model.add(obj);
  }
  const sphere = new T.Box3()
    .setFromObject(model)
    .getBoundingSphere(new T.Sphere());
  if (!(sphere.radius > 0 && Number.isFinite(sphere.radius)))
    throw new Error(t('模型范围无效。', 'Invalid model bounds.'));
  function fit() {
    const halfFov = Math.atan(
      Math.tan(T.MathUtils.degToRad(camera.fov / 2)) *
        Math.min(1, camera.aspect),
    );
    const distance = (sphere.radius / Math.sin(halfFov)) * 1.1;
    controls.target.copy(sphere.center);
    camera.position
      .set(1, -1, 0.8)
      .normalize()
      .multiplyScalar(distance)
      .add(sphere.center);
    camera.near = distance / 10000;
    camera.far = distance * 100;
    controls.maxDistance = distance * 20;
    camera.updateProjectionMatrix();
    controls.update();
    draw();
  }
  const originalColors = model.children.map(obj => obj.material.color.clone());
  const editor = document.createElement('aside');
  editor.setAttribute('aria-label', t('组件颜色', 'Component color'));
  editor.className = 'editor';
  editor.hidden = true;
  const heading = document.createElement('strong');
  const label = document.createElement('label');
  const color = document.createElement('input');
  color.type = 'color';
  label.append(t('颜色', 'Color'), color);
  const reset = document.createElement('button');
  reset.textContent = t('恢复原色', 'Restore original colors');
  const scope = document.createElement('select');
  scope.setAttribute('aria-label', t('着色范围', 'Color scope'));
  scope.add(new Option(t('整个部件', 'Whole component'), 'part'));
  scope.add(new Option(t('单个面', 'Single face'), 'face'));
  editor.append(heading, scope, label, reset);
  const parts = new Map();
  let selected, face;

  function regroup(obj) {
    const {base, faces} = obj.userData;
    const g = obj.geometry;
    g.clearGroups();
    if (!faces.size) {
      obj.material = base;
      return;
    }
    const materials = [base],
      ranges = g.userData.faceRanges;
    let cursor = 0;
    for (const key of [...faces.keys()].sort((a, b) => a - b)) {
      const start = 3 * ranges[key],
        end = 3 * (ranges[key + 1] + 1);
      if (start > cursor) g.addGroup(cursor, start - cursor, 0);
      materials.push(faces.get(key));
      g.addGroup(start, end - start, materials.length - 1);
      cursor = end;
    }
    if (cursor < g.index.count) g.addGroup(cursor, g.index.count - cursor, 0);
    obj.material = materials;
  }
  function highlight(on) {
    const glow = on ? 0x397d95 : 0;
    if (scope.value === 'face') {
      if (!face) return;
      const {obj, key} = face;
      const {base, faces} = obj.userData;
      if (!faces.has(key)) {
        faces.set(key, base.clone());
        regroup(obj);
      }
      const mat = faces.get(key);
      mat.emissive.setHex(glow);
      if (!on && mat.color.equals(base.color)) {
        faces.delete(key);
        mat.dispose();
        regroup(obj);
      }
    } else
      for (const i of selected?.indices || []) {
        const {base, faces} = model.children[i].userData;
        base.emissive.setHex(glow);
        for (const mat of faces.values()) mat.emissive.setHex(glow);
      }
  }
  function updateEditor() {
    const single = scope.value === 'face';
    const available = !single || !!face;
    heading.textContent =
      single && !face
        ? t('请在模型上点选一个面', 'Pick a face on the model')
        : selected.button.textContent;
    color.disabled = reset.disabled = !available;
    if (available) {
      const mat = single
        ? face.obj.userData.faces.get(face.key)
        : model.children[selected.indices[0]].userData.base;
      color.value = '#' + mat.color.getHexString();
    }
  }
  let previousScope = scope.value;
  scope.onchange = () => {
    const next = scope.value;
    scope.value = previousScope;
    highlight(false);
    scope.value = previousScope = next;
    highlight(true);
    updateEditor();
    draw();
  };
  function select(part, hit) {
    if (!part) return;
    highlight(false);
    selected?.button.setAttribute('aria-pressed', 'false');
    selected = part;
    face = null;
    if (hit) {
      const ranges = hit.object.geometry.userData.faceRanges;
      for (let k = 0; k < ranges.length; k += 2)
        if (hit.faceIndex >= ranges[k] && hit.faceIndex <= ranges[k + 1]) {
          face = {obj: hit.object, key: k};
          break;
        }
    }
    highlight(true);
    draw();
    part.button.setAttribute('aria-pressed', 'true');
    updateEditor();
    editor.hidden = false;
    measure.selected();
    if (window.innerWidth < 640) items.closest('details').open = false;
  }
  function paint(hex) {
    if (scope.value === 'face') {
      if (!face) return false;
      const {base, faces} = face.obj.userData;
      const mat = faces.get(face.key);
      if (hex) mat.color.set(hex);
      else mat.color.copy(base.color);
    } else
      for (const i of selected.indices) {
        const obj = model.children[i],
          {base, faces} = obj.userData;
        for (const mat of faces.values()) mat.dispose();
        faces.clear();
        regroup(obj);
        if (hex) base.color.set(hex);
        else base.color.copy(originalColors[i]);
      }
    updateEditor();
    draw();
    return true;
  }
  color.oninput = () => paint(color.value);
  reset.onclick = () => paint(null);
  photoPicker(editor, t, signal, paint);
  function row(name, indices, leaf = false) {
    const entry = document.createElement('li');
    const line = document.createElement('div');
    line.className = 'partRow';
    const button = document.createElement('button');
    button.textContent = name;
    button.disabled = !indices.length;
    button.setAttribute('aria-pressed', 'false');
    const part = {button, indices};
    button.onclick = () => select(part);
    if (leaf) {
      const i = indices[0];
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.checked = true;
      check.setAttribute('aria-label', t('显示 ', 'Show ') + name);
      check.onchange = () => {
        model.children[i].visible = check.checked;
        draw();
      };
      line.append(check);
      parts.set(model.children[i], part);
    }
    line.append(button);
    entry.append(line);
    return entry;
  }
  function branch(node) {
    const indices = [...(node.meshes || [])];
    const list = document.createElement('ul');
    for (const i of node.meshes || [])
      list.append(
        row(meshes[i].name || t('实体 ', 'Solid ') + (i + 1), [i], true),
      );
    for (const child of node.children || []) {
      const nested = branch(child);
      for (const i of nested.indices) indices.push(i);
      list.append(nested.entry);
    }
    const entry = row(node.name || t('组件', 'Component'), indices);
    entry.append(list);
    return {entry, indices};
  }
  const tree = document.createElement('ul');
  tree.append(branch(root).entry);
  const panel = document.createElement('aside');
  panel.className = 'modelTools';
  view.append(panel);
  const measure = measurement({
    panel,
    model,
    scene,
    camera,
    canvas: renderer.domElement,
    circles,
    t,
    draw,
    signal,
    selection: () => selected,
  });
  panel.append(editor);
  items.append(tree);

  const canvas = renderer.domElement;
  const ray = new T.Raycaster();
  let press;
  const listener = {signal};
  canvas.addEventListener(
    'pointerdown',
    event => {
      press =
        event.button === 0 && event.isPrimary
          ? {x: event.clientX, y: event.clientY, id: event.pointerId}
          : null;
    },
    listener,
  );
  canvas.addEventListener(
    'pointermove',
    event => {
      if (
        press &&
        Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5
      )
        press = null;
    },
    listener,
  );
  canvas.addEventListener(
    'pointercancel',
    () => {
      press = null;
    },
    listener,
  );
  canvas.addEventListener(
    'pointerup',
    event => {
      if (press?.id !== event.pointerId) return;
      press = null;
      const rect = canvas.getBoundingClientRect();
      ray.setFromCamera(
        new T.Vector2(
          (2 * (event.clientX - rect.left)) / rect.width - 1,
          1 - (2 * (event.clientY - rect.top)) / rect.height,
        ),
        camera,
      );
      const hit = ray.intersectObjects(
        model.children.filter(obj => obj.visible),
        false,
      )[0];
      if (hit && !measure.pick(hit)) select(parts.get(hit.object), hit);
    },
    listener,
  );
  resize();
  fit();
  observer.observe(view);
  return {fit};
}
