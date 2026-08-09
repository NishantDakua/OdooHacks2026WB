const SHELL_CACHE_NAME = "rentease-shell-v2";
const IMAGE_CACHE_NAME = "rentease-images-v1";

// Static assets to precache for App Shell
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/main.css",
];

// Install event - Precache App Shell static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - Purge obsolete cache buckets
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== SHELL_CACHE_NAME &&
            cacheName !== IMAGE_CACHE_NAME
          ) {
            console.log("[Service Worker] Deleting obsolete cache:", cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Serve static assets and public images from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. DO NOT cache non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // 2. EXCLUDE all backend API routes from Service Worker caching
  if (url.pathname.includes("/api/")) {
    return;
  }

  // 3. Image caching strategy (Cloudinary / Unsplash static images)
  if (
    request.destination === "image" ||
    url.hostname.includes("cloudinary.com") ||
    url.hostname.includes("images.unsplash.com")
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              cache.put(request, responseToCache);
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. App Shell & Static Asset caching strategy (Stale-While-Revalidate)
  if (
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(SHELL_CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })
    );
  }
});
