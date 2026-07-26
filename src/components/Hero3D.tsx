import {useEffect, useRef} from 'react';
import type {ReactElement} from 'react';
import type {BufferGeometry, Vector3} from 'three';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './Hero3D.module.css';

/**
 * 主页 hero 动画：缓慢自转的点阵地球（暖橙陆地点 + 极淡经纬网 + 星空）。
 * - 大陆轮廓由陆地/海洋掩膜图（/img/earth-mask.jpg）决定，运行时用 canvas 解码取样；
 *   图片作为静态资源单独加载，可被浏览器独立缓存，不拖累首页 JS 体积。
 * - 颜色取自网站主色，与暖深色背景协调；保留拖拽、朝向光标、悬停放大等交互。
 * - 使用动态 import('three')，避免 Docusaurus 预渲染（SSR）时触碰 WebGL API。
 * - 仅在进入视口时运行动画，离开时暂停以节省 GPU；并尊重 prefers-reduced-motion。
 */
export default function Hero3D(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);
  const maskUrl = useBaseUrl('/img/earth-mask.jpg');

  useEffect(() => {
    let cleanup = () => {};
    let frame = 0;
    let io: IntersectionObserver | undefined;

    (async () => {
      const THREE = await import('three');
      const mount = mountRef.current;
      if (!mount) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      // 大气辉光色（暖橙），与站点主色协调
      const PRIMARY_SOFT = 0xf6c6a2;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 3.4;

      const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);

      const R = 1.25;

      // 星球组（真实地球轴倾角约 23.5°）
      const globe = new THREE.Group();
      globe.rotation.z = 0.41;
      scene.add(globe);

      const disposables: Array<{dispose: () => void}> = [];

      // 0) 与背景同色的实体核：遮挡背面点阵，只显示正面陆地，更像真实地球
      //    （颜色等于页面背景，不会形成暗色"阴影"圆盘）
      const coreGeo = new THREE.SphereGeometry(R * 0.99, 48, 48);
      const coreMat = new THREE.MeshBasicMaterial({color: 0x1a1917});
      globe.add(new THREE.Mesh(coreGeo, coreMat));
      disposables.push(coreGeo, coreMat);

      // 1) 点阵地球：用真实地球贴图做陆地掩膜，只在陆地上撒暖色点，
      //    海洋留空——一眼可辨是地球，且点正确投影在球面上（无贴图扭曲）。
      // 读取地球贴图像素，用于判断某经纬度的点是否在陆地
      const img = new Image();
      img.src = maskUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('earth map load failed'));
      });
      const maskCanvas = document.createElement('canvas');
      maskCanvas.width = img.width;
      maskCanvas.height = img.height;
      const mctx = maskCanvas.getContext('2d')!;
      mctx.drawImage(img, 0, 0);
      const maskData = mctx.getImageData(0, 0, img.width, img.height).data;
      const isLand = (lon: number, lat: number): boolean => {
        const u = (lon + Math.PI) / (2 * Math.PI);
        const v = (Math.PI / 2 - lat) / Math.PI;
        const px = Math.min(
          img.width - 1,
          Math.max(0, Math.floor(u * img.width)),
        );
        const py = Math.min(
          img.height - 1,
          Math.max(0, Math.floor(v * img.height)),
        );
        const idx = (py * img.width + px) * 4;
        const r = maskData[idx];
        const g = maskData[idx + 1];
        const b = maskData[idx + 2];
        // 海洋偏蓝（b 高于 r）；陆地/冰盖偏暖或近白
        return b < r || (r > 200 && g > 200 && b > 200);
      };

      // Fibonacci 均匀分布采样，仅保留陆地上的点
      const N = 4200;
      const landPts: number[] = [];
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2;
        const ring = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = golden * i;
        const x = Math.cos(theta) * ring;
        const z = Math.sin(theta) * ring;
        const lat = Math.asin(y);
        const lon = Math.atan2(z, x);
        if (isLand(lon, lat)) {
          landPts.push(x * R, y * R, z * R);
        }
      }
      const dotGeo = new THREE.BufferGeometry();
      dotGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(landPts), 3),
      );
      const dotMat = new THREE.PointsMaterial({
        color: PRIMARY_SOFT,
        size: 0.03,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
      });
      globe.add(new THREE.Points(dotGeo, dotMat));
      disposables.push(dotGeo, dotMat);

      // 2) 极淡的经纬线，作为"经纬网"衬托，不抢点阵风头
      const lineMat = new THREE.LineBasicMaterial({
        color: PRIMARY_SOFT,
        transparent: true,
        opacity: 0.12,
      });
      disposables.push(lineMat);

      const buildLine = (
        fn: (t: number) => Vector3,
        seg = 96,
      ): BufferGeometry => {
        const pts: Vector3[] = [];
        for (let j = 0; j <= seg; j++) {
          pts.push(fn(j / seg));
        }
        return new THREE.BufferGeometry().setFromPoints(pts);
      };

      // 纬线（latitude circles）
      const latCount = 7;
      for (let i = 1; i < latCount; i++) {
        const lat = (i / latCount) * Math.PI - Math.PI / 2;
        const y = R * Math.sin(lat);
        const rad = R * Math.cos(lat);
        const geo = buildLine(t => {
          const a = t * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * rad, y, Math.sin(a) * rad);
        });
        globe.add(new THREE.Line(geo, lineMat));
        disposables.push(geo);
      }

      // 经线（meridians）
      const lonCount = 12;
      for (let i = 0; i < lonCount; i++) {
        const lon = (i / lonCount) * Math.PI * 2;
        const geo = buildLine(t => {
          const a = -Math.PI / 2 + t * Math.PI;
          const y = R * Math.sin(a);
          const rad = R * Math.cos(a);
          return new THREE.Vector3(Math.cos(lon) * rad, y, Math.sin(lon) * rad);
        });
        globe.add(new THREE.Line(geo, lineMat));
        disposables.push(geo);
      }

      // 3) 淡星空背景（暖白），衬托"宇宙"氛围
      const sCount = 140;
      const sPos = new Float32Array(sCount * 3);
      for (let i = 0; i < sCount; i++) {
        const r = 6 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        sPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        sPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        sPos[i * 3 + 2] = r * Math.cos(phi);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xf6d9c2,
        size: 0.045,
        transparent: true,
        opacity: 0.45,
      });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
      disposables.push(starGeo, starMat);

      // —— 鼠标交互 ——
      // mx/my：指针相对容器中心的归一化坐标（-0.5 ~ 0.5），用于视差与朝向
      let mx = 0;
      let my = 0;
      // 拖拽状态
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      // 是否悬停在球体上
      let hovering = false;

      const onMove = (e: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        mx = (e.clientX - rect.left) / rect.width - 0.5;
        my = (e.clientY - rect.top) / rect.height - 0.5;
        if (dragging) {
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
          globe.rotation.y += dx * 0.01; // 拖拽水平转动
          globe.rotation.x += dy * 0.01; // 拖拽上下翻转
          globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x));
        }
      };
      const onDown = (e: PointerEvent) => {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        mount.style.cursor = 'grabbing';
      };
      const onUp = () => {
        dragging = false;
        mount.style.cursor = 'grab';
      };
      const onEnter = () => {
        hovering = true;
      };
      const onLeave = () => {
        hovering = false;
      };

      mount.addEventListener('pointermove', onMove);
      mount.addEventListener('pointerdown', onDown);
      window.addEventListener('pointerup', onUp);
      mount.addEventListener('pointerenter', onEnter);
      mount.addEventListener('pointerleave', onLeave);

      const animate = () => {
        frame = requestAnimationFrame(animate);
        // 未拖拽时缓慢自转；拖拽时以用户操作为主
        if (!dragging) {
          globe.rotation.y += 0.0016;
        }
        // 悬停时球体微微朝光标方向倾斜，像"看向"光标
        const targetX = dragging ? globe.rotation.x : my * 0.5;
        globe.rotation.x += (targetX - globe.rotation.x) * 0.06;
        // 悬停轻微放大
        const targetScale = hovering ? 1.06 : 1.0;
        const s = globe.scale.x + (targetScale - globe.scale.x) * 0.08;
        globe.scale.set(s, s, s);
        stars.rotation.y -= 0.0004;
        // 相机视差
        camera.position.x += (mx * 0.6 - camera.position.x) * 0.05;
        camera.position.y += (-my * 0.6 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };

      // 尊重"减少动态效果"偏好：静止用户只看到一帧静态地球，不做自转
      const prefersReduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // 至少渲染一帧，保证暂停/减弱动画时也能看到地球
      camera.lookAt(scene.position);
      renderer.render(scene, camera);

      let running = false;
      const startLoop = () => {
        if (running || prefersReduced) return;
        running = true;
        frame = requestAnimationFrame(animate);
      };
      const stopLoop = () => {
        if (!running) return;
        running = false;
        cancelAnimationFrame(frame);
      };

      if (!prefersReduced) {
        // 仅在 hero 进入视口时运行动画，滚出视口即暂停，避免持续占用 GPU
        if (typeof IntersectionObserver === 'function') {
          io = new IntersectionObserver(
            entries => {
              const entry = entries[0];
              if (entry && entry.isIntersecting) {
                startLoop();
              } else {
                stopLoop();
              }
            },
            {threshold: 0},
          );
          io.observe(mount);
        } else {
          startLoop();
        }
      }

      const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        stopLoop();
        cancelAnimationFrame(frame);
        io?.disconnect();
        mount.removeEventListener('pointermove', onMove);
        mount.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointerup', onUp);
        mount.removeEventListener('pointerenter', onEnter);
        mount.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        disposables.forEach(d => d.dispose());
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    })();

    return () => cleanup();
  }, [maskUrl]);

  return (
    <div className={styles.hero3d}>
      <div ref={mountRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.brandMark}>
        <span className={styles.brandName}>VanSail</span>
        <span className={styles.brandLine} />
      </div>
    </div>
  );
}
