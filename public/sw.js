const CACHE_NAME = 'day1health-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon.svg',
  // Add other critical assets (do not include source files like /src/main.tsx)
];

// Bump the cache to invalidate old entries when deploying
const CACHE_NAME_NEXT = 'day1health-v3';

self.addEventListener('install', event => {
  // Take over as soon as installed
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME_NEXT).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET over http/https to avoid chrome-extension and other schemes
  if (request.method !== 'GET') return;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Strategy selection
  const isNavigation = request.mode === 'navigate' || (request.destination === 'document');
  const isApi = url.pathname.startsWith('/api') || request.headers.get('accept')?.includes('application/json');
  const isStatic = (
    // You may adjust these globs to your build output
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(?:css|js|woff2?|ttf|eot|png|jpg|jpeg|gif|svg|webp|ico)$/)
  );

  // Network-first for navigations and API/JSON to prevent stale data
  if (isNavigation || isApi) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        // Optionally cache successful navigations for offline fallback
        if (fresh && fresh.ok && isNavigation) {
          const cache = await caches.open(CACHE_NAME_NEXT);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (_) {
        // Fallback to cache when offline
        const cached = await caches.match(request);
        if (cached) return cached;
        // Last resort: return offline shell if available
        if (isNavigation) return caches.match('/index.html');
        throw _;
      }
    })());
    return;
  }

  // Cache-first for static assets
  if (isStatic) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME_NEXT);
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) {
        try { await cache.put(request, response.clone()); } catch (_) {}
      }
      return response;
    })());
    return;
  }

  // Default: network-first then cache fallback
  event.respondWith((async () => {
    try {
      const res = await fetch(request);
      return res;
    } catch (_) {
      const cached = await caches.match(request);
      if (cached) return cached;
      throw _;
    }
  })());
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME_NEXT];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Immediately control clients after activation
  self.clients.claim();
});
