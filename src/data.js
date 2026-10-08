// =========================================================
// ВЕСЬ КОНТЕНТ САЙТА - редактировать здесь
// =========================================================

export const site = {
  brand: 'Billiard Stars',
  since: 'с 2014 года',
  utility: [
    { href: '#tables', label: 'Каталог' },
    { href: '#order', label: 'Заявка / Расчёт' },
    { href: '#configurator', label: 'Конфигуратор' },
  ],
  langs: ['Ru', 'Uz', 'En'],
  nav: [
    { href: '#universes', label: 'Коллекции', img: 'images/premium.webp' },
    { href: '#process', label: 'Как мы создаём', img: 'images/consult.webp' },
    { href: '#atelier', label: 'Мастерская', img: 'images/gallery-3.webp' },
    { href: '#tables', label: 'Столы', img: 'images/exclusive.webp' },
    { href: '#bespoke', label: 'На заказ', img: 'images/premium-plus.webp' },
    { href: '#projects', label: 'Проекты', img: 'images/gallery-1.webp' },
    { href: '#contacts', label: 'Контакты', img: 'images/gallery-5.webp' },
  ],
  contacts: {
    address: 'г. Ташкент, ул. Примерная, 1',
    phones: ['+998 90 000-00-00', '+998 91 000-00-00'],
    email: 'hello@billiardstars.uz',
    hours: 'Пн–Сб: 9:00 – 19:00',
    socials: [
      { label: 'Telegram', url: 'https://t.me/username' },
      { label: 'WhatsApp', url: 'https://wa.me/998900000000' },
      { label: 'Instagram', url: 'https://instagram.com/username' },
    ],
  },
};

export const hero = {
  photo: 'images/hero.webp',
  kicker: 'Мастерская столов на заказ — ' + site.since,
  title: ['Столы на заказ,', 'созданные для вас'],
  text: 'Проектируем и изготавливаем бильярдные столы под ваш интерьер: размер, порода дерева, цвет сукна и каждая деталь отделки — по вашему выбору.',
};

// Манифест над сеткой коллекций
export const manifesto = 'Billiard Stars создаёт бильярдные столы на заказ. Каждый проект начинается с вашего пространства и вашего вкуса, а заканчивается столом, который невозможно повторить: он рассчитан на десятилетия игры и переходит из поколения в поколение.';

// Коллекции (сетка карточек). art - линейная иллюстрация из components/LineArt.jsx
export const universes = [
  { title: 'Русский бильярд', img: 'images/classic.webp', art: 'russian' },
  { title: 'Американский пул', img: 'images/pool.webp', art: 'pool' },
  { title: 'Снукер', img: 'images/premium.webp', art: 'snooker' },
  { title: 'Столы-трансформеры', img: 'images/home.webp', art: 'dining' },
  { title: 'Дизайнерские проекты', img: 'images/premium-plus.webp', art: 'designer' },
  { title: 'Игровые столы', img: 'images/exclusive.webp', art: 'games' },
  { title: 'Реставрация', img: 'images/gallery-3.webp', art: 'restore' },
  { title: 'Аксессуары', img: 'images/gallery-6.webp', art: 'accessories' },
];

// Процесс изготовления на заказ
export const steps = [
  { title: 'Знакомство и замер', text: 'Встречаемся в шоуруме или у вас, замеряем помещение и обсуждаем, как будет использоваться стол.', img: 'images/gallery-2.webp' },
  { title: 'Эскиз и 3D-визуализация', text: 'Дизайнер готовит эскиз и фотореалистичную визуализацию стола в вашем интерьере.', img: 'images/premium-plus.webp' },
  { title: 'Выбор материалов', text: 'Порода дерева, тонировка, сукно, фурнитура, лузы — вы трогаете образцы и выбираете каждую деталь.', img: 'images/exclusive.webp' },
  { title: 'Изготовление', text: 'Мастера вручную собирают стол из массива: от 6 до 10 недель, фотоотчёт на каждом этапе.', img: 'images/consult.webp' },
  { title: 'Доставка и калибровка', text: 'Привозим, собираем и выверяем плиту с точностью до десятой миллиметра. Первая партия — вместе с вами.', img: 'images/gallery-5.webp' },
];

export const atelier = {
  eyebrow: 'Мастерская',
  title: 'Каждый стол собирается вручную',
  text: 'От отбора массива до финальной калибровки сланцевой плиты — каждый этап проходит через руки мастера. Мы не торопимся: на изготовление одного стола уходит от шести недель, и именно поэтому он служит поколениям.',
  photo: 'images/consult.webp',
  stats: [
    { value: 10, suffix: '+', label: 'лет опыта' },
    { value: 650, suffix: '', label: 'столов установлено' },
    { value: 5, suffix: ' лет', label: 'гарантии' },
  ],
};

