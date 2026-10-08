import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';
import { site, hero } from '../data';

const MIN_TIME = 900;   // минимальное время показа, мс
const MAX_TIME = 3000;  // не дольше этого, даже если сеть медленная

// Ждём только то, что видно на первом экране: фото hero и шрифты
function loadCritical() {
  const img = new Promise((res) => {
    const i = new Image();
    i.onload = i.onerror = res;
    i.src = hero.photo;
  });
  const fonts = document.fonts?.ready ?? Promise.resolve();
  return Promise.all([img, fonts]);
}

export default function Preloader({ onDone }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const num = el.querySelector('.preloader__num');
    const bar = el.querySelector('.preloader__bar i');
    let loaded = false;
    let finished = false;
    const start = performance.now();
    const progress = { v: 0 };

    const ctx = gsap.context(() => {
      gsap.from('.preloader__word span', { yPercent: 120, duration: 1, ease: 'expo.out', stagger: 0.03 });
    }, el);

    loadCritical().then(() => { loaded = true; });

    const finish = () => {
      finished = true;
      ctx.add(() => {
        gsap.timeline({ onComplete: onDone })
          .to('.preloader__word span', { yPercent: -120, duration: 0.6, ease: 'expo.in', stagger: 0.015 })
          .to('.preloader__meta', { autoAlpha: 0, duration: 0.3 }, '<')
          .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.25');
      });
    };

    const tick = () => {
      if (finished) return;
      const t = performance.now() - start;
      const done = (loaded && t > MIN_TIME) || t > MAX_TIME;
      // пока грузится - плавно ползём к 90, после загрузки - быстро к 100
      const target = done ? 100 : Math.min(90, (t / MIN_TIME) * 90);
      progress.v += (target - progress.v) * (done ? 0.25 : 0.1);
      const v = Math.round(progress.v);
      num.textContent = v;
      bar.style.transform = `scaleX(${v / 100})`;
      if (done && v >= 99) {
        num.textContent = 100;
        bar.style.transform = 'scaleX(1)';
        finish();
      }
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      ctx.revert();
    };
  }, [onDone]);

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="preloader__word">
        {site.brand.split('').map((c, i) => <span key={i}>{c === ' ' ? ' ' : c}</span>)}
      </div>
      <div className="preloader__meta">
        <div className="preloader__bar"><i /></div>
        <span><b className="preloader__num">0</b>%</span>
      </div>
    </div>
  );
}
