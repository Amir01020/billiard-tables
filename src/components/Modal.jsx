import { useEffect } from 'react';

export default function Modal({ open, onClose, eyebrow, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal is-open" role="dialog" aria-modal="true">
      <div className="modal__overlay" onClick={onClose} />
      <div className="modal__box">
        <button className="modal__close" onClick={onClose} aria-label="Закрыть">&times;</button>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3 className="modal__title">{title}</h3>
        {children}
      </div>
    </div>
  );
}
