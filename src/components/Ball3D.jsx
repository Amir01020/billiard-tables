import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Текстура шара: цветная полоса/заливка, белый круг со звездой
function ballTexture(color) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = color; g.fillRect(0, 0, 1024, 512);
  const drawBadge = (cx) => {
    g.fillStyle = '#f6f1e7';
    g.beginPath(); g.ellipse(cx, 256, 90, 105, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#121212';
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 26 : 62;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      g.lineTo(cx + Math.cos(a) * r, 256 + Math.sin(a) * r * 1.12);
    }
    g.closePath(); g.fill();
  };
  drawBadge(256); drawBadge(768);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export default function Ball3D({ color = '#0f4a37' }) {
  const mount = useRef(null);

  useEffect(() => {
    const el = mount.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 96, 96),
      new THREE.MeshPhysicalMaterial({ map: ballTexture(color), roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.06 }),
    );
    ball.rotation.set(0.25, -0.6, 0.12);
    scene.add(ball);

    scene.add(new THREE.HemisphereLight('#fff6e5', '#0b1f17', 1.1));
    const key = new THREE.DirectionalLight('#ffffff', 2.6); key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight('#c9a96e', 2.2); rim.position.set(-4, -1, -3); scene.add(rim);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);

    let visible = true;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(el);

    let raf, last = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!visible) return;
      ball.rotation.y += dt * 0.45;
      ball.rotation.x += (0.25 + mouse.y * 0.35 - ball.rotation.x) * 0.04;
      ball.position.x += (mouse.x * 0.25 - ball.position.x) * 0.04;
      ball.position.y = Math.sin(now / 900) * 0.06;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      window.removeEventListener('pointermove', onMove);
      ball.geometry.dispose(); ball.material.map.dispose(); ball.material.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [color]);

  return <div className="ball3d" ref={mount} />;
}
