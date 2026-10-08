import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

let lenis;
export const getLenis = () => lenis;

// Плавный скролл (Lenis) + синхронизация с ScrollTrigger
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
  lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  lenis.stop(); // запускается после прелоадера

  // якорные ссылки
  const onClick = (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: -70 });
  };
  document.addEventListener('click', onClick);

  return () => {
    document.removeEventListener('click', onClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  };
}

// Разбивка заголовка на строки-маски для анимации появления
export function splitLines(el) {
  if (el.dataset.split) return el.querySelectorAll('.line__in');
  el.dataset.split = '1';
  const lines = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = lines.map((l) => `<span class="line"><span class="line__in">${l}</span></span>`).join('');
  return el.querySelectorAll('.line__in');
}

// Анимации при скролле - декларативно через data-атрибуты
export function initScrollAnimations(root = document) {
  const ctx = gsap.context(() => {
    root.querySelectorAll('.js-lines').forEach((el) => {
      const lines = splitLines(el);
      gsap.from(lines, {
        yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    root.querySelectorAll('.js-fade').forEach((el) => {
      gsap.from(el, {
        y: 40, autoAlpha: 0, duration: 1.1, ease: 'power3.out', delay: +(el.dataset.delay || 0),
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });

    root.querySelectorAll('.js-stagger').forEach((el) => {
      gsap.from(el.children, {
        y: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Раскрытие изображения шторкой + лёгкий зум
    root.querySelectorAll('.js-reveal-img').forEach((el) => {
      const img = el.querySelector('img');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
      tl.fromTo(el, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' });
      if (img) tl.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0);
    });

    // Параллакс
    root.querySelectorAll('[data-parallax]').forEach((el) => {
      const amt = parseFloat(el.dataset.parallax) || 12;
      gsap.fromTo(el, { yPercent: -amt }, {
        yPercent: amt, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    // Счётчики
    root.querySelectorAll('[data-count]').forEach((el) => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: +el.dataset.count, duration: 2.2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
        onUpdate: () => { el.textContent = Math.round(obj.v); },
      });
    });
  }, root);
  return () => ctx.revert();
}

export { gsap, ScrollTrigger };
