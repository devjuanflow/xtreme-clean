self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('xtreme-clean-v2').then((cache) => { // Cambiado de v1 a v2
        return cache.addAll([
            '/',
            '/admin/login',
            '/admin'
        ]);
        })
    );
    });

    self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
            if (cacheName !== 'xtreme-clean-v2') {
                return caches.delete(cacheName); // Borra la caché vieja
            }
            })
        );
        })
    );
    });

    self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
        })
    );
});