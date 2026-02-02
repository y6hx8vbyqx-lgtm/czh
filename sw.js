// Имя кеша
const CACHE_NAME = 'v1';

// Файлы для кеширования
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/icon-192.png',
  '/icon-512.png'
];

// Установка service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Активация
self.addEventListener('activate', event => {
  // Удаляем старые кеши
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
