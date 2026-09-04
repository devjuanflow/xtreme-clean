self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('xtreme-clean-v1').then((cache) => {
        return cache.addAll([
            '/',
            '/admin/login',
            '/admin'
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