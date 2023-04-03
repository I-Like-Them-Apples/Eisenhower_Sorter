self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('goal-prioritizer-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/goal_prioritizer.js',
        '/icon.png'
      ]);
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
