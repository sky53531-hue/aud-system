var CACHE = 'aud-v1';
var SHELL = ['./index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  // API 請求不快取，直接走網路
  if (e.request.url.indexOf('twelvedata.com') >= 0) return;
  if (e.request.url.indexOf('tradingview.com') >= 0) return;
  if (e.request.url.indexOf('tradingview.com') >= 0) return;

  // HTML 頁面：網路優先，離線才用快取
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  // 其他資源：快取優先
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    })
  );
});
