// GitStack Radar Service Worker
const CACHE_NAME = 'gitstack-radar-v1';
const OFFLINE_URL = '/';

// Essential resources to cache (only files that definitely exist)
const ESSENTIAL_RESOURCES = [
  OFFLINE_URL,
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching essential resources including PNG icons');
      return cache.addAll(ESSENTIAL_RESOURCES)
        .then(() => {
          console.log('[SW] All essential resources cached successfully');
          console.log('[SW] PNG icons cached - PWA installability requirements met');
        })
        .catch((error) => {
          console.error('[SW] Cache installation failed:', error);
          throw error;
        });
    })
  );
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('[SW] Service worker activated');
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Message event - handle commands from the page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Skip webpack hot module replacement
  if (event.request.url.includes('webpack')) return;
  if (event.request.url.includes('hot-update')) return;
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone response to cache it
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || caches.match(OFFLINE_URL);
        });
      })
  );
});
