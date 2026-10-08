import { maskPhone } from '../lib/form';

export function Field({ label, error, children }) {
  return (
    <label className={`field${error ? ' is-error' : ''}`}>
      {children}
      {label && <span>{label}</span>}
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
