// Caches the app shell so it still opens with zero connectivity. All actual
// data lives in IndexedDB (see index.html), never in this cache — this only
// makes the app's own code available offline.
//
// Network-first, not cache-first: every load tries the network before
// falling back to whatever was last cached. This matters because a
// cache-first strategy would keep serving the very first version ever
// installed forever, even after a fresh deploy (e.g. pushing an update to
// GitHub Pages) — the only way out would be manually clearing site data or
// an incognito window. Network-first means a normal reload always picks up
// the latest deploy when there's connectivity, and only falls back to the
// cached version when there genuinely isn't any.
var CACHE_NAME = 'parade-state-shell-v1';
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

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      return response;
    }).catch(function () {
      // Offline — fall back to whatever was cached from the last successful load.
      return caches.match(event.request).then(function (cached) {
        return cached || (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined);
      });
    })
  );
});
