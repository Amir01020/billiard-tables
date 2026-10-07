import { Fragment } from 'react';
import { site } from '../data';
import Logo from './Logo';

export function Contacts() {
  const { contacts } = site;
  return (
    <section className="section" id="contacts">
      <div className="container contacts">
        <div className="contacts__info reveal">
          <span className="eyebrow">{contacts.eyebrow}</span>
          <h2 className="section__title">Контакты</h2>
          <ul className="contacts__list">
            <li><span>{contacts.addressLabel}</span>{contacts.address}</li>
            <li>
              <span>Телефоны</span>
              {contacts.phones.map((p, i) => (
                <Fragment key={p}>
                  <a href={`tel:${p.replace(/[^\d+]/g, '')}`}>{p}</a>{i < contacts.phones.length - 1 && <br />}
                </Fragment>
              ))}
            </li>
            {contacts.email && <li><span>Email</span><a href={`mailto:${contacts.email}`}>{contacts.email}</a></li>}
            <li><span>Режим работы</span>{contacts.hours}</li>
          </ul>
          <div className="socials">
            {contacts.socials.map((s) => <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
          </div>
        </div>
        <div className="contacts__map reveal">
          <iframe src={`https://www.google.com/maps?q=${encodeURIComponent(contacts.mapQuery)}&output=embed`} loading="lazy" title="Карта" />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo className="logo--footer" />
        <nav className="footer__nav">
          {site.nav.filter((n) => n.footer).map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <span className="footer__copy">&copy; {new Date().getFullYear()} {site.brand}. Все права защищены.</span>
      </div>
    </footer>
  );
}
