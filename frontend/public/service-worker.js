const CACHE_NAME = "app-shell-v1";

const APP_SHELL = [
    "/",
    "/index.html"
]

// Install: cache app shell
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(APP_SHELL);
        })
    )
    self.skipWaiting();
})

// Activate: clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => 
        Promise.all(
            keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        ))
    )
    self.clients.claim();
})

// Fetch: serve cache first, fallback to network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request);
        })
    )
})