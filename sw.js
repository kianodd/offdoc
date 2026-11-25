/* Docs Capsules service worker — build: 1.0.0 */
const CACHE = 'docs-capsules-v1.0.0';
const SHELL = [
  './', './index.html', './manifest.webmanifest', './version.json',
  './css/style.css', './js/app.js', './js/version.js',
  './js/vendor/jszip.min.js', './js/vendor/marked.min.js',
  './js/vendor/highlight.min.js', './js/vendor/highlight.css', './js/vendor/highlight-dark.css',
  './fonts/Vazirmatn-Regular.woff2', './fonts/Vazirmatn-Bold.woff2',
  './icons/icon-192.png', './icons/icon-512.png',
  './capsules/index.json'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Never cache capsule zip files: they are loaded by the user, session-only.
  if (url.pathname.endsWith('.zip')) return;
  // version.json must always be fresh for the update check.
  if (url.pathname.endsWith('version.json')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res && res.ok && url.origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
