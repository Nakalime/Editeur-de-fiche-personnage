const CACHE = 'fiche-perso-v2';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './assets/fond-algranir.jpg',
  './assets/icon.svg',
  './js/01-model.js',
  './js/02-render.js',
  './js/03-drag.js',
  './js/04-props-panel.js',
  './js/05-editor.js',
  './js/06-persistence.js',
  './js/07-init.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
