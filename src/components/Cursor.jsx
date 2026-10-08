import { useEffect, useRef } from 'react';
import { gsap } from '../lib/motion';

// Кастомный курсор: точка + кольцо, увеличивается над ссылками и слайдерами
export default function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const el = ref.current;
    el.style.display = 'block';
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });
    const onMove = (e) => {
      xTo(e.clientX); yTo(e.clientY);
      const t = e.target;
      const view = !!t.closest('[data-cursor="view"]');
      el.classList.toggle('is-view', view);
      el.classList.toggle('is-link', !view && !!t.closest('a, button'));
      el.classList.toggle('is-drag', !!t.closest('.slider__track'));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return (
    <div className="cursor" ref={ref}>
      <span>Тяните</span>
      <svg viewBox="0 0 61 61" fill="none" aria-hidden="true">
        <path d="M30.5 21.5c-10 0-14 9-14 9s4 9 14 9 14-9 14-9-4-9-14-9Z" />
        <circle cx="30.5" cy="30.5" r="5" />
      </svg>
    </div>
  );
}