// Столы: price - число (сум) или null -> "Цена по запросу"
export const products = [
  { id: 'classic', name: 'Classique', type: 'Русский бильярд · 12 ft', price: 85000000, img: 'images/classic.webp' },
  { id: 'premium', name: 'Royale', type: 'Русский бильярд · 12 ft', price: 110000000, img: 'images/premium.webp' },
  { id: 'exclusive', name: 'Étoile', type: 'Ценные породы · 12 ft', price: null, img: 'images/exclusive.webp' },
  { id: 'premium-plus', name: 'Noir', type: 'Дуб и металл · 12 ft', price: null, img: 'images/premium-plus.webp' },
  { id: 'pool', name: 'Pool Pro', type: 'Американский пул · 9 ft', price: 38000000, img: 'images/pool.webp' },
  { id: 'home', name: 'Salon', type: 'Пул / обеденный стол · 8 ft', price: null, img: 'images/home.webp' },
];

export const bespoke = {
  eyebrow: 'Индивидуальный проект',
  title: 'Стол, созданный только для вас',
  text: 'Выберите породу дерева, цвет сукна, форму ножек и фурнитуру. Наши дизайнеры подготовят визуализацию и согласуют каждую деталь, прежде чем мастерская приступит к работе.',
  slides: [
    { img: 'images/exclusive.webp', label: 'Американский орех' },
    { img: 'images/premium.webp', label: 'Морёный дуб' },
    { img: 'images/premium-plus.webp', label: 'Чёрный лак и латунь' },
    { img: 'images/classic.webp', label: 'Светлый ясень' },
  ],
};

export const projects = [
  { sector: 'Клубы', title: 'Бильярдный клуб, 14 столов', img: 'images/gallery-1.webp' },
  { sector: 'Отели', title: 'Лаунж-зона гранд-отеля', img: 'images/gallery-2.webp' },
  { sector: 'Частный дом', title: 'Игровая комната в загородной резиденции', img: 'images/gallery-3.webp' },
  { sector: 'Рестораны', title: 'Бар с залом для пула', img: 'images/gallery-4.webp' },
  { sector: 'Архитекторы', title: 'Пентхаус: стол в чёрном лаке', img: 'images/gallery-5.webp' },
  { sector: 'Корпоративный', title: 'Зона отдыха штаб-квартиры', img: 'images/gallery-6.webp' },
];

export const reviews = [
  { text: 'Стол стал главным предметом гостиной. Мастера учли всё — от цвета сукна до высоты светильника.', name: 'Алишер К.', role: 'Частный клиент' },
  { text: 'Оснастили клуб под ключ: планировка, 14 столов, свет. Сроки соблюдены до дня.', name: 'Дмитрий С.', role: 'Владелец клуба' },
  { text: 'Редкий уровень сервиса. Через год приехали на бесплатную перетяжку и калибровку.', name: 'Нигора Р.', role: 'Ресторатор' },
  { text: 'Работали по нашему дизайн-проекту — результат превзошёл визуализацию.', name: 'Студия A.R.', role: 'Архитектурное бюро' },
];

export const faq = [
  { q: 'Сколько времени занимает изготовление стола?', a: 'Серийные модели — от 3 недель, индивидуальные проекты — от 6 до 10 недель в зависимости от сложности отделки.' },
  { q: 'Какое помещение нужно для стола 12 футов?', a: 'Для комфортной игры рекомендуем зону не менее 6,7 × 5,0 м. Мы бесплатно поможем рассчитать планировку по вашему плану.' },
  { q: 'Входит ли доставка и установка в стоимость?', a: 'Да, по Ташкенту доставка, сборка и калибровка включены. В регионы — по тарифу перевозчика, установка нашими мастерами.' },
  { q: 'Какая гарантия на столы?', a: 'До 5 лет на конструкцию и плиту. Первая перетяжка сукна и повторная калибровка в течение года — бесплатно.' },
  { q: 'Можно ли выбрать цвет сукна и породу дерева?', a: 'Конечно. В конфигураторе доступно более 20 оттенков сукна и 8 пород дерева, а для эксклюзивных проектов — любые материалы.' },
];

export const service = [
  { title: 'Персональный консультант', text: 'Один специалист ведёт ваш проект от первого звонка до первой партии и остаётся на связи после.', img: 'images/gallery-2.webp' },
  { title: 'Сервис на годы', text: 'Перетяжка сукна, калибровка, реставрация — мы заботимся о столе так же, как в день установки.', img: 'images/gallery-4.webp' },
];
