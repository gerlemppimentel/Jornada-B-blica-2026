const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `jornada-biblica-${CACHE_VERSION}`;

// Assets to precache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install event: Precache core assets and skip waiting
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing version:', CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Strategy implementation
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Navigation Strategy (HTML): Network-first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache with the fresh version
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('/index.html') || caches.match(event.request))
    );
    return;
  }

  // 2. Assets Strategy (JS, CSS, Images): Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});