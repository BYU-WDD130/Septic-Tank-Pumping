const CACHE_NAME = 'utah-septic-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/saratoga-springs/',
  '/goshen/',
  '/mona/',
  '/nephi/'
];

// 1. Evento de Instalación: Guarda en caché los recursos estáticos principales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precachifying App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Evento de Activación: Limpia cachés antiguas si actualizas la versión del sitio
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

// 3. Evento Fetch: Intercepta las peticiones de red (Estrategia Cache-First con fallback a red)
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET (como envíos de formularios o webhooks)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Devuelve el recurso de la caché y actualiza en segundo plano de manera silenciosa
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {
          // Fallo de red ignorado intencionalmente; se usa caché sin conexión
        });
        return cachedResponse;
      }

      // Si no está en caché, va a la red directamente
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Opcional: Podrías retornar una página HTML de "Sin conexión" si el usuario está completamente offline
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});