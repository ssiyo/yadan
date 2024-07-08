const CACHE_VERSION = "2024-07-07 10:20 PM";

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/main.js',
        '/sw.js',

        '/icon.png',
        '/manifest.json',

        '/svg/kofi_stroke_cup.svg',
        '/svg/grade_black_24dp.svg',
        '/svg/backspace_black_24dp.svg',
        '/svg/keyboard_capslock_black_24dp.svg',
        '/svg/keyboard_return_black_24dp.svg',
        '/svg/keyboard_tab_black_24dp.svg',
        '/svg/menu_black_24dp.svg',
        '/svg/space_bar_black_24dp.svg',
        '/svg/speed_black_24dp.svg',
        '/svg/window_black_24dp.svg',
      ])
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
