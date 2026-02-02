// sw.js - исправленная версия
const CACHE_NAME = 'czh-v1';

// Файлы для кеширования (только GET-запросы)
const urlsToCache = [
  '/',
  '/index.html',
  '/feed.html',
  '/chats.html',
  '/profile.html',
  '/profile-settings.html',
  '/admin.html',
  
  // PWA файлы
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  
  // JS файлы
  '/sync.js',
  '/firebase-config.js',
  '/fix_profile_models.js'
];

// Установка - кешируем статические файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кеширование статических файлов');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация - чистим старые кеши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов - ИГНОРИРУЕМ POST-запросы!
self.addEventListener('fetch', event => {
  // Игнорируем POST-запросы (формы авторизации)
  if (event.request.method === 'POST') {
    return; // Пусть проходит напрямую к серверу
  }
  
  // Игнорируем запросы к Firebase
  if (event.request.url.includes('firebase') || 
      event.request.url.includes('googleapis')) {
    return;
  }
  
  // Только для GET-запросов и статических файлов
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кеша
        if (response) {
          return response;
        }
        
        // Загружаем с сети
        return fetch(event.request)
          .then(fetchResponse => {
            // Кешируем ТОЛЬКО если это успешный ответ и не API-запрос
            if (fetchResponse.ok && 
                event.request.url.startsWith(self.location.origin) &&
                !event.request.url.includes('/api/')) {
              const responseToCache = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Офлайн-страница
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
            return new Response('Офлайн', { status: 503 });
          });
      })
  );
});
