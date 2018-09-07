const functions = require('firebase-functions');
const admin = require('firebase-admin');
var cors = require('cors')({ origin: true });

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

exports.newdata = functions.https.onRequest((request, response) => {
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
        response.status(201).json({ message: 'Data store', data: data });
      })
      .catch(function(err) {
        response.status(500).json({ error: err });
      });
  });
});
