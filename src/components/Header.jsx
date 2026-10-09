import { useEffect, useRef, useState } from 'react';
import { site } from '../data';
import { gsap, getLenis } from '../lib/motion';

export default function Header({ solid: forceSolid = false }) {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(site.langs[0]);
  const [hover, setHover] = useState(0);
  const menu = useRef(null);
  const tl = useRef(null);

  // Шапка прячется при скролле вниз и появляется при скролле вверх
  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 300 && y > last);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const m = menu.current;
    const ctx = gsap.context(() => {
      tl.current = gsap.timeline({ paused: true })
        .set(m, { visibility: 'visible' })
        .fromTo(m, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'expo.inOut' })
        .fromTo('.menu__link span', { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, '-=0.45')
        .fromTo('.menu__foot > *, .menu__media', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05 }, '<0.1');
    }, m);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) { tl.current.timeScale(1).play(); lenis?.stop(); }
    else { tl.current.timeScale(1.6).reverse(); lenis?.start(); }
  }, [open]);

  const cls = ['header', (solid || forceSolid) && 'is-solid', hidden && !open && 'is-hidden', open && 'is-open'].filter(Boolean).join(' ');

  return (
    <>
      <header className={cls}>
        <div className="header__top">
          <nav>{site.utility.map((u) => <a key={u.href} href={u.href} className="ulink">{u.label}</a>)}</nav>
          <div className="langs">
            {site.langs.map((l) => (
              <button key={l} className={l === lang ? 'is-active' : ''} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="header__main">
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Меню" aria-expanded={open}>
            <span /><span />
            <em>{open ? 'Закрыть' : 'Меню'}</em>
          </button>
          <a href="#top" className="wordmark" onClick={() => setOpen(false)}>
            Billiard <i>Stars</i>
          </a>
          <a href="#order" className="header__cta ulink">Заказать консультацию</a>
        </div>
      </header>

      <div className="menu" ref={menu} onClick={(e) => e.target.closest('a') && setOpen(false)}>
        <div className="menu__inner">
          <nav className="menu__nav">
            {site.nav.map((n, i) => (
              <a key={n.href} href={n.href} className="menu__link" onMouseEnter={() => setHover(i)}>
                <span><sup>0{i + 1}</sup>{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="menu__media">
            {site.nav.map((n, i) => (
              <img key={n.href} src={n.img} alt="" loading="lazy" decoding="async" className={i === hover ? 'is-active' : ''} />
            ))}
          </div>
        </div>
        <div className="menu__foot">
          <span>{site.contacts.address}</span>
          <a href={`tel:${site.contacts.phones[0].replace(/[^\d+]/g, '')}`}>{site.contacts.phones[0]}</a>
          <div className="menu__socials">
            {site.contacts.socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
          </div>
        </div>
      </div>
    </>
  );
}
