importScripts('/src/js/idb.js');

var STATIC = 'staticv21';
var DYNAMIC = 'dynamicv4';

var dbPromise = idb.open('data', 3, function(database) {
  if (!database.objectStoreNames.contains('posts')) {
    var posts = database.createObjectStore('posts', { keyPath: 'id' });
  }
});

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);

  event.waitUntil(
    caches.open(STATIC).then(cache => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/src/js/idb.js',
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
//
//get data from network if it fails then access from cache

self.addEventListener('fetch', function(event) {
  if (
    event.request.url.indexOf('https://pwagram-e4028.firebaseio.com/posts') > -1
  ) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clonedRes = response.clone();
        clonedRes.json().then(function(data) {
          dbPromise
            .then(function(db) {
              console.log('mydb', db);
              var tx = db.transaction('posts', 'readwrite');
              var store = tx.objectStore('posts');
              console.log(store);
              store.clear().then(function() {
                for (key in data) {
                  store.put(data[key]).then(function() {
                    console.log('adding');
                  });
                }
              });

              return tx.complete;
            })
            .then(function() {
              console.log('data added into indexed db');
            });
        });
        return response;
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(function(err) {
        return caches.match(event.request).then(function(response) {
          if (response) {
            return caches.match(event.request);
          }
          console.log(response);
          return caches.match('/offline.html');
        });
      })
    );
  }
});

self.addEventListener('sync', function(event) {
  console.log('sync event');
  if (event.tag == 'myFirstSync') {
    event.waitUntil(
      dbPromise
        .then(db => {
          var tx = db.transaction('posts', 'readonly');
          var store = tx.objectStore('posts');
          return store.getAll();
        })
        .then(data => {
          console.log('data', data[0]);
          fetch(
            'https://us-central1-pwagram-e4028.cloudfunctions.net/newdata.json',
            {
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              body: JSON.stringify(data[0])
            }
          )
            .then(res => {
              return res.json();
            })
            .then(data => console.log(data))
            .catch(err => console.log(err));
        })
    );
  }

  //
});

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);
  if (action === 'confirm') {
    console.log('confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll().then(function(clis) {
        var client = clis.find(function(c) {
          return c.visibilityState === 'visible';
        });
        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('notification was close', event);
});

self.addEventListener('push', function(event) {
  console.log('push notification received');

  var data = { title: 'New', content: 'something new happened', openUrl: '/' };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  var options = {
    body: data.content,
    icon: '/src/images/icons/app-icon-96x96.png',
    badge: '/src/images/icons/app-icon-96x96.png',
    data: {
      url: data.openUrl
    }
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

//
//If a request doesn't match anything in the cache, get it from the network,
// send it to the page and add it to the cache at the same time

// self.addEventListener('fetch', function(event) {
//   if (
//     event.request.url.indexOf(
//       'https://fonts.googleapis.com/css?family=Roboto:400,700'
//     ) > -1
//   ) {
//     console.log(event.request.url.indexOf, 'true');
//   }
//   event.respondWith(
//     caches.open(DYNAMIC).then(function(cache) {
//       return caches
//         .match(event.request)
//         .then(function(response) {
//           return (
//             response ||
//             fetch(event.request).then(function(response) {
//               cache.put(event.request.url, response.clone());
//               return response;
//             })
//           );
//         })
//         .catch(function(err) {
//           return caches.match('offline.html');
//         });
//     })
//   );
// });
