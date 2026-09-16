const CACHE_NAME = 'tzeptosoft-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/comments.css',
  '/assets/js/search.js',
  '/assets/js/comments.js',
  '/assets/js/sw-register.js',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes('firebaseio.com')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            return cachedResponse || Response.error();
          });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
