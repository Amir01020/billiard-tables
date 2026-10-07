import Icon from '../lib/Icon';
import { maskPhone } from '../lib/form';

export function Button({ as: Tag = 'a', variant = 'primary', arrow, className = '', children, ...props }) {
  return (
    <Tag className={`btn btn--${variant} ${className}`} {...props}>
      {children}
      {arrow && <Icon name="arrow" />}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, subtitle, className = '', children }) {
  return (
    <div className={`section__head reveal ${className}`}>
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section__title">{title}</h2>
        {subtitle && <p className="section__subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className={`field${error ? ' is-error' : ''}`}>
      {label && <span>{label}</span>}
      {children}
    </label>
  );
}

export function PhoneInput(props) {
  return (
    <input
      type="tel"
      name="phone"
      placeholder="+998 __ ___-__-__"
      onInput={(e) => { e.target.value = maskPhone(e.target.value); }}
      {...props}
    />
  );
}

// Скрытое поле-ловушка для ботов + источник заявки
export function FormMeta({ source }) {
  return (
    <>
      <input type="text" name="website" className="hp" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="form" value={source} />
    </>
  );
}

export function FormStatus({ status }) {
  return (
    <p className={`form__status${status.type ? ' is-' + status.type : ''}`} role="status">
      {status.text}
    </p>
  );
}

export function PhotoPlaceholder({ label }) {
  return (
    <div className="ph">
      <Icon name="camera" />
      {label}
    </div>
  );
}
