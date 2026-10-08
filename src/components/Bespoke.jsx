import { useEffect, useRef } from 'react';
import { manifesto, universes, steps } from '../data';
import { gsap } from '../lib/motion';
import LineArt from './LineArt';
import BallRack from './BallRack';

/* ---------- Манифест + пирамида шаров ---------- */
export function Manifesto() {
  const text = useRef(null);
  useEffect(() => {
    const el = text.current;
    // слова проявляются по мере прокрутки
    el.innerHTML = manifesto.split(' ').map((w) => `<span class="w">${w}</span>`).join(' ');
    const ctx = gsap.context(() => {
      gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.14 }, {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="manifesto">
      <div className="manifesto__rings" aria-hidden="true"><i /><i /><i /></div>
      <span className="manifesto__tick" aria-hidden="true" />
      <div className="wrap">
        <p className="manifesto__text" ref={text}>{manifesto}</p>
      </div>
      <div className="manifesto__rack">
        <BallRack />
        <span className="manifesto__hint">Проведите курсором, чтобы разбить</span>
      </div>
    </section>
  );
}

/* ---------- Сетка коллекций ---------- */
function Cta({ children }) {
  return (
    <span className="cta">
      <span className="cta__inner">
        <span className="cta__text">{children}</span>
        <span className="cta__text cta__text--2" aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

export function Universes() {
  return (
    <section className="section universes" id="universes">
      <div className="wrap">
        <div className="head head--center">
          <span className="kicker js-fade">Что мы создаём на заказ</span>
          <h2 className="title js-lines">Каждый стол —<br /><em>единственный</em></h2>
        </div>
        <ul className="grid js-stagger">
          {universes.map((u) => (
            <li key={u.title} className="grid__item" data-cursor="view">
              <a href="#order">
                <div className="grid__img"><img src={u.img} alt={u.title} loading="lazy" draggable="false" /></div>
                <div className="grid__bg"><LineArt name={u.art} /></div>
                <h3 className="grid__title">{u.title}</h3>
                <Cta>Заказать</Cta>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Процесс: горизонтальный скролл с закреплением ---------- */
export function Process() {
  const root = useRef(null);
  useEffect(() => {
    const el = root.current;
    const track = el.querySelector('.process__track');
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const dist = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top top', end: () => '+=' + dist(),
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
      gsap.to(el.querySelector('.process__progress i'), {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: () => '+=' + dist(), scrub: true },
      });
      // лёгкий параллакс фото внутри карточек
      el.querySelectorAll('.step__img img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="process" id="process" ref={root}>
      <div className="process__track">
        <div className="process__intro">
          <span className="kicker">Индивидуальный заказ</span>
          <h2 className="title">Как рождается<br /><em>ваш стол</em></h2>
          <p>Пять этапов от первой встречи до первой партии. На каждом из них вы знаете, что происходит с вашим столом.</p>
        </div>
        {steps.map((s, i) => (
          <article className="step" key={s.title}>
            <div className="step__img"><img src={s.img} alt="" loading="lazy" /></div>
            <span className="step__num">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
        <div className="process__end">
          <a href="#order" className="btn">Обсудить мой проект</a>
        </div>
      </div>
      <div className="process__progress"><i /></div>
    </section>
  );
}
