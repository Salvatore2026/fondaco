// Fondaco — service worker: il gioco funziona anche senza rete
const CACHE = 'fondaco-1.0.0';
const CORE = ['./', './index.html', './privacy.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './fonts/alegreya-sc-latin-500-normal.woff2', './fonts/alegreya-sc-latin-700-normal.woff2', './fonts/alegreya-sans-latin-400-normal.woff2', './fonts/alegreya-sans-latin-500-normal.woff2', './fonts/alegreya-sans-latin-700-normal.woff2', './fonts/alegreya-sans-latin-800-normal.woff2', './fonts/alegreya-latin-700-italic.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res; })));
  } else if (url.host.endsWith('fonts.googleapis.com') || url.host.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => hit || fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit))));
  }
});
