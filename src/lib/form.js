import { useState } from 'react';

// Маска +998 XX XXX-XX-XX
export function maskPhone(value) {
  let d = value.replace(/\D/g, '');
  if (!d.startsWith('998')) d = '998' + d;
  d = d.slice(0, 12);
  const p = [d.slice(0, 3), d.slice(3, 5), d.slice(5, 8), d.slice(8, 10), d.slice(10, 12)];
  return '+' + p[0] + (p[1] ? ' ' + p[1] : '') + (p[2] ? ' ' + p[2] : '') + (p[3] ? '-' + p[3] : '') + (p[4] ? '-' + p[4] : '');
}

const isPhoneValid = (v) => v.replace(/\D/g, '').length === 12;

/**
 * Отправка формы в Telegram через send.php.
 * required: имена обязательных полей; поле "phone" проверяется по маске.
 */
export function useLeadForm(required = ['name', 'phone'], { successText = 'Спасибо! Мы скоро свяжемся с вами.', onSuccess } = {}) {
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next = {};
    required.forEach((name) => {
      const v = String(data.get(name) || '').trim();
      if (name === 'phone' ? !isPhoneValid(v) : !v) next[name] = true;
    });
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus({ type: 'err', text: 'Заполните обязательные поля' });
      return;
    }

    setSending(true);
    setStatus({ type: '', text: 'Отправка...' });
    try {
      const res = await fetch('send.php', { method: 'POST', body: data });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      setStatus({ type: 'ok', text: successText });
      form.reset();
      onSuccess?.();
    } catch {
      setStatus({ type: 'err', text: 'Ошибка отправки. Позвоните нам или попробуйте позже.' });
    } finally {
      setSending(false);
    }
  };

  return { errors, status, sending, onSubmit };
}
