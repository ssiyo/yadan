const CACHE_VERSION = "2024-10-29 16:34";
localStorage.setItem("CACHE_VERSION", CACHE_VERSION)

// cache files list
const cf = [
    "/",
	"/font.css",
	"/style.css",

	"/index.html",
	"/practice.html",

	"/main.js",
	"/register-sw.js",
	"/sw.js",

	"/icon.png",
	"/hand/lhand a.png",
	"/hand/lhand d.png",
	"/hand/lhand f.png",
	"/hand/lhand s.png",
	"/hand/lhand.png",
	"/hand/rhand j.png",
	"/hand/rhand k.png",
	"/hand/rhand l.png",
	"/hand/rhand _.png",
	"/hand/rhand.png",

	"/svg/backspace.svg",
	"/svg/grade.svg",
	"/svg/grid_view.svg",
	"/svg/keyboard_capslock.svg",
	"/svg/keyboard_return.svg",
	"/svg/keyboard_tab.svg",
	"/svg/menu.svg",
	"/svg/space_bar.svg",
	"/svg/speed.svg",

	"/fonts/RobotoMono-Bold.ttf",
	"/fonts/RobotoMono-Italic.ttf",
	"/fonts/RobotoMono-Light.ttf",

];
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(async (cache) => {
            console.log("ServiceWorker: Caching files:", cf.length, cf);
            try {
                cachedResult = await cache.addAll(cf);
            } catch (err) {
                console.error("sw: cache.addAll");
                for (let f of cf) {
                    try {
                        cachedResult = await cache.add(f);
                    } catch (err) {
                        console.warn("sw: cache.add", f);
                    }
                }
            }
            console.log("ServiceWorker: caching ended");

            return cachedResult;
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});