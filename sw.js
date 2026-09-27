// Victoria 2026 Trip App — Service Worker
// ⚠️ BUMP CACHE_NAME ON EVERY DEPLOY that touches index.html, sw.js, or anything
// in ASSETS_TO_CACHE. Without the bump, installed PWAs keep serving the old copy.
// (The #1 "it's not updating on my phone" bug in the London app.)
const CACHE_NAME = 'victoria-2026-v1';

// Only list files that EXIST — cache.addAll() fails the whole install on one 404.
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap'
];

// Never cache these: live data must stay live, and the version check must see the deployed sw.js.
// (London cached every GET 200 — so the Open-Meteo response and every sw.js?nocache=… got
// stored and served cache-first. Fixed here from day one.)
const NETWORK_ONLY = [
  url => url.hostname === 'api.open-meteo.com',
  url => url.pathname.endsWith('/sw.js')
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (NETWORK_ONLY.some(test => test(url))) return; // browser handles it; page code has offline fallbacks

  // Cache-first, with navigation fallback to index.html (ignoreSearch so ?source=pwa etc. still hit)
  event.respondWith(
    caches.match(req, { ignoreSearch: req.mode === 'navigate' }).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Runtime-cache same-origin files and Google Fonts (font files load on first view)
        const cacheable = res.status === 200 &&
          (url.origin === self.location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com'));
        if (cacheable) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./index.html');
      });
    })
  );
});
