import { site } from '../data';

const base = import.meta.env.BASE_URL;

export default function Logo({ withTagline = false, className = '' }) {
  return (
    <a href="#hero" className={`logo ${className}`} aria-label={`${site.brand} - на главную`}>
      <img src={`${base}brand/logo.svg`} alt={site.brand} className="logo__img" width={site.logoSize[0]} height={site.logoSize[1]} />
      {withTagline && (
        <span className="logo__sub">
          {site.tagline[0]}<br />{site.tagline[1]}
        </span>
      )}
    </a>
  );
}
