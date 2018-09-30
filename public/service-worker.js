importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
);

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute([
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "5ef5eabe69e7c37f97aa3a2d01dcfac7"
  },
  {
    "url": "manifest.json",
    "revision": "d11c7965f5cfba711c8e74afa6c703d7"
  },
  {
    "url": "offline.html",
    "revision": "c961743e3c8aa52445f7d6709c8470c0"
  },
  {
    "url": "src/css/app.css",
    "revision": "b949a8da91152d6dd5d56e6a3f1e20b5"
  },
  {
    "url": "src/css/feed.css",
    "revision": "dcc108973e5d5475c01728926e9ca656"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/js/app.js",
    "revision": "b59e009288b5c45eb38c46b7f175ffde"
  },
  {
    "url": "src/js/feed.js",
    "revision": "cb510e05220c0a39ac723e9ff5176be6"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "becc1a4f5cae41fba4c7c105da5ad4d4"
  },
  {
    "url": "sw-base.js",
    "revision": "a3268426a4731a76fa4fa8775e09c65f"
  },
  {
    "url": "sw.js",
    "revision": "b7f7d25db2b24cdc77183d84c0bb5b74"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  }
], {});
