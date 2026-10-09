import { useState, useCallback, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Modal from './components/Modal';
import Cursor from './components/Cursor';
import { Manifesto, Universes, Process } from './components/Bespoke';
import {
  Hero, Assembly, Tables, Bespoke, Projects,
  Faq, Service, Order, ModalForm, Footer,
} from './components/Sections';
import Product from './pages/Product';
import Builder from './pages/Builder';
import { initSmoothScroll, initScrollAnimations, getLenis, ScrollTrigger } from './lib/motion';
import { useRoute } from './lib/router';

function Home({ ready }) {
  return (
    <>
      <Hero ready={ready} />
      <Manifesto />
      <Universes />
      <Process />
      <Bespoke />
      <Assembly />
      <Tables />
      <Projects />
      <Faq />
      <Service />
      <Order />
    </>
  );
}

export default function App() {
  const route = useRoute();
  const [modal, setModal] = useState(null); // { title, source, hidden, button, summary }
  const [ready, setReady] = useState(false);
  const close = useCallback(() => setModal(null), []);
  const onLoaded = useCallback(() => setReady(true), []);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    return initSmoothScroll();
  }, []);

  // смена страницы: наверх (или к секции), заново запускаем анимации появления
  useEffect(() => {
    const lenis = getLenis();
    const target = route.anchor && document.getElementById(route.anchor);
    if (target) setTimeout(() => (lenis ? lenis.scrollTo(target, { offset: -70, immediate: true }) : target.scrollIntoView()), 50);
    else if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    const stop = initScrollAnimations();
    ScrollTrigger.refresh();
    return stop;
  }, [route.page, route.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!ready) return;
    document.body.classList.add('is-ready');
    getLenis()?.start();
    ScrollTrigger.refresh();
  }, [ready]);

  useEffect(() => {
    const lenis = getLenis();
    if (modal) lenis?.stop(); else if (ready) lenis?.start();
  }, [modal, ready]);

  // консультация (со страницы стола) - только имя и телефон
  const consult = (model) => setModal({
    title: model ? `Консультация: ${model}` : 'Консультация',
    source: 'Консультация по модели',
    hidden: model ? { model } : {},
    button: 'Получить консультацию',
  });
  // заказ из конструктора - в бота уходят выбранные характеристики
  const orderConfig = (config) => setModal({
    title: 'Заказать стол',
    source: 'Заказ из конструктора',
    hidden: { config },
    button: 'Отправить заявку',
    summary: config,
  });

  return (
    <>
      {!ready && <Preloader onDone={onLoaded} />}
      <Cursor />
      <Header solid={route.page !== 'home'} />
      <main key={route.page + (route.id || '')}>
        {route.page === 'home' && <Home ready={ready} />}
        {route.page === 'table' && <Product id={route.id} onConsult={consult} />}
        {route.page === 'builder' && <Builder id={route.id} onOrder={orderConfig} />}
      </main>
      <Footer />
      <Modal open={!!modal} onClose={close} title={modal?.title}>
        {modal?.summary && <pre className="modal__summary">{modal.summary}</pre>}
        {modal && <ModalForm source={modal.source} hidden={modal.hidden} button={modal.button} onDone={close} />}
      </Modal>
    </>
  );
}
