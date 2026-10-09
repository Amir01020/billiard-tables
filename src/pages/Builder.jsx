import { useMemo, useRef, useState, useEffect } from 'react';
import { builder, products } from '../data';
import { gsap } from '../lib/motion';

// Начальный выбор: первый вариант каждого пункта, затем пресет модели или вида игры
function initialSelection(id) {
  const sel = {};
  builder.steps.forEach((s) => { sel[s.key] = s.type === 'multi' ? [] : s.options[0].v; });
  const product = products.find((p) => p.id === id);
  if (product?.preset) Object.assign(sel, product.preset);
  if (builder.games[id]) sel.game = builder.games[id];
  return { sel, product };
}

// Текст конфигурации для заявки в Telegram
export function configToText(sel, base) {
  const lines = builder.steps.map((s) => {
    const v = sel[s.key];
    const val = Array.isArray(v) ? (v.length ? v.join(', ') : '—') : v;
    return `${s.title}: ${val}`;
  });
  if (base) lines.unshift(`На основе модели: ${base}`);
  return lines.join('\n');
}

function Option({ step, opt, active, onPick }) {
  return (
    <button
      type="button"
      className={`opt${opt.color ? ' opt--swatch' : ''}${active ? ' is-active' : ''}`}
      onClick={() => onPick(opt.v)}
      aria-pressed={active}
    >
      {opt.color && <i style={{ '--sw': opt.color }} />}
      <span className="opt__v">{opt.v}</span>
      {opt.d && <span className="opt__d">{opt.d}</span>}
      {step.type === 'multi' && <em className="opt__check" />}
    </button>
  );
}

export default function Builder({ id, onOrder }) {
  const init = useMemo(() => initialSelection(id), [id]);
  const [sel, setSel] = useState(init.sel);
  const preview = useRef(null);

  useEffect(() => { setSel(init.sel); }, [init]);

  const pick = (step, v) => {
    setSel((s) => {
      if (step.type !== 'multi') return { ...s, [step.key]: v };
      const list = s[step.key];
      return { ...s, [step.key]: list.includes(v) ? list.filter((x) => x !== v) : [...list, v] };
    });
  };

  const photo = (sel.finish === 'Чёрный рояльный лак' && 'images/premium-plus.webp') || builder.previews[sel.game] || init.product?.img;

  // мягкая смена превью
  useEffect(() => {
    const img = preview.current?.querySelector('img');
    if (img) gsap.fromTo(img, { autoAlpha: 0.3, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power3.out' });
  }, [photo]);

  const clothColor = builder.steps.find((s) => s.key === 'cloth').options.find((o) => o.v === sel.cloth)?.color;
  const woodColor = builder.steps.find((s) => s.key === 'finish').options.find((o) => o.v === sel.finish)?.color;

  return (
    <section className="page builder">
      <div className="wrap">
        <nav className="crumbs js-fade">
          <a href="#top" className="ulink">Главная</a><span>/</span><span>Конструктор</span>
        </nav>
        <div className="builder__head">
          <h1 className="title js-lines">{builder.title}</h1>
          <p className="js-fade">{builder.text}</p>
          {init.product && <p className="builder__base js-fade">Основа: модель {init.product.name}</p>}
        </div>

        <div className="builder__grid">
          <div className="builder__steps">
            {builder.steps.map((step, k) => (
              <fieldset className="bstep js-fade" key={step.key}>
                <legend>
                  <span className="bstep__num">{String(k + 1).padStart(2, '0')}</span>
                  {step.title}
                  {step.type === 'multi' && <small>можно выбрать несколько</small>}
                </legend>
                <div className={`bstep__opts${step.options[0].color ? ' bstep__opts--swatch' : ''}`}>
                  {step.options.map((opt) => (
                    <Option
                      key={opt.v}
                      step={step}
                      opt={opt}
                      active={step.type === 'multi' ? sel[step.key].includes(opt.v) : sel[step.key] === opt.v}
                      onPick={(v) => pick(step, v)}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <aside className="summary">
            <div className="summary__img" ref={preview} style={{ '--cloth': clothColor, '--wood': woodColor }}>
              <img src={photo} alt="Превью стола" />
              <div className="summary__chips"><i style={{ background: woodColor }} /><i style={{ background: clothColor }} /></div>
            </div>
            <h2 className="summary__title">Ваш стол</h2>
            <dl className="summary__list">
              {builder.steps.map((s) => {
                const v = sel[s.key];
                return (
                  <div key={s.key}>
                    <dt>{s.title}</dt>
                    <dd>{Array.isArray(v) ? (v.length ? v.join(', ') : '—') : v}</dd>
                  </div>
                );
              })}
            </dl>
            <button className="btn summary__btn" onClick={() => onOrder(configToText(sel, init.product?.name))}>Заказать</button>
            <p className="summary__note">Стоимость рассчитает дизайнер после уточнения деталей. Это ни к чему вас не обязывает.</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
