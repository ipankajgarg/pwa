const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require('cors')({ origin: true });
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
var serviceAccount = require('./service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pwagram-e4028.firebaseio.com'
});

exports.hello = functions.https.onRequest((request, response) => {
  response.send('hello wrold');
});

exports.postdata = functions.https.onRequest((request, response) => {
  cors(request, response, function() {
    console.log('req', request.body);

    admin
      .database()
      .ref('posts')
      .push({
        id: request.body.id || null,
        title: request.body.title || null,
        location: request.body.location || null,
        image: request.body.image || null
      })
      .then(function(data) {
        webpush.setVapidDetails(
          'mailto:gargpankaj@gmail.com',
          'BJEBjKzTL31H1jVQ_WrBRCjn46YFo6DKNeFsRb5_lu2VnJLVzrsHNtaVFydLIv6Zrs_9KzUjjCWIPl9Fq68YZOo',
          'NmGVXlhj00kOiQhrf-YCiBHnqa6wqa3olE6DNb6DCNg'
        );
        return admin
          .database()
          .ref('subscriptions')
          .once('value');
      })
      .then(function(subscriptions) {
        subscriptions.forEach(function(sub) {
          var pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          };
          webpush
            .sendNotification(
              pushConfig,
              JSON.stringify({
                title: 'new Post',
                content: 'new post added',
                openUrl: '/help'
              })
            )
            .catch(err => {
              console.log(err);
            });
        });
        response
          .status(201)
          .json({ message: 'data stored', id: request.body.id });
      })
      .catch(function(err) {
        response.status(500).json({ error: err });
      });
  });
});
