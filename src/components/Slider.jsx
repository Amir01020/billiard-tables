import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/motion';

export function Arrows({ onPrev, onNext, index, total }) {
  return (
    <div className="arrows">
      {total != null && <span className="arrows__count">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>}
      <button onClick={onPrev} aria-label="Назад"><svg viewBox="0 0 24 24"><path d="M20 12H5m6-6-6 6 6 6" /></svg></button>
      <button onClick={onNext} aria-label="Вперёд"><svg viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg></button>
    </div>
  );
}

// Горизонтальный слайдер с перетаскиванием и инерцией
export default function Slider({ children, className = '', head }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const state = useRef({ x: 0, max: 0, step: 0 });

  useEffect(() => {
    const el = track.current;
    const s = state.current;
    const measure = () => {
      const first = el.children[0];
      if (!first) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      s.step = first.offsetWidth + gap;
      s.max = Math.max(0, el.scrollWidth - el.parentElement.offsetWidth);
      go(s.x);
    };
    const go = (x, dur = 0.9) => {
      s.x = Math.max(-s.max, Math.min(0, x));
      gsap.to(el, { x: s.x, duration: dur, ease: 'expo.out', overwrite: true });
      setIndex(Math.round(-s.x / (s.step || 1)));
    };
    s.go = go;

    let startX = 0, startPos = 0, lastX = 0, vel = 0, down = false, moved = false;
    const onDown = (e) => { down = true; moved = false; startX = lastX = e.clientX; startPos = s.x; vel = 0; el.classList.add('is-drag'); };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      vel = e.clientX - lastX; lastX = e.clientX;
      const x = startPos + dx;
      gsap.set(el, { x: x > 0 ? x * 0.3 : x < -s.max ? -s.max + (x + s.max) * 0.3 : x });
    };
    const onUp = (e) => {
      if (!down) return;
      down = false; el.classList.remove('is-drag');
      const target = startPos + (e.clientX - startX) + vel * 12;
      go(s.step ? Math.round(target / s.step) * s.step : target);
    };
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const total = Array.isArray(children) ? children.length : 1;
  const arrows = (
    <Arrows
      index={index}
      total={total}
      onPrev={() => state.current.go(state.current.x + state.current.step)}
      onNext={() => state.current.go(state.current.x - state.current.step)}
    />
  );

  return (
    <div className={`slider ${className}`}>
      {head && head(arrows)}
      <div className="slider__viewport">
        <div className="slider__track" ref={track}>{children}</div>
      </div>
    </div>
  );
}
