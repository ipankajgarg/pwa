var deferredPrompt;

var enableNotificationsButtons = document.querySelectorAll(
  '.enable-notifications'
);

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js', { scope: '/' })
    .then(function() {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmedNotification() {
  if ('serviceWorker' in navigator) {
    var options = {
      body: 'notification testing',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        {
          action: 'confirm',
          title: 'Okay',
          icon: '/src/images/icons/app-icon-96x96.png'
        },
        {
          action: 'cancel',
          title: 'cancel',
          icon: '/src/images/icons/app-icon-96x96.png'
        }
      ]
    };
    navigator.serviceWorker.ready.then(function(swreg) {
      swreg.showNotification('hello title', options);
    });
  }

  // var options = {
  //   body: 'you successfullt subscribed to our Notification service'
  // };
  // new Notification('successfully subscribed', options);
}

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }
  navigator.serviceWorker.ready
    .then(function(swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub) {
      if (sub === null) {
        console.log('its null');
        var vapidPublicKey =
          'BJEBjKzTL31H1jVQ_WrBRCjn46YFo6DKNeFsRb5_lu2VnJLVzrsHNtaVFydLIv6Zrs_9KzUjjCWIPl9Fq68YZOo';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      } else {
        console.log(sub);
      }
    })
    .then(function(newSub) {
      fetch('https://pwagram-e4028.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(newSub)
      });
    })
    .then(function(res) {
      displayConfirmedNotification();
    })
    .catch(function(err) {
      console.log(err);
    });
}
//NmGVXlhj00kOiQhrf-YCiBHnqa6wqa3olE6DNb6DCNg

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('no notification permission granted');
    } else {
      // displayConfirmedNotification();
      configurePushSub();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener(
      'click',
      askForNotificationPermission
    );
  }
}

// window.addEventListener('load', function() {
//   if (navigator.onLine) {
//     // handle online status
//     // re-try api calls
//     console.log('device is now online');
//   } else {
//     // handle offline status
//     console.log('device is now offline');
//   }
// });
