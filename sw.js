const CACHE_VERSION = "2024-08-26 1:11 PM";

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll([
          "/",
          "/index.html",
          "/practice.html",
          "/style.css",
          "/font.css",
          "/main.js",
          "/sw.js",

          "/icon.png",
          "/manifest.json",

          "/svg/grade.svg",
          "/svg/backspace.svg",
          "/svg/keyboard_capslock.svg",
          "/svg/keyboard_return.svg",
          "/svg/keyboard_tab.svg",
          "/svg/menu.svg",
          "/svg/space_bar.svg",
          "/svg/speed.svg",
          "/svg/grid_view.svg",

          "/hand/lhand a.png",
          "/hand/lhand d.png",
          "/hand/lhand f.png",
          "/hand/lhand s.png",
          "/hand/lhand.png",

          "/hand/rhand _.png",
          "/hand/rhand j.png",
          "/hand/rhand k.png",
          "/hand/rhand l.png",
          "/hand/rhand.png",

          "/fonts/RobotoMono-Bold.ttf",
          "/fonts/RobotoMono-Italic.ttf",
          "/fonts/RobotoMono-Light.ttf",
      ]);
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
