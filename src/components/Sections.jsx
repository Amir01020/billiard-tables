import { useState } from 'react';
import { hero, products, consult, advantages, steps, gallery } from '../data';
import { useLeadForm } from '../lib/form';
import Icon from '../lib/Icon';
import { Button, SectionHead, Field, PhoneInput, FormMeta, FormStatus, PhotoPlaceholder } from './ui';
import TableArt from './TableArt';

const base = import.meta.env.BASE_URL;
const fmtPrice = (p) => (p == null ? null : p.toLocaleString('ru-RU').replace(/\s/g, ' ') + ' сум');

/* ---------- 1. Hero ---------- */
export function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__media" aria-hidden="true">
        {hero.photo ? <img className="hero__photo" src={base + hero.photo} alt="" /> : (
          <>
            <div className="hero__lamp" />
            <TableArt />
          </>
        )}
      </div>
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="hero__title">
            {hero.titleStart}<em>{hero.titleAccent}</em>{hero.titleEnd}
          </h1>
          <p className="hero__text">{hero.text}</p>
          <div className="hero__actions">
            <Button href="#order" arrow>Оставить заявку</Button>
            <Button href="#catalog" variant="ghost">Посмотреть столы</Button>
          </div>
        </div>
        <ul className="hero__features">
          {hero.features.map((f) => (
            <li key={f.icon}>
              <span className="ico"><Icon name={f.icon} /></span>
              <span>{f.text[0]}<br />{f.text[1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- 2. Каталог ---------- */
function ProductCard({ p, onOrder }) {
  const [slide, setSlide] = useState(0);
  const price = fmtPrice(p.price);
  const slides = p.images.length ? p.images : [null];

  return (
    <article className="card reveal">
      <div className="card__gallery">
        {slides.map((src, i) => (
          <div key={i} className={`card__slide${i === slide ? ' is-active' : ''}`}>
            {src ? <img src={base + src} alt={`${p.name} - фото ${i + 1}`} loading="lazy" /> : <TableArt wood={p.wood} />}
          </div>
        ))}
        <span className="card__tag">{p.tag}</span>
        {slides.length > 1 && (
          <div className="card__dots">
            {slides.map((_, i) => (
              <button key={i} type="button" className={i === slide ? 'is-active' : ''} onClick={() => setSlide(i)} aria-label={`Фото ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
      <div className="card__body">
        <h3 className="card__title">{p.name}</h3>
        <ul className="card__specs">
          <li><span>Игровое поле</span><span>{p.size}</span></li>
          <li><span>Вид игры</span><span>{p.game}</span></li>
          <li><span>Материал</span><span>{p.material}</span></li>
          <li><span>Сукно</span><span>{p.cloth}</span></li>
        </ul>
        <div className="card__footer">
          <span className={`card__price${price ? '' : ' card__price--request'}`}>{price || 'Цена по запросу'}</span>
          <Button as="button" type="button" variant="outline" arrow onClick={() => onOrder(p.name)}>Заказать</Button>
        </div>
      </div>
    </article>
  );
}

export function Catalog({ onOrder }) {
  return (
    <section className="section section--deep" id="catalog">
      <div className="container">
        <SectionHead
          className="section__head--split"
          eyebrow="Профессиональные столы"
          title={`${products.length} моделей столов для вашего клуба`}
          subtitle="Русский бильярд, пул и снукер. Столы для коммерческих клубов, ресторанов и частных интерьеров."
        >
          <div className="pill-note">
            <Icon name="table" />
            <span>Все модели<br />с гарантией до 5 лет</span>
          </div>
        </SectionHead>
        <div className="catalog">
          {products.slice(0, 6).map((p) => <ProductCard key={p.id} p={p} onOrder={onOrder} />)}
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. Консультация ---------- */
export function Consult() {
  const { errors, status, sending, onSubmit } = useLeadForm(['phone']);
  return (
    <section className="consult" id="consult">
      <div className="consult__media">
        {consult.photo ? <img className="consult__photo" src={base + consult.photo} alt="" loading="lazy" /> : <TableArt className="table3d--close" />}
        <div className="consult__media-text">
          <span className="eyebrow">{consult.eyebrow}</span>
          <h2 className="section__title">{consult.title[0]}<br />{consult.title[1]}</h2>
          <p>{consult.text}</p>
        </div>
      </div>
      <div className="consult__body reveal">
        <h3 className="consult__title">{consult.listTitle}</h3>
        <ul className="checklist">
          {consult.list.map((t) => <li key={t}><Icon name="check" />{t}</li>)}
        </ul>
        <form className="quick-form" onSubmit={onSubmit} noValidate>
          <p className="quick-form__title">{consult.formTitle}</p>
          <FormMeta source="Расчёт конфигурации клуба" />
          <div className="quick-form__row">
            <Field><input type="text" name="area" inputMode="numeric" placeholder="Площадь, м²" /></Field>
            <Field error={errors.phone}><PhoneInput placeholder="Телефон" /></Field>
            <Button as="button" type="submit" arrow disabled={sending}>Получить расчёт</Button>
          </div>
          <FormStatus status={status} />
        </form>
      </div>
    </section>
  );
}

/* ---------- 4. Преимущества ---------- */
export function Advantages() {
  return (
    <section className="advantages" id="advantages">
      <div className="container advantages__grid">
        {advantages.map((a) => (
          <div className="adv reveal" key={a.icon}>
            <span className="ico"><Icon name={a.icon} /></span>
            <p>{a.text.map((line, i) => <span key={i}>{line}<br /></span>)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- 5. Условия ---------- */
export function Conditions() {
  return (
    <section className="section" id="conditions">
      <div className="container">
        <SectionHead eyebrow="Как мы работаем" title="Условия заказа, доставки и установки" subtitle="Тексты будут заменены данными Заказчика" />
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step reveal" key={s.title}>
              <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. Галерея ---------- */
export function Gallery() {
  return (
    <section className="section section--deep" id="gallery">
      <div className="container">
        <SectionHead eyebrow="Наши проекты" title="Фотогалерея" subtitle="Клубы и интерьеры, оснащённые нашими столами" />
        <div className="gallery">
          {gallery.map((g, i) => (
            <figure key={i} className={`gallery__item reveal${g.wide ? ' gallery__item--wide' : ''}`}>
              {g.src ? <img src={base + g.src} alt={`Проект ${i + 1}`} loading="lazy" /> : <PhotoPlaceholder label={`Фото ${i + 1}`} />}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. Заявка ---------- */
function Balls() {
  const balls = [[180, 210, 120, 'w'], [350, 170, 110, 'w'], [500, 260, 95, 'r'], [300, 330, 115, 'w'], [460, 420, 105, 'g'], [140, 420, 90, 'w']];
  const grads = { w: ['#fffef6', '#e7dfc9', '#6f6754'], r: ['#ff6d5e', '#a3160d', '#3a0603'], g: ['#5cff9a', '#01b542', '#013d17'] };
  return (
    <div className="order__balls" aria-hidden="true">
      <svg viewBox="0 0 620 540">
        <defs>
          {Object.entries(grads).map(([k, [a, b, c]]) => (
            <radialGradient key={k} id={`ball-${k}`} cx=".35" cy=".32" r=".75">
              <stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} />
            </radialGradient>
          ))}
        </defs>
        {balls.map(([x, y, r, k]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={`url(#ball-${k})`} />)}
      </svg>
    </div>
  );
}

export function Order() {
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone']);
  return (
    <section className="order" id="order">
      <Balls />
      <div className="container order__inner">
        <div className="order__text reveal">
          <span className="eyebrow">Бильярдный клуб - это стабильный бизнес</span>
          <h2 className="section__title">Выберите стол, который будет приносить прибыль</h2>
          <p>Оставьте заявку - менеджер перезвонит в течение 15 минут, ответит на вопросы и поможет с выбором.</p>
        </div>
        <form className="form reveal" onSubmit={onSubmit} noValidate>
          <FormMeta source="Заявка на стол" />
          <Field label="Ваше имя *" error={errors.name}><input type="text" name="name" placeholder="Имя" /></Field>
          <Field label="Телефон *" error={errors.phone}><PhoneInput /></Field>
          <Field label="Модель стола">
            <select name="model" defaultValue="">
              <option value="">Не определился, нужна консультация</option>
              {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </Field>
          <Button as="button" type="submit" arrow className="btn--block" disabled={sending}>Оставить заявку</Button>
          <p className="form__note">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          <FormStatus status={status} />
        </form>
      </div>
    </section>
  );
}

/* ---------- Модалка заказа из каталога ---------- */
export function OrderModalForm({ model, onDone }) {
  const { errors, status, sending, onSubmit } = useLeadForm(['name', 'phone'], { onSuccess: () => setTimeout(onDone, 1800) });
  return (
    <form className="form form--plain" onSubmit={onSubmit} noValidate>
      <FormMeta source="Заказ из каталога" />
      <input type="hidden" name="model" value={model} />
      <Field label="Ваше имя *" error={errors.name}><input type="text" name="name" placeholder="Имя" autoFocus /></Field>
      <Field label="Телефон *" error={errors.phone}><PhoneInput /></Field>
      <Button as="button" type="submit" arrow className="btn--block" disabled={sending}>Отправить</Button>
      <FormStatus status={status} />
    </form>
  );
}
