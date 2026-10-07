import { useState, useCallback } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import { Contacts, Footer } from './components/Contacts';
import { Hero, Catalog, Consult, Advantages, Conditions, Gallery, Order, OrderModalForm } from './components/Sections';
import useReveal from './lib/useReveal';

export default function App() {
  const [model, setModel] = useState(null);
  const close = useCallback(() => setModel(null), []);
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog onOrder={setModel} />
        <Consult />
        <Advantages />
        <Conditions />
        <Gallery />
        <Order />
        <Contacts />
      </main>
      <Footer />
      <Modal open={!!model} onClose={close} eyebrow="Заявка на модель" title={model}>
        <OrderModalForm model={model} onDone={close} />
      </Modal>
    </>
  );
}
