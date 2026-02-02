const CACHE_NAME = 'czh-v1';

// Все страницы вашего сайта
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
  '/router.js',
  '/sync.js',
  '/firebase-config.js',
  
  // CSS
  // '/styles.css' // если у вас отдельный CSS
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кеширование файлов');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кеша или загружаем
        return response || fetch(event.request)
          .then(fetchResponse => {
            // Кешируем новые запросы
            return caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
              });
          });
      })
      .catch(() => {
        // Офлайн-страница
        return caches.match('/offline.html');
      })
  );
});
