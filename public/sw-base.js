importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
);

workbox.precaching.suppressWarnings();

workbox.router.registerRoute(
  /.*(?:googleapis|gstatic)\.com.*$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts'
  })
);

workbox.precaching.precacheAndRoute([], {});
