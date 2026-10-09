import { useEffect, useRef, useState } from 'react';
import { hero, assembly, products, bespoke, projects, faq, service, site } from '../data';
import { gsap, splitLines } from '../lib/motion';
import { useLeadForm } from '../lib/form';
import { Field, PhoneInput, FormMeta, FormStatus } from './ui';
import Slider, { Arrows } from './Slider';
import useSlideReveal from '../lib/useSlideReveal';

export const fmt = (n) => (n ? 'от ' + n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' сум' : 'Цена по запросу');

export function Link({ href = '#order', children, light, onClick }) {
  return (
    <a href={href} onClick={onClick} className={`clink${light ? ' clink--light' : ''}`}>
      <span>{children}</span>
      <svg viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>
    </a>
  );
}

/* ---------- Hero ---------- */
export function Hero({ ready }) {
  const root = useRef(null);
  useEffect(() => {
    const el = root.current;
    const lines = splitLines(el.querySelector('.hero__title'));
    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 110 });
      gsap.set('.hero__fade', { autoAlpha: 0, y: 30 });
      gsap.set('.hero__media img', { scale: 1.25 });
      // параллакс фона при скролле
      gsap.to('.hero__media', {
        yPercent: 25, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = root.current;
    const tl = gsap.timeline()
      .to(el.querySelector('.hero__media img'), { scale: 1, duration: 2.4, ease: 'expo.out' })
      .to(el.querySelectorAll('.line__in'), { yPercent: 0, duration: 1.4, ease: 'expo.out', stagger: 0.1 }, 0.15)
      .to(el.querySelectorAll('.hero__fade'), { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, 0.4);
    return () => tl.progress(1).kill();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__media"><img src={hero.photo} alt="Бильярдный стол Billiard Stars" fetchpriority="high" /></div>
      <div className="hero__shade" />
      <div className="hero__content">
        <p className="hero__subtitle hero__fade">{hero.subtitle}</p>
        <h1 className="hero__title"><em>{hero.title[0]}</em><br /><em>{hero.title[1]}</em></h1>
        <p className="hero__text hero__fade">{hero.text}</p>
        <div className="hero__fade hero__links">
          <Link href="#/builder" light>Собрать свой стол</Link>
          <Link href="#tables" light>Готовые модели</Link>
        </div>
      </div>
      <div className="hero__scroll hero__fade"><span>Листайте</span><i /></div>
    </section>
  );
}

/* ---------- Процесс сборки: слайдер с автопереключением ---------- */
// Слайды листаются сами только пока секция на экране.
// Когда клиент уходит с секции - слайдер возвращается к первому слайду.
export function Assembly() {
  const { stages, stats } = assembly;
  const total = stages.length + 1; // + слайд с цифрами
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const root = useRef(null);
  const media = useRef(null);
  const isStats = i === stages.length;
  const go = (d) => setI((v) => (v + d + total) % total);

  useSlideReveal(media, i);

  // следим, видна ли секция
  useEffect(() => {
    const io = new IntersectionObserver(([en]) => {
      setInView(en.isIntersecting);
      if (!en.isIntersecting) setI(0);
    }, { threshold: 0.35 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // автопереключение (ручное переключение перезапускает таймер)
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => go(1), assembly.interval);
    return () => clearTimeout(t);
  }, [i, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  // появление текста и счётчики
  useEffect(() => {
    const el = root.current;
    const ctx = gsap.context(() => {
      gsap.fromTo('.assembly__slide > *', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07 });
      el.querySelectorAll('[data-to]').forEach((n) => {
        const o = { v: 0 };
        gsap.to(o, { v: +n.dataset.to, duration: 1.6, ease: 'power2.out', onUpdate: () => { n.textContent = Math.round(o.v); } });
      });
    }, el);
    return () => ctx.revert();
  }, [i]);

  const photos = [...stages.map((s) => s.img || assembly.photo), assembly.statsPhoto];

  return (
    <section className="section assembly" id="assembly" ref={root}>
      <div className="wrap">
        <div className="head head--row">
          <h2 className="title js-lines">{assembly.title}</h2>
          <Arrows index={i} total={total} onGo={setI} onPrev={() => go(-1)} onNext={() => go(1)} />
        </div>
        <div className="assembly__grid">
          <div className="assembly__media">
            <div className="assembly__stage" ref={media}>
              {photos.map((src, k) => (
                <figure key={k} className="assembly__img"><img src={src} alt="" loading="lazy" /></figure>
              ))}
            </div>
            {inView && <span className="assembly__timer" key={i} style={{ animationDuration: `${assembly.interval}ms` }} />}
          </div>
          <div className="assembly__body">
            {!isStats ? (
              <div className="assembly__slide" key={i}>
                <span className="assembly__num">{String(i + 1).padStart(2, '0')}<small> / {String(stages.length).padStart(2, '0')}</small></span>
                <h3>{stages[i].title}</h3>
                <p>{stages[i].text}</p>
              </div>
            ) : (
              <div className="assembly__slide" key="stats">
                <h3>{assembly.statsTitle}</h3>
                <div className="stats">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <b><span data-to={s.value}>0</span>{s.suffix}</b>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <Link href="#/builder">Собрать свой стол</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Столы (слайдер) ---------- */
export function Tables({ title = 'Готовые модели', exclude }) {
  const list = products.filter((p) => p.id !== exclude);
  return (
    <section className="section tables" id="tables">
      <div className="wrap">
        <Slider
          head={(arrows) => (
            <div className="head head--row">
              <h2 className="title js-lines">{title}</h2>
              {arrows}
            </div>
          )}
        >
          {list.map((p) => (
            <a href={`#/table/${p.id}`} className="pcard" key={p.id} draggable="false">
              <div className="pcard__img"><img src={p.img} alt={p.name} loading="lazy" draggable="false" /></div>
              <div className="pcard__body">
                <div>
                  <h3>{p.name}</h3>
                  <span className="pcard__type">{p.type}</span>
                </div>
                <span className="pcard__price">{fmt(p.price)}</span>
              </div>
              <span className="pcard__btn">Подробнее</span>
            </a>
          ))}
        </Slider>
      </div>
    </section>
  );
}

/* ---------- Стол только для вас ---------- */
export function Bespoke() {
  const [i, setI] = useState(0);
  const n = bespoke.slides.length;
  const stage = useRef(null);
  const go = (d) => setI((v) => (v + d + n) % n);

  useSlideReveal(stage, i);

  return (
    <section className="section bespoke" id="bespoke">
      <div className="wrap bespoke__grid">
        <div className="bespoke__body">
          <h2 className="title js-lines"><em>Стол</em><br />только для вас</h2>
          <p className="js-fade">{bespoke.text}</p>
          <div className="js-fade"><Link href="#/builder" light>Собрать свой стол</Link></div>
        </div>
        <div className="bespoke__slider js-fade">
          <div className="bespoke__stage" ref={stage}>
            {bespoke.slides.map((s) => <img key={s.label} src={s.img} alt={s.label} loading="lazy" />)}
          </div>
          <div className="bespoke__foot">
            <span className="bespoke__label" key={i}>{bespoke.slides[i].label}</span>
            <Arrows index={i} total={n} onGo={setI} onPrev={() => go(-1)} onNext={() => go(1)} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Проекты ---------- */
export function Projects() {
  return (
    <section className="section projects" id="projects">
      <div className="wrap">
        <Slider
          className="slider--projects"
          head={(arrows) => (
            <div className="head head--row">
              <h2 className="title js-lines">Они нам доверились</h2>
              {arrows}
            </div>
          )}
        >
          {projects.map((p) => (
            <a href="#order" className="prcard" key={p.title}>
              <div className="prcard__img"><img src={p.img} alt={p.title} loading="lazy" draggable="false" /></div>
              <span className="prcard__tag">{p.sector}</span>
              <h3>{p.title}</h3>
            </a>
          ))}
        </Slider>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  const body = useRef(null);
  useEffect(() => {
    gsap.to(body.current, { height: open ? 'auto' : 0, duration: 0.7, ease: 'expo.out' });
  }, [open]);
  return (
    <div className={`faq__item${open ? ' is-open' : ''}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open}>
        <span>{q}</span><i />
      </button>
      <div className="faq__a" ref={body}><p>{a}</p></div>
    </div>
  );
}

export function Faq() {
  return (
    <section className="section faq" id="faq">
      <div className="wrap faq__grid">
        <div>
          <h2 className="title js-lines">Важно знать</h2>
        </div>
        <div className="js-stagger">
          {faq.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Сервис ---------- */
export function Service() {
  return (
    <section className="section service">
      <div className="wrap service__grid">
        {service.map((s) => (
          <article key={s.title} className="service__item">
            <figure className="js-reveal-img"><img src={s.img} alt="" loading="lazy" data-parallax="8" /></figure>
            <h3 className="js-fade">{s.title}</h3>
            <p className="js-fade">{s.text}</p>
          </article>
        ))}
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>Billiard Stars <i>✦</i> Столы на заказ <i>✦</i> Ручная работа <i>✦</i> Billiard Stars <i>✦</i> Столы на заказ <i>✦</i> Ручная работа <i>✦</i>&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Консультация ---------- */
export function Order() {
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone']);
  return (
    <section className="section order" id="order">
      <div className="wrap order__grid">
        <div>
          <h2 className="title js-lines">Консультация</h2>
          <p className="js-fade">Оставьте контакты — консультант свяжется с вами, ответит на вопросы и пригласит в шоурум.</p>
        </div>
        <form className="form js-fade" onSubmit={onSubmit} noValidate>
          <FormMeta source="Консультация" />
          <Field label="Ваше имя" error={errors.name}><input name="name" type="text" autoComplete="name" /></Field>
          <Field label="Телефон" error={errors.phone}><PhoneInput /></Field>
          <button className="btn" disabled={sending}>Получить консультацию</button>
          <FormStatus status={status} />
        </form>
      </div>
    </section>
  );
}

// Форма в модальном окне. hidden - скрытые поля (model, config), которые уйдут в бота
export function ModalForm({ source, hidden = {}, button = 'Отправить', onDone }) {
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone'], {
    onSuccess: () => setTimeout(onDone, 1800),
  });
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <FormMeta source={source} />
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <Field label="Ваше имя" error={errors.name}><input name="name" type="text" autoComplete="name" /></Field>
      <Field label="Телефон" error={errors.phone}><PhoneInput /></Field>
      <button className="btn" disabled={sending}>{button}</button>
      <FormStatus status={status} />
    </form>
  );
}

/* ---------- Футер ---------- */
// Надпись бренда подгоняется под ширину футера при любом размере экрана
function FitText({ className, children }) {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current;
    const span = el.firstChild;
    const fit = () => {
      span.style.fontSize = '100px';
      const w = span.getBoundingClientRect().width;
      if (w) span.style.fontSize = `${(100 * el.clientWidth) / w}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div className={className} ref={box}><span>{children}</span></div>;
}

// "Разработано в Kelyan Media"; при наведении - "с любовью" и сердце
function Credit() {
  return (
    <div className="credit" role="group" tabIndex={0} aria-label="Разработано в Kelyan Media">
      <span className="credit__text">
        <span>Разработано в</span>
        <span aria-hidden="true">с любовью</span>
      </span>
      <span className="credit__icon" aria-hidden="true">
        <img src="brand/kelyan-media.png" alt="" width="30" height="33" loading="lazy" />
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54Z" /></svg>
      </span>
    </div>
  );
}

export function Footer() {
  const { contacts } = site;
  return (
    <footer className="footer" id="contacts">
      <div className="wrap">
        <div className="footer__cols">
          <div>
            <h4>Навигация</h4>
            {site.nav.map((n) => <a key={n.href} href={n.href} className="ulink">{n.label}</a>)}
          </div>
          <div>
            <h4>Шоурум</h4>
            <p>{contacts.address}<br />{contacts.hours}</p>
          </div>
          <div>
            <h4>Контакты</h4>
            {contacts.phones.map((p) => <a key={p} href={`tel:${p.replace(/[^\d+]/g, '')}`} className="ulink">{p}</a>)}
            <a href={`mailto:${contacts.email}`} className="ulink">{contacts.email}</a>
          </div>
          <div>
            <h4>Мы в сети</h4>
            {contacts.socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="ulink">{s.label}</a>)}
          </div>
        </div>
        <FitText className="footer__brand">Billiard <i>Stars</i></FitText>
        <div className="footer__legal">
          <span>&copy; {new Date().getFullYear()} {site.brand}. Все права защищены.</span>
          <span>Политика конфиденциальности</span>
          <Credit />
        </div>
      </div>
    </footer>
  );
}
