import { useEffect, useRef } from 'react';

// Пирамида из 15 шаров на canvas. Курсор работает как кий:
// толкает шары, они сталкиваются друг с другом и отскакивают от краёв.
// Если шары никто не трогает несколько секунд - они плавно возвращаются в пирамиду.
const NUMBERS = [1, 9, 2, 10, 8, 3, 11, 7, 14, 4, 5, 13, 15, 6, 12];
const GOLD = 8; // шар с латунной заливкой
const IDLE_RETURN = 4000;

export default function BallRack() {
  const canvas = useRef(null);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext('2d');
    const css = getComputedStyle(cv);
    const LINE = css.getPropertyValue('--rack-line').trim() || '#c9b48c';
    const FILL = css.getPropertyValue('--rack-fill').trim() || '#b8945a';
    const BG = css.getPropertyValue('--rack-bg').trim() || '#f4efe6';

    let W = 0, H = 0, R = 22, dpr = 1;
    let balls = [];
    const cue = { x: -999, y: -999, vx: 0, vy: 0, px: 0, py: 0, active: false };
    let lastHit = 0;

    const layout = () => {
      const rect = cv.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width; H = rect.height;
      cv.width = W * dpr; cv.height = H * dpr;
      R = Math.max(14, Math.min(24, W / 44));
      const d = R * 2 + 1.5;
      const cx = W / 2;
      const top = H / 2 - (4 * d * Math.sin(Math.PI / 3)) / 2;
      const homes = [];
      for (let row = 0; row < 5; row++) {
        for (let k = 0; k <= row; k++) {
          homes.push({ x: cx + (k - row / 2) * d, y: top + row * d * Math.sin(Math.PI / 3) });
        }
      }
      const keep = balls.length === 15;
      balls = homes.map((h, i) => ({
        n: NUMBERS[i], hx: h.x, hy: h.y,
        x: keep ? balls[i].x : h.x, y: keep ? balls[i].y : h.y,
        vx: 0, vy: 0, rot: 0,
      }));
    };

    const drawBall = (b) => {
      const gold = b.n === GOLD;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fillStyle = gold ? FILL : BG; ctx.fill();
      ctx.lineWidth = 1.2; ctx.strokeStyle = LINE; ctx.stroke();
      // внутренний "бейдж" с номером, слегка смещается при вращении
      const ox = Math.cos(b.rot) * R * 0.18, oy = Math.sin(b.rot) * R * 0.18;
      ctx.beginPath(); ctx.arc(ox, oy, R * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = gold ? BG : LINE; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = gold ? BG : LINE;
      ctx.font = `${Math.round(R * 0.6)}px "Ronsa", "Kornilow", Georgia, serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(b.n, ox, oy + 1);
      ctx.restore();
    };

    const step = (dt, now) => {
      const k = dt * 60; // нормировка под 60 fps
      const CR = R * 0.7; // радиус "кия"

      // удар курсором
      if (cue.active) {
        for (const b of balls) {
          const dx = b.x - cue.x, dy = b.y - cue.y;
          const dist = Math.hypot(dx, dy), min = R + CR;
          if (dist < min && dist > 0.01) {
            const nx = dx / dist, ny = dy / dist;
            b.x = cue.x + nx * min; b.y = cue.y + ny * min;
            const push = Math.max(2, (cue.vx * nx + cue.vy * ny));
            b.vx += nx * push * 0.9 + cue.vx * 0.15;
            b.vy += ny * push * 0.9 + cue.vy * 0.15;
            lastHit = now;
          }
        }
      }

      // столкновения шаров (равные массы, упругий удар)
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i], b = balls[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy), min = R * 2;
          if (dist < min && dist > 0.01) {
            const nx = dx / dist, ny = dy / dist;
            const overlap = (min - dist) / 2;
            a.x -= nx * overlap; a.y -= ny * overlap;
            b.x += nx * overlap; b.y += ny * overlap;
            const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (rel > 0) {
              const imp = rel * 0.94;
              a.vx -= imp * nx; a.vy -= imp * ny;
              b.vx += imp * nx; b.vy += imp * ny;
            }
          }
        }
      }

      const idle = now - lastHit > IDLE_RETURN;
      for (const b of balls) {
        if (idle) {
          // плавный возврат в пирамиду
          b.vx = (b.hx - b.x) * 0.06;
          b.vy = (b.hy - b.y) * 0.06;
        }
        b.x += b.vx * k; b.y += b.vy * k;
        const f = Math.pow(0.975, k);
        b.vx *= f; b.vy *= f;
        b.rot += (b.vx + b.vy) * 0.02 * k;
        if (b.x < R) { b.x = R; b.vx = Math.abs(b.vx) * 0.7; }
        if (b.x > W - R) { b.x = W - R; b.vx = -Math.abs(b.vx) * 0.7; }
        if (b.y < R) { b.y = R; b.vy = Math.abs(b.vy) * 0.7; }
        if (b.y > H - R) { b.y = H - R; b.vy = -Math.abs(b.vy) * 0.7; }
      }

      // скорость курсора затухает, если мышь стоит
      cue.vx *= 0.6; cue.vy *= 0.6;
    };

    let raf, last = performance.now(), visible = false;
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      step(dt, now);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      balls.forEach(drawBall);
    };

    const toLocal = (e) => {
      const r = cv.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e) => {
      const p = toLocal(e);
      if (!cue.active) { cue.px = p.x; cue.py = p.y; }
      cue.vx = Math.max(-40, Math.min(40, p.x - cue.px));
      cue.vy = Math.max(-40, Math.min(40, p.y - cue.py));
      cue.px = p.x; cue.py = p.y;
      cue.x = p.x; cue.y = p.y; cue.active = true;
    };
    const onLeave = () => { cue.active = false; cue.x = cue.y = -999; };
    // тап на мобильных: "взрыв" от точки касания
    const onDown = (e) => {
      if (e.pointerType === 'mouse') return;
      const p = toLocal(e);
      for (const b of balls) {
        const dx = b.x - p.x, dy = b.y - p.y;
        const d = Math.max(20, Math.hypot(dx, dy));
        const f = Math.min(18, 1600 / d);
        b.vx += (dx / d) * f; b.vy += (dy / d) * f;
      }
      lastHit = performance.now();
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(cv);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(cv);
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);
    cv.addEventListener('pointerdown', onDown);
    document.fonts?.ready.then(() => { last = performance.now(); });
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
      cv.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return <canvas className="rack" ref={canvas} aria-label="Пирамида бильярдных шаров - проведите курсором, чтобы разбить" />;
}
