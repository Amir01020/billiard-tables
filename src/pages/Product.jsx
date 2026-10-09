import { useRef, useState } from 'react';
import { products } from '../data';
import useSlideReveal from '../lib/useSlideReveal';
import { Arrows } from '../components/Slider';
import { Tables, fmt } from '../components/Sections';

// Галерея: большое фото + миниатюры, пагинация точками
function Gallery({ images, name }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const stage = useRef(null);
  const go = (d) => setI((v) => (v + d + n) % n);

  useSlideReveal(stage, i);

  // свайп на мобильных
  const touch = useRef(0);
  return (
    <div className="gallery">
      <div
        className="gallery__stage"
        ref={stage}
        onPointerDown={(e) => { touch.current = e.clientX; }}
        onPointerUp={(e) => { const dx = e.clientX - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}
      >
        {images.map((src, k) => <img key={k} src={src} alt={`${name} — ракурс ${k + 1}`} draggable="false" />)}
      </div>
      <div className="gallery__foot">
        <div className="gallery__thumbs">
          {images.map((src, k) => (
            <button key={k} className={k === i ? 'is-active' : ''} onClick={() => setI(k)} aria-label={`Фото ${k + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
        <Arrows index={i} total={n} onGo={setI} onPrev={() => go(-1)} onNext={() => go(1)} />
      </div>
    </div>
  );
}

export default function Product({ id, onConsult }) {
  const p = products.find((x) => x.id === id);

  if (!p) {
    return (
      <section className="page page--empty">
        <div className="wrap">
          <h1 className="title">Стол не найден</h1>
          <a href="#tables" className="clink"><span>Все модели</span></a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page product">
        <div className="wrap">
          <nav className="crumbs js-fade">
            <a href="#top" className="ulink">Главная</a><span>/</span>
            <a href="#tables" className="ulink">Готовые модели</a><span>/</span>
            <span>{p.name}</span>
          </nav>
          <div className="product__grid">
            <div className="js-fade"><Gallery images={p.gallery} name={p.name} /></div>
            <div className="product__info">
              <h1 className="title js-lines">{p.name}</h1>
              <p className="product__type js-fade">{p.type}</p>
              <p className="product__price js-fade">{fmt(p.price)}</p>
              <p className="product__text js-fade">{p.text}</p>
              <div className="product__actions js-fade">
                <a href={`#/builder/${p.id}`} className="btn">Собрать на основе модели</a>
                <button className="btn btn--ghost" onClick={() => onConsult(p.name)}>Консультация</button>
              </div>
              <h2 className="product__subtitle js-fade">Характеристики</h2>
              <dl className="specs js-stagger">
                {p.specs.map(([k, v]) => (
                  <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
      <Tables title="Другие модели" exclude={p.id} />
    </>
  );
}
