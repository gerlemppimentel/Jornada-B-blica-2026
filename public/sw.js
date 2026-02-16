// Service Worker básico para permitir a instalação do PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estratégia de rede apenas para manter o PWA funcional como instalável
  event.respondWith(fetch(event.request));
});