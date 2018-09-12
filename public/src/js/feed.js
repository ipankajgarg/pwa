var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);
var sharedMomentsArea = document.querySelector('#shared-moments');
var form = document.querySelector('form');
var locationInput = document.querySelector('#location');
var videoPlayer = document.querySelector('#player');
var canvasElement = document.querySelector('#canvas');
var captureButton = document.querySelector('#capture-btn');
var imagePicker = document.querySelector('#image-picker');
var imagePickerArea = document.querySelector('#pick-image');
var locationBtn = document.querySelector('#location-btn');
var locationLoader = document.querySelector('#location-loader');
var picture;
var fetchedLocation;
//
// locationBtn.addEventListener('click', function(event) {
//   if (!('geolocation' in navigator)) {
//     return;
//   }
//
//   locationBtn.style.display = 'none';
//   locationLoader.style.display = 'block';
//
//   navigator.geolocation.getCurrentPosition(
//     function(position) {
//       locationBtn.style.display = 'inline';
//       locationLoader.style.display = 'none';
//       fetchedLocation = position.coords.latitude;
//       locationInput.classList.add('is-focused ');
//     },
//     function(err) {
//       conosle.log(err);
//       locationBtn.style.display = 'inline';
//       location.style.display = 'none';
//       alert('couldnt fetch location');
//       fetchedLocation = null;
//     },
//     { timeout: 7000 }
//   );
// });

function initializeLocation() {
  if (!('geolocation' in navigator)) {
    locationBtn.style.display = 'none';
  }
}
function initializeMedia() {
  if (!('mediaDevice' in navigator)) {
    navigator.mediaDevices = {};
  }
  if (!('getUserMedia' in navigator.mediaDevices)) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented'));
      }
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(function(stream) {
      videoPlayer.srcObject = stream;
      videoPlayer.style.display = 'block';
    })
    .catch(function(err) {
      imagePickerArea.style.display = 'block';
    });
}

var network = false;

captureButton.addEventListener('click', function(event) {
  canvasElement.style.display = 'block';
  videoPlayer.style.display = 'none';
  captureButton.style.display = 'none';
  var context = canvasElement.getContext('2d');
  context.drawImage(
    videoPlayer,
    0,
    0,
    canvas.width,
    videoPlayer.videoHeight / (videoPlayer.videoWidth / canvas.width)
  );
  videoPlayer.srcObject.getVideoTracks().forEach(function(track) {
    track.stop();
  });
  // picture = dataURItoBlob(canvasElement.toDataURL);
});
imagePicker.addEventListener('change', function(event) {
  picture = event.target.files[0];
  console.log(picture);
});

function openCreatePostModal() {
  createPostArea.style.display = 'block';
  initializeMedia();
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
  imagePickerArea.style.display = 'none';
  videoPlayer.style.display = 'none';
  canvasElement.style.display = 'none';
  locationBtn.style.display = 'inline';
  locationLoader.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard(card) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
  var cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url(' + card.image + ')';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);
  var cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.textContent = card.title;
  cardTitle.appendChild(cardTitleTextElement);
  var cardSupportingText = document.createElement('div');
  cardSupportingText.className = 'mdl-card__supporting-text';
  cardSupportingText.textContent = card.location;
  cardSupportingText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportingText);
  componentHandler.upgradeElement(cardWrapper);
  sharedMomentsArea.appendChild(cardWrapper);
}

// fetch('https://pwagram-e4028.firebaseio.com/')
//   .then(function(res) {
//     console.log(res);
//     return res.json();
//   })
//   .then(function(data) {
//     createCard();
//   });

var dbPromise = idb.open('data', 3);

function updateUI(data) {
  for (key in data) {
    createCard(data[key]);
  }
}

fetch('https://pwagram-e4028.firebaseio.com/posts.json')
  .then(res => {
    network = true;
    console.log('parsing');
    return res.json();
  })
  .then(data => {
    console.log('data', data);

    updateUI(data);
    //
    // navigator.serviceWorker.ready.then(function(swRegistration) {
    //   console.log('sync fires');
    //   return swRegistration.sync.register('myFirstSync');
    // });
  })
  .catch(function() {
    console.log('called');
    dbPromise.then(function(db) {
      console.log(db);
      var tx = db.transaction('posts', 'readonly');
      var store = tx.objectStore('posts');
      store.getAll().then(function(data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          createCard(data[i]);
        }
      });
    });
  });

function postData(post) {
  fetch('https://us-central1-pwagram-e4028.cloudfunctions.net/postdata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(post)
  })
    .then(function(res) {
      console.log(res);
    })
    .catch(function(err) {
      console.log(err);
    });
}

form.addEventListener('submit', function(event) {
  event.preventDefault();
  var title = document.querySelector('#title').value;
  var location = document.querySelector('#location').value;

  var post = {
    title,
    location,
    id: new Date().toISOString(),
    image:
      'https://firebasestorage.googleapis.com/v0/b/pwagram-e4028.appspot.com/o/sf-boat.jpg?alt=media&token=52a75ae3-598f-45d2-812f-b2447175a1ab'
  };
  closeCreatePostModal();
  postData(post);
});

// form.addEventListener('submit', function(event) {
//   event.preventDefault();
//
//   var title = document.querySelector('#title').value;
//   var location = document.querySelector('#location').value;
//
//   var post = {
//     title,
//     location,
//     id: new Date().toISOString(),
//     image:
//       'https://firebasestorage.googleapis.com/v0/b/pwagram-e4028.appspot.com/o/sf-boat.jpg?alt=media&token=52a75ae3-598f-45d2-812f-b2447175a1ab'
//   };
//   closeCreatePostModal();
//   if ('serviceWorker' in navigator && 'SyncManager' in window) {
//     navigator.serviceWorker.ready
//       .then(function(sw) {
//         dbPromise
//           .then(db => {
//             var tx = db.transaction('posts', 'readwrite');
//             var store = tx.objectStore('posts');
//             store.put(post);
//             return tx.complete;
//           })
//           .then(pro => {
//             console.log(pro);
//             return sw.sync.register('myFirstSync');
//           })
//           .then(p => {
//             console.log(p);
//             var snackbarContainer = document.querySelector(
//               '#confirmation-toast'
//             );
//             var data = { message: 'Your post was saved for syncing' };
//             snackbarContainer.MaterialSnackbar.showSnackbar(data);
//           });
//       })
//       .catch(err => console.log('service worker not ready', err));
//   }
// });

// if ('indexedDB' in window) {
//   if (!network) {
//     dbPromise.then(function(db) {
//       var tx = db.transaction('posts', 'readonly');
//       var store = tx.objectStore('posts');
//       store.getAll().then(function(data) {
//         console.log('fetch');
//         for (var i = 0; i < data.length; i++) {
//           createCard(data[i]);
//         }
//       });
//     });
//   }
// }
