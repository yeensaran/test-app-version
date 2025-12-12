self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker 🤙');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated 🤙');
  clients.claim();
});
