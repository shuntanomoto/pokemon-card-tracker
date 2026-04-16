const CACHE_NAME = 'pokeca-tracker-v1';
const ASSETS = [
  '/pokemon-card-tracker/',
  '/pokemon-card-tracker/index.html',
  '/pokemon-card-tracker/manifest.json',
  '/pokemon-card-tracker/icon.svg',
  '/pokemon-card-tracker/icon-192.png',
  '/pokemon-card-tracker/icon-512.png',
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// キャッシュファースト戦略（オフライン対応）
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('/pokemon-card-tracker/'));
    })
  );
});
