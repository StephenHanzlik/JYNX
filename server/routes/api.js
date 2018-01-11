'use strict';
const express = require('express');
const router = express.Router();

//const crypto = require('crypto');
// const sha256 = crypto.createHash('sha256');

//const boom = require('boom');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//const privateKey = 'my_awesome_cookie_signing_key';

var mongodb = require('mongodb');

// Create seed data

var seedData = [{
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  },
  {
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  },
  {
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  }
];

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://<dbuser>:<dbpassword>@ds151207.mlab.com:51207/jynx';

mongodb.MongoClient.connect(uri, function(err, db) {

  if (err) throw err;

  /*
   * First we'll add a few songs. Nothing is required to create the
   * songs collection; it is created automatically when we insert.
   */

  var songs = db.collection('songs');

  // Note that the insert method can take either an array or a dict.

  songs.insert(seedData, function(err, result) {

    if (err) throw err;

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    songs.update({ song: 'One Sweet Day' }, { $set: { artist: 'Mariah Carey ft. Boyz II Men' } },
      function(err, result) {

        if (err) throw err;

        /*
         * Finally we run a query which returns all the hits that spend 10 or
         * more weeks at number 1.
         */

        songs.find({ weeksAtOne: { $gte: 10 } }).sort({ decade: 1 }).toArray(function(err, docs) {

          if (err) throw err;

          docs.forEach(function(doc) {
            console.log(
              'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
              ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
            );
          });

          // Since this is an example, we'll clean up after ourselves.
          songs.drop(function(err) {
            if (err) throw err;

            // Only close the connection when your app is terminating.
            db.close(function(err) {
              if (err) throw err;
            });
          });
        });
      }
    );
  });
});





//TierionService
// const hashclient = require('hashapi-lib-node');
// const username = 'stephenhanzlik@gmail.com';
// const password = 'OQJgbTvXMZbPyy5Dkjs2KYd8IvxDCUwUCstXqbRQron1JkKHDKX0MxQxyP3Xqth9G3dcPc5DZP3T6jiTrgVpXegUUKAI';
// const hashClient = new hashclient();

// router.post('/sign-up', (req, res) => {
//
//
//   var hash = bcrypt.hashSync(req.body.password, 8);
//
//
// });
// req.headers['X-Username'] = "stephenhanzlik@gmail.com";
// req.headers['X-Api-Key'] = "/dGns7iU5t6j9/78Ld/6miNNMYJn0AlOcLTOK3Mu+5A=";
// req.headers['Content-Type'] = "Content-Type: application/json";

//Tierion Hash API node interface
// let hashTarget = JSON.stringify(req.body);
// sha256.update(hashTarget);
// //let hashResult = sha256.digest("base64");
// console.log("sha256: " + sha256);
//
// hashClient.submitHashItem(sha256, function(err, result) {
//   if (err) {
//     // handle the error
//     console.log("error in submit hash: " + JSON.stringify(err));
//   } else {
//     // process result
//     console.log("Succes!!! result: " + JSON.stringify(result));
//   }
// });

// connection((db) => {
//   db.collection('users')
//     .find()
//     .toArray()
//     .then((users) => {
//       response.data = users;
//       res.json(response);
//     })
//     .catch((err) => {
//       sendError(err, res);
//     });
// });
//});

//const MongoClient = require('mongodb').MongoClient;
//const ObjectID = require('mongodb').ObjectID;

// Connect -- connect to Tierion here
// const connection = (closure) => {
//   return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
//     if (err) return console.log(err);
//
//     closure(db);
//   });
// };

// hashClient.authenticate(username, password, function(err, authToken) {
//   if (err) {
//     // handle the error
//     console.log("auth error");
//   } else {
//     // authentication was successful
//     // access_token, refresh_token are returned in authToken
//     // authToken values are saved internally and managed autmatically for the life of the HashClient
//     console.log("auth successful");
//   }
// });

// // Error handling
// const sendError = (err, res) => {
//   response.status = 501;
//   response.message = typeof err == 'object' ? err.message : err;
//   res.status(501).json(response);
// };
//
// // Response handling
// let response = {
//   status: 200,
//   data: [],
//   message: null
// };



module.exports = router;