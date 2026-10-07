# KIY - лендинг (React + Vite)

## Запуск для разработки
    npm install
    npm run dev        # сайт: http://localhost:5173
    npm run php        # в соседнем терминале - чтобы работали формы (send.php)

## Сборка для хостинга
    npm run build      # результат в папке dist/ - залить её содержимое на хостинг

Хостинг: любой с PHP 7.4+ и cURL (send.php отправляет заявки в Telegram).

## Где что менять
- Весь контент (тексты, товары, цены, контакты, меню): `src/data.js`
- Фото: положить в `public/images/`, указать путь в `src/data.js` (напр. `images/hero.jpg`)
- Цвета и шрифты: `src/styles.css`, блок `:root` (файл одинаковый в обоих сайтах)
- Логотип: `public/brand/`
- Telegram-бот: `public/config.php` (bot_token, chat_id)
- SEO-теги, Google Analytics, Яндекс Метрика: `index.html`

## Структура
- `src/components/ui.jsx`, `Header`, `Logo`, `Contacts`, `Modal` - общие для обоих сайтов
- `src/components/Sections.jsx` - секции этого лендинга
- `src/lib/` - иконки, отправка форм, маска телефона, анимация появления
