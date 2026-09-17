// Caches the app shell on install so the app opens even with zero connectivity.
// All actual data lives in IndexedDB (see index.html), never in this cache —
// this only makes the app's own code available offline.
var CACHE_NAME = 'parade-state-v1';
var SHELL_FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_NAME; }).map(function (n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

// Cache-first for the app shell, falling back to network — this app has no
// server API to worry about, so there's no dynamic request caching to do.
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        return response;
      }).catch(function () {
        // Offline and not cached — for navigations, fall back to the cached shell.
        if (event.request.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
