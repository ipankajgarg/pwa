var STATIC = 'staticv4';
var DYNAMIC = 'dynamicv4';

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);

  event.waitUntil(
    caches.open(STATIC).then(cache => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/src/css/app.css',
        '/src/css/feed.css',
        '/src/js/app.js',
        '/src/js/feed.js',
        '/src/images/main-image.jpg',
        '/src/js/material.min.js',
        '/src/js/fetch.js',
        'https://fonts.googleapis.com/css?family=Roboto:400,700',
        'https://fonts.googleapis.com/icon?family=Material+Icons',
        'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
        '/manifest.json',
        '/src/js/promise.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.map(function(name) {
          if (name !== STATIC && name !== DYNAMIC) {
            return caches.delete(name);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

//if we have response in cache then serve data from cache
//else if, fetch data from network
//if both fails then serve offline page
// ------------------------------------------------------------------------
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches
//       .match(event.request)
//       .then(function(response) {
//         return response || fetch(event.request);
//       })
//       .catch(function(err) {
//         return caches.match('/offline.html');
//       })
//   );
// });
// ------------------------------------------------------------------------

//get data from network if it fails then access from cache
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request).catch(function(err) {
//       return caches.match(event.request).then(function(response) {
//         if (response) {
//           return caches.match(event.request);
//         }
//         console.log(response);
//         return caches.match('/offline.html');
//       });
//     })
//   );
// });

//If a request doesn't match anything in the cache, get it from the network,
// send it to the page and add it to the cache at the same time

self.addEventListener('fetch', function(event) {
  if (
    event.request.url.indexOf(
      'https://fonts.googleapis.com/css?family=Roboto:400,700'
    ) > -1
  ) {
    console.log(event.request.url.indexOf, 'true');
  }
  event.respondWith(
    caches.open(DYNAMIC).then(function(cache) {
      return caches
        .match(event.request)
        .then(function(response) {
          return (
            response ||
            fetch(event.request).then(function(response) {
              cache.put(event.request.url, response.clone());
              return response;
            })
          );
        })
        .catch(function(err) {
          return caches.match('offline.html');
        });
    })
  );
});
