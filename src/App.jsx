import { useState, useCallback, useEffect } from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Modal from './components/Modal';
import Cursor from './components/Cursor';
import { Manifesto, Universes, Process } from './components/Bespoke';
import {
  Hero, Atelier, Tables, Bespoke, Projects, Configurator,
  Reviews, Faq, Service, Order, OrderModalForm, Footer,
} from './components/Sections';
import { initSmoothScroll, initScrollAnimations, getLenis, ScrollTrigger } from './lib/motion';

export default function App() {
  const [model, setModel] = useState(null);
  const [ready, setReady] = useState(false);
  const close = useCallback(() => setModel(null), []);
  const onLoaded = useCallback(() => setReady(true), []);

  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const stopScroll = initSmoothScroll();
    const stopAnims = initScrollAnimations();
    return () => { stopAnims(); stopScroll(); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.body.classList.add('is-ready');
    getLenis()?.start();
    ScrollTrigger.refresh();
  }, [ready]);

  useEffect(() => {
    const lenis = getLenis();
    if (model) lenis?.stop(); else if (ready) lenis?.start();
  }, [model, ready]);

  return (
    <>
      {!ready && <Preloader onDone={onLoaded} />}
      <Cursor />
      <Header />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Universes />
        <Process />
        <Bespoke />
        <Atelier />
        <Tables onOrder={setModel} />
        <Projects />
        <Configurator />
        <Reviews />
        <Faq />
        <Service />
        <Order />
      </main>
      <Footer />
      <Modal open={!!model} onClose={close} eyebrow="Запрос на модель" title={model}>
        <OrderModalForm model={model} onDone={close} />
      </Modal>
    </>
  );
}
