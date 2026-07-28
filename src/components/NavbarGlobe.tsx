import {useEffect, useRef} from 'react';
import type {ReactElement} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './NavbarGlobe.module.css';

/**
 * 导航栏中心微型自转地球——仅陆地暖色点阵 + 极简经纬线，
 * 无拖拽、无标语、无星空，适配导航栏高度。
 */
export default function NavbarGlobe(): ReactElement {
  const mountRef = useRef<HTMLDivElement>(null);
  const maskUrl = useBaseUrl('/img/earth-mask.jpg');

  useEffect(() => {
    let frame = 0;
    let cleanup = () => {};

    (async () => {
      const THREE = await import('three');
      const mount = mountRef.current;
      if (!mount) return;

      const w = mount.clientWidth || 40;
      const h = mount.clientHeight || 40;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.z = 3.2;

      const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      mount.appendChild(renderer.domElement);

      const R = 1.25;
      const globe = new THREE.Group();
      globe.rotation.z = 0.41;
      scene.add(globe);

      const disposables: Array<{dispose: () => void}> = [];

      // 实体核遮挡背面
      const coreGeo = new THREE.SphereGeometry(R * 0.99, 32, 32);
      const coreMat = new THREE.MeshBasicMaterial({color: 0x1a1917});
      globe.add(new THREE.Mesh(coreGeo, coreMat));
      disposables.push(coreGeo, coreMat);

      // 陆地掩膜
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
        return (
          maskData[idx + 2] < maskData[idx] ||
          (maskData[idx] > 200 &&
            maskData[idx + 1] > 200 &&
            maskData[idx + 2] > 200)
        );
      };

      const N = 1800;
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
        color: 0xf6c6a2,
        size: 0.04,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: true,
      });
      globe.add(new THREE.Points(dotGeo, dotMat));
      disposables.push(dotGeo, dotMat);

      // 极简经纬线
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xf6c6a2,
        transparent: true,
        opacity: 0.1,
      });
      disposables.push(lineMat);

      const buildLine = (
        fn: (_: number) => THREE.Vector3,
        seg = 48,
      ): THREE.BufferGeometry => {
        const pts: THREE.Vector3[] = [];
        for (let j = 0; j <= seg; j++) pts.push(fn(j / seg));
        return new THREE.BufferGeometry().setFromPoints(pts);
      };
      for (let i = 1; i < 5; i++) {
        const lat = (i / 5) * Math.PI - Math.PI / 2;
        const y = R * Math.sin(lat);
        const rad = R * Math.cos(lat);
        const geo = buildLine(t => {
          const a = t * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * rad, y, Math.sin(a) * rad);
        });
        globe.add(new THREE.Line(geo, lineMat));
        disposables.push(geo);
      }
      for (let i = 0; i < 8; i++) {
        const lon = (i / 8) * Math.PI * 2;
        const geo = buildLine(t => {
          const a = -Math.PI / 2 + t * Math.PI;
          const y = R * Math.sin(a);
          const rad = R * Math.cos(a);
          return new THREE.Vector3(Math.cos(lon) * rad, y, Math.sin(lon) * rad);
        });
        globe.add(new THREE.Line(geo, lineMat));
        disposables.push(geo);
      }

      const animate = () => {
        frame = requestAnimationFrame(animate);
        globe.rotation.y += 0.003;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
      };

      const prefersReduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);

      if (!prefersReduced) {
        frame = requestAnimationFrame(animate);
      }

      const onResize = () => {
        const nw = mount.clientWidth || 40;
        const nh = mount.clientHeight || 40;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(frame);
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

  return <div ref={mountRef} className={styles.globe} aria-hidden="true" />;
}
