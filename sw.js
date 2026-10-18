/* SmashTrack offline cache.
   The whole app is one file, so there is very little to keep: the page, the
   manifest and the two icons. Change VERSION every time you upload a new
   index.html, or browsers that already have the site keep showing the old copy. */
const VERSION = 'smashtrack-2026-10-18';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => c.addAll(SHELL).catch(() => c.add('./')))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Opening the page: try the network first so a new upload is picked up, and
   fall back to the saved copy when there is no signal. Everything else comes
   from the cache first. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;

  if(req.mode === 'navigate'){
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if(res && res.status === 200 && res.type === 'basic'){
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => hit))
  );
});
