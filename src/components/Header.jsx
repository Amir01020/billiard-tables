import { useEffect, useState } from 'react';
import { site } from '../data';
import { Button } from './ui';
import Logo from './Logo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cls = ['header', scrolled && 'is-scrolled', open && 'menu-open'].filter(Boolean).join(' ');

  return (
    <header className={cls}>
      <div className="container header__inner">
        <Logo withTagline />
        <nav className={`nav${open ? ' is-open' : ''}`} onClick={(e) => e.target.tagName === 'A' && setOpen(false)}>
          {site.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <Button href="#order" arrow className="btn--sm header__cta">{site.headerCta}</Button>
        <button className={`burger${open ? ' is-open' : ''}`} aria-label="Меню" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
