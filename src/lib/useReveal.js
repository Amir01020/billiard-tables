import { useEffect } from 'react';

// Плавное появление элементов с классом .reveal при прокрутке
export default function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      }),
      { threshold: 0.1 },
    );
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
