const CACHE_VERSION = 'v2';
const PRECACHE = `precache-${CACHE_VERSION}`;
const RUNTIME = `runtime-${CACHE_VERSION}`;

// Core assets to precache (minified production versions)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.min.css',
  '/script.min.js',
  '/manifest.json',
  '/robots.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== PRECACHE && key !== RUNTIME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Simple runtime caching strategy
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // only handle GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Bypass cross-origin requests except CDN fonts/images
  if (url.origin !== location.origin) {
    // Let analytics and firebase calls go to network (no caching) except gstatic fonts
    if (url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
      event.respondWith(cacheThenNetwork(request));
    }
    return;
  }

  // Images: cache-first
  if (request.destination === 'image' || request.url.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // CSS/JS: network-first so updates propagate, fallback to cache
  if (request.destination === 'script' || request.destination === 'style' || request.url.match(/\.(js|css)$/i)) {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML: network-first
  if (request.destination === '' || request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

});

// Helpers
async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch (e) {
    return cached || Response.error();
  }
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const precached = await caches.open(PRECACHE).then(c => c.match('/index.html'));
    return precached || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheThenNetwork(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then((response) => {
    if (response && response.status === 200) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || networkPromise;
}
