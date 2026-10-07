import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // относительные пути: сайт работает из любой папки на хостинге
  server: {
    // В dev-режиме send.php выполняет PHP-сервер: npm run php (порт 8000)
    proxy: { '/send.php': 'http://127.0.0.1:8000' },
  },
});
