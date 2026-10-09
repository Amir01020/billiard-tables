import { useEffect, useRef } from 'react';
import { gsap } from './motion';

/**
 * Смена слайдов "шторкой" для стопки картинок внутри ref:
 * - новый слайд раскрывается поверх предыдущего (вперёд - справа, назад - слева);
 * - предыдущий остаётся видимым под ним до конца анимации;
 * - остальные скрыты, поэтому под шторкой не мелькают чужие кадры;
 * - незавершённые анимации прерываются - быстрые клики не ломают картинку.
 * Слайды - прямые дети ref (img или figure с img внутри).
 */
export default function useSlideReveal(ref, index) {
  const prev = useRef(index);

  useEffect(() => {
    const items = [...ref.current.children].filter((el) => el.matches('img, figure'));
    const n = items.length;
    const from = prev.current;
    prev.current = index;

    // направление с учётом перехода по кругу
    let dir = index > from ? 1 : -1;
    if (from === n - 1 && index === 0) dir = 1;
    if (from === 0 && index === n - 1 && n > 2) dir = -1;

    items.forEach((el, k) => {
      const img = el.tagName === 'IMG' ? el : el.querySelector('img');
      gsap.killTweensOf([el, img]);
      if (k === index) {
        gsap.set(el, { zIndex: 3, visibility: 'visible' });
        if (from === index) {
          gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' });
          gsap.set(img, { scale: 1 });
        } else {
          gsap.fromTo(el,
            { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' });
          gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: 'expo.out' });
        }
      } else if (k === from) {
        gsap.set(el, { zIndex: 2, visibility: 'visible', clipPath: 'inset(0% 0% 0% 0%)' });
        gsap.set(img, { scale: 1 });
      } else {
        gsap.set(el, { zIndex: 1, visibility: 'hidden' });
      }
    });
  }, [ref, index]);
}
