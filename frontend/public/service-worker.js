const APP_CACHE = "app-shell-v1";
const IMAGE_CACHE = "image-cache-v1"; //POI IMAGES
// const TILE_CACHE = "map-tiles-v1"; //MAP TILES


const APP_SHELL = [
    "/",
    "/index.html"
]

// Install: cache app shell
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(APP_CACHE).then((cache) => {
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
                    .filter((key) => ![APP_CACHE, IMAGE_CACHE].includes(key))
                    .map((key) => caches.delete(key))
            ))
    )
    self.clients.claim();
})

// Fetch: serve cache first, fallback to network
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // IMAGE CACHE LOGIC
    if (url.pathname.startsWith("/api/place-photo")) {
        event.respondWith(handleImageRequest(request));
        return;
    }

    // MAP TILE CACHE LOGIC
    // if (url.hostname.includes("tile.thunderforest.com") || url.hostname.includes("basemaps.cartocdn.com")) {
    //     event.respondWith(cacheMapTile(request));
    //     return;
    // }

    // APP SHELL CACHE
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request);
        })
    )
})

// IMAGE CACHE HELPER
async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);

    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
            limitCacheSize(IMAGE_CACHE, 150);
        }
        return response;
    } catch (error) {
        return new Response("", { status: 404 });
    }
}


// async function cacheMapTile(request) {
//     const cache = await caches.open(TILE_CACHE);

//     const cached = await cache.match(request);
//     if (cached) return cached;

//     try {
//         const response = await fetch(request);
//         if (response.ok) {
//             cache.put(request, response.clone());
//             limitCacheSize(TILE_CACHE, 600);
//         }
//         return response;
//     } catch (error) {
//         return new Response("", { status: 404 });
//     }
// }


async function limitCacheSize(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    if (keys.length > maxItems) {
        await cache.delete(keys[0]); // oldest entry
        limitCacheSize(cacheName, maxItems);
    }

}