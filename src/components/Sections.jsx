import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { hero, atelier, products, bespoke, projects, reviews, faq, service, site } from '../data';
import { gsap, splitLines } from '../lib/motion';
import { useLeadForm } from '../lib/form';
import { Field, PhoneInput, FormMeta, FormStatus } from './ui';
import Slider, { Arrows } from './Slider';
const Ball3D = lazy(() => import('./Ball3D'));

const fmt = (n) => (n ? 'от ' + n.toLocaleString('ru-RU').replace(/,/g, ' ') + ' сум' : 'Цена по запросу');

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
      .to(el.querySelectorAll('.hero__fade'), { autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, 0.6);
    return () => tl.progress(1).kill();
  }, [ready]);

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero__media"><img src={hero.photo} alt="Бильярдный стол Billiard Stars" fetchpriority="high" /></div>
      <div className="hero__shade" />
      <div className="hero__content">
        <span className="kicker hero__fade">{hero.kicker}</span>
        <h1 className="hero__title">{hero.title[0]}<br /><em>{hero.title[1]}</em></h1>
        <p className="hero__text hero__fade">{hero.text}</p>
        <div className="hero__fade"><Link href="#process" light>Как мы создаём стол</Link></div>
      </div>
      <div className="hero__scroll hero__fade"><span>Листайте</span><i /></div>
    </section>
  );
}

/* ---------- Мастерская ---------- */
export function Atelier() {
  return (
    <section className="section atelier" id="atelier">
      <div className="wrap atelier__grid">
        <figure className="atelier__img js-reveal-img"><img src={atelier.photo} alt="" loading="lazy" /></figure>
        <div className="atelier__body">
          <span className="kicker js-fade">{atelier.eyebrow}</span>
          <h2 className="title js-lines">Каждый стол<br />собирается вручную</h2>
          <p className="js-fade">{atelier.text}</p>
          <div className="stats js-stagger">
            {atelier.stats.map((s) => (
              <div key={s.label}>
                <b><span data-count={s.value}>0</span>{s.suffix}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="js-fade"><Link href="#bespoke">О мастерской</Link></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Столы (слайдер) ---------- */
export function Tables({ onOrder }) {
  return (
    <section className="section tables" id="tables">
      <div className="wrap">
        <Slider
          head={(arrows) => (
            <div className="head head--row">
              <div>
                <span className="kicker js-fade">Избранное</span>
                <h2 className="title js-lines">Наши столы</h2>
              </div>
              {arrows}
            </div>
          )}
        >
          {products.map((p) => (
            <article className="pcard" key={p.id}>
              <div className="pcard__img"><img src={p.img} alt={p.name} loading="lazy" draggable="false" /></div>
              <div className="pcard__body">
                <div>
                  <h3>{p.name}</h3>
                  <span className="pcard__type">{p.type}</span>
                </div>
                <span className="pcard__price">{fmt(p.price)}</span>
              </div>
              <button className="pcard__btn" onClick={() => onOrder(p.name)}>Запросить</button>
            </article>
          ))}
        </Slider>
      </div>
    </section>
  );
}

/* ---------- На заказ ---------- */
export function Bespoke() {
  const [i, setI] = useState(0);
  const n = bespoke.slides.length;
  const stage = useRef(null);
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    const imgs = stage.current.querySelectorAll('img');
    imgs.forEach((img, k) => {
      if (k === i) {
        gsap.set(img, { zIndex: 2 });
        gsap.fromTo(img, { clipPath: 'inset(0 0 0 100%)', scale: 1.15 }, { clipPath: 'inset(0 0 0 0%)', scale: 1, duration: 1.3, ease: 'expo.inOut' });
      } else gsap.set(img, { zIndex: 1 });
    });
  }, [i]);

  return (
    <section className="section bespoke" id="bespoke">
      <div className="wrap bespoke__grid">
        <div className="bespoke__body">
          <span className="kicker js-fade">{bespoke.eyebrow}</span>
          <h2 className="title js-lines">Стол, созданный<br />только для вас</h2>
          <p className="js-fade">{bespoke.text}</p>
          <div className="js-fade"><Link href="#configurator" light>Создать свой стол</Link></div>
        </div>
        <div className="bespoke__slider js-fade">
          <div className="bespoke__stage" ref={stage}>
            {bespoke.slides.map((s) => <img key={s.label} src={s.img} alt={s.label} loading="lazy" />)}
          </div>
          <div className="bespoke__foot">
            <span className="bespoke__label" key={i}>{bespoke.slides[i].label}</span>
            <Arrows index={i} total={n} onPrev={() => go(-1)} onNext={() => go(1)} />
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
              <div>
                <span className="kicker js-fade">Реализованные проекты</span>
                <h2 className="title js-lines">Они нам доверились</h2>
              </div>
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

/* ---------- Конфигуратор (3D-шар) ---------- */
const CLOTHS = [
  { name: 'Изумруд', c: '#0f4a37' },
  { name: 'Бордо', c: '#5c1a22' },
  { name: 'Ночь', c: '#14213d' },
  { name: 'Антрацит', c: '#2b2b2b' },
  { name: 'Шампань', c: '#b8945a' },
];

export function Configurator() {
  const [cloth, setCloth] = useState(CLOTHS[0]);
  return (
    <section className="configurator" id="configurator">
      <div className="wrap configurator__grid">
        <div className="configurator__body">
          <span className="kicker js-fade">Конфигуратор</span>
          <h2 className="title js-lines">Соберите стол<br />своей мечты</h2>
          <p className="js-fade">Выберите цвет сукна, породу дерева и детали — мы пришлём визуализацию и точный расчёт в течение дня.</p>
          <div className="swatches js-fade">
            {CLOTHS.map((s) => (
              <button key={s.name} className={s === cloth ? 'is-active' : ''} style={{ '--sw': s.c }} onClick={() => setCloth(s)} aria-label={s.name} />
            ))}
            <span>{cloth.name}</span>
          </div>
          <div className="js-fade"><Link href="#order" light>Начать конфигурацию</Link></div>
        </div>
        <div className="configurator__ball" style={{ '--glow': cloth.c }}>
          <Suspense fallback={null}><Ball3D color={cloth.c} /></Suspense>
        </div>
      </div>
    </section>
  );
}

/* ---------- Отзывы ---------- */
export function Reviews() {
  const [i, setI] = useState(0);
  const n = reviews.length;
  const box = useRef(null);
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    gsap.fromTo(box.current.children, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08 });
  }, [i]);

  useEffect(() => {
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [i]);

  const r = reviews[i];
  return (
    <section className="section reviews">
      <div className="wrap reviews__inner">
        <span className="kicker js-fade">Отзывы клиентов</span>
        <div className="reviews__stars js-fade">★★★★★</div>
        <div ref={box} className="reviews__box">
          <blockquote>«{r.text}»</blockquote>
          <cite><b>{r.name}</b> — {r.role}</cite>
        </div>
        <Arrows index={i} total={n} onPrev={() => go(-1)} onNext={() => go(1)} />
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
          <span className="kicker js-fade">Вопросы и ответы</span>
          <h2 className="title js-lines">Всё, что важно<br />знать заранее</h2>
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
            <span key={k}>Billiard Stars <i>✦</i> Искусство игры <i>✦</i> Ручная работа <i>✦</i> Billiard Stars <i>✦</i> Искусство игры <i>✦</i> Ручная работа <i>✦</i>&nbsp;</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Заявка ---------- */
export function Order() {
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone']);
  return (
    <section className="section order" id="order">
      <div className="wrap order__grid">
        <div>
          <span className="kicker js-fade">Персональная консультация</span>
          <h2 className="title js-lines">Начнём<br />ваш проект</h2>
          <p className="js-fade">Оставьте контакты — консультант свяжется с вами, ответит на вопросы и пригласит в шоурум.</p>
        </div>
        <form className="form js-fade" onSubmit={onSubmit} noValidate>
          <FormMeta source="Консультация" />
          <Field label="Ваше имя" error={errors.name}><input name="name" type="text" autoComplete="name" /></Field>
          <Field label="Телефон" error={errors.phone}><PhoneInput /></Field>
          <button className="btn" disabled={sending}>Отправить заявку</button>
          <FormStatus status={status} />
        </form>
      </div>
    </section>
  );
}

export function OrderModalForm({ model, onDone }) {
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone'], {
    onSuccess: () => setTimeout(onDone, 1800),
  });
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <FormMeta source="Заявка на модель" />
      <input type="hidden" name="model" value={model || ''} />
      <Field label="Ваше имя" error={errors.name}><input name="name" type="text" autoComplete="name" /></Field>
      <Field label="Телефон" error={errors.phone}><PhoneInput /></Field>
      <button className="btn" disabled={sending}>Отправить</button>
      <FormStatus status={status} />
    </form>
  );
}

/* ---------- Футер ---------- */
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
        <div className="footer__brand">Billiard <i>Stars</i></div>
        <div className="footer__legal">
          <span>&copy; {new Date().getFullYear()} {site.brand}. Все права защищены.</span>
          <span>Политика конфиденциальности</span>
        </div>
      </div>
    </footer>
  );
}
