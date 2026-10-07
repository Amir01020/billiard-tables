// =========================================================
// ВЕСЬ КОНТЕНТ САЙТА - редактировать здесь
// =========================================================

export const site = {
  brand: 'KIY',
  logoSize: [167, 44], // размеры логотипа в шапке (public/brand/logo.svg)
  tagline: ['Бильярдные столы', 'для клуба и дома'],
  headerCta: 'Оставить заявку',
  nav: [
    { href: '#catalog', label: 'Столы', footer: true },
    { href: '#consult', label: 'Решения для клуба' },
    { href: '#conditions', label: 'Доставка и установка', footer: true },
    { href: '#gallery', label: 'Проекты', footer: true },
    { href: '#contacts', label: 'Контакты', footer: true },
  ],
  contacts: {
    eyebrow: 'Шоурум',
    addressLabel: 'Адрес',
    address: 'г. Ташкент, ул. Примерная, 1',
    phones: ['+998 90 000-00-00', '+998 91 000-00-00'],
    email: '',
    hours: 'Пн-Сб: 9:00 - 19:00',
    mapQuery: 'Tashkent',
    socials: [
      { label: 'Telegram', url: 'https://t.me/username' },
      { label: 'WhatsApp', url: 'https://wa.me/998900000000' },
      { label: 'Instagram', url: 'https://instagram.com/username' },
    ],
  },
};

export const hero = {
  eyebrow: 'Ваш клуб. Наша экспертиза.',
  titleStart: 'Бильярдные столы ',
  titleAccent: 'премиум-класса',
  titleEnd: ' для клуба и дома',
  text: 'Профессиональные столы, подбор под ваше помещение и сопровождение на всех этапах - от планировки до первой партии.',
  photo: 'images/hero.webp', // путь к фото, напр. 'images/hero.jpg' (в папке public). Пусто -> иллюстрация
  features: [
    { icon: 'sliders', text: ['Подбор оборудования', 'под ваш формат и бюджет'] },
    { icon: 'layout', text: ['Помощь в планировке', 'и расстановке столов'] },
    { icon: 'truck', text: ['Доставка, сборка,', 'гарантия'] },
  ],
};

// Каталог: до 6 позиций.
// price: число (сум) или null -> "Цена по запросу"
// images: фото из папки public, напр. ['images/classic-1.jpg', 'images/classic-2.jpg']. Пусто -> иллюстрация
// wood: цвет дерева для иллюстрации
export const products = [
  { id: 'classic', tag: 'Классика', name: 'Классический', size: '12 ft (3,66 x 1,83 м)', game: 'Русский бильярд', material: 'Массив ясеня', cloth: 'Simonis / Tournament', price: 85000000, wood: '#8a5a32', images: ['images/classic.webp'] },
  { id: 'premium', tag: 'Премиум', name: 'Премиум', size: '12 ft (3,66 x 1,83 м)', game: 'Русский бильярд', material: 'Массив дуба', cloth: 'Simonis / Tournament', price: 110000000, wood: '#6b3418', images: ['images/premium.webp'] },
  { id: 'exclusive', tag: 'Эксклюзив', name: 'Эксклюзив', size: '12 ft (3,66 x 1,83 м)', game: 'Русский бильярд', material: 'Ценные породы дерева', cloth: 'Simonis / Tournament', price: null, wood: '#3b2116', images: ['images/exclusive.webp'] },
  { id: 'premium-plus', tag: 'Премиум+', name: 'Премиум+', size: '12 ft (3,66 x 1,83 м)', game: 'Русский бильярд', material: 'Массив дуба / металл', cloth: 'Simonis / Tournament', price: null, wood: '#1d1f22', images: ['images/premium-plus.webp'] },
  { id: 'pool', tag: 'Пул', name: 'Pool Pro', size: '9 ft (2,54 x 1,27 м)', game: 'Американский пул', material: 'Сланец 25 мм, МДФ', cloth: 'Iwan Simonis 860', price: 38000000, wood: '#2a2a2e', images: ['images/pool.webp'] },
  { id: 'home', tag: 'Для дома', name: 'Трансформер', size: '8 ft (2,24 x 1,12 м)', game: 'Пул / обеденный стол', material: 'Массив, столешница', cloth: 'Norba Club', price: null, wood: '#a0703f', images: ['images/home.webp'] },
];

export const consult = {
  eyebrow: 'Для предпринимателей',
  title: ['Не знаете,', 'с чего начать?'],
  text: 'Поможем спланировать бильярдный клуб с учётом площади, бюджета и вашей аудитории.',
  listTitle: 'Мы подскажем:',
  list: [
    'сколько столов разместить на вашей площади',
    'какую модель выбрать под формат клуба',
    'какое расстояние оставить между столами',
    'какие светильники и комплектующие подойдут',
    'какой будет ориентировочная стоимость оснащения',
  ],
  photo: 'images/consult.webp', // фото слева. Пусто -> иллюстрация
  formTitle: 'Оставьте площадь помещения - рассчитаем оптимальную конфигурацию.',
};

export const advantages = [
  { icon: 'award', text: ['Опыт в оснащении', 'бильярдных клубов', 'более 10 лет'] },
  { icon: 'factory', text: ['Собственное производство', 'и прямые поставки', 'от ведущих брендов'] },
  { icon: 'shield', text: ['Гарантия на столы', 'и комплектующие', 'до 5 лет'] },
  { icon: 'support', text: ['Поддержка', 'на всех этапах', 'от идеи до открытия'] },
];

export const steps = [
  { title: 'Заказ', text: 'Оставляете заявку, менеджер уточняет модель, размер и комплектацию.' },
  { title: 'Оплата', text: 'Наличный и безналичный расчёт. Предоплата - по договорённости.' },
  { title: 'Доставка', text: 'По Ташкенту - бесплатно, по регионам - по тарифу перевозчика.' },
  { title: 'Установка', text: 'Сборка, выравнивание и калибровка стола нашими мастерами за 1 день.' },
];

// Галерея: { src: 'images/gallery-1.jpg', wide: true }. Пустой src -> плейсхолдер
export const gallery = [
  { src: 'images/gallery-1.webp', wide: true }, { src: 'images/gallery-2.webp' }, { src: 'images/gallery-3.webp' },
  { src: 'images/gallery-4.webp' }, { src: 'images/gallery-5.webp', wide: true }, { src: 'images/gallery-6.webp' },
];
