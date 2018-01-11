'use strict';
const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
//let db;
const boom = require('boom');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
//const privateKey = 'my_awesome_cookie_signing_key';
//Define a schema
const Schema = mongoose.Schema;

const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const userSchema = new Schema({
  username: { type: String, required: [true, "A username is required"], min: [2, 'Username too short'], max: [20, 'Username too long'] },
  email: { type: String, required: [true, "An email is required"], min: [5, 'Email too short'], max: [30, 'Email too long'] },
  password: { type: String, required: [true, "A password is required"], min: [2, 'Password too short'], max: [20, 'Password too long'] },
  portfolio: Schema.Types.ObjectId,
  privacySettings: Schema.Types.ObjectId
});

const UserModel = mongoose.model('userModel', userSchema);


router.post('/sign-up', function(req, res) {

  const hash = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hash;
  const bodyObj = {
    username: req.body.userName,
    email: req.body.email,
    password: hash,
  };

  UserModel.create(bodyObj, function(err, newInstance) {
    if (err) return console.log(err);
    // saved!
    res.redirect('/charts');
  });

});

router.post('/log-in', function(req, res) {
  console.log("log in post route hit")
  UserModel.find({ 'username': 'testingBodyObj' }, 'password email', function(err, userRes) {
    if (err) return console.log(err);
    console.log(JSON.stringify(userRes));
  })
});



//Mongo Client w/o mongoose MongoClient.connect('mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx', (err, database) => {
//   if (err) return console.log(err);
//   db = database.db("jynx");
//
// });

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