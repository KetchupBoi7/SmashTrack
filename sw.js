/* SmashTrack offline cache.
   The whole app is one file, so there is very little to keep: the page, the
   manifest and the two icons. Change VERSION every time you upload a new
   index.html, or browsers that already have the site keep showing the old copy. */
const VERSION = 'smashtrack-2026-10-20';
const SHELL = ['./', './index.html', './privacy.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];

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

/* Opening a page: try the network first so a new upload is picked up, and
   fall back to the saved copy when there is no signal. The app itself is kept
   as ./index.html whichever address it was opened at; other pages (the privacy
   page) are kept under their own address. Only good responses are saved, so
   an error page can never replace the app. Everything else comes from the
   cache first. */
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;

  if(req.mode === 'navigate'){
    const path = new URL(req.url).pathname;
    const isApp = path.endsWith('/') || path.endsWith('/index.html');
    const key = isApp ? './index.html' : req;
    e.respondWith(
      fetch(req)
        .then(res => {
          if(res && res.status === 200){
            const copy = res.clone();
            caches.open(VERSION).then(c => c.put(key, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(key).then(r => r || caches.match('./index.html')))
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
