'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = 'xt67rhdk30_cookie_signing_key_1las01103ksd';
const Schema = mongoose.Schema;
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "A username is required"],
    min: [2, 'Username too short'],
    max: [20, 'Username too long']
  },
  email: {
    type: String,
    required: [true, "An email is required"],
    min: [5, 'Email too short'],
    max: [30, 'Email too long']
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    min: [2, 'Password too short'],
    max: [20, 'Password too long']
  },
  created: {
    type: Date,
    default: Date.now
  },
  portfolio: [{ type: Schema.Types.ObjectId, ref: 'PortfolioSchema' }],
  privacySettings: [{ type: Schema.Types.ObjectId, ref: 'SettingsSchema' }]
});

const PortfolioSchema = new Schema({
  hodler: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  coins: [String],
  coinAmts: [Number]
});

const SettingsSchema = new Schema({
  hodler: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  setting1: [], //filler setting for later
  setting2: [] //filler setting for later
});

const UserModel = mongoose.model('UserModel', UserSchema);
const PortfolioModel = mongoose.model('PortfolioModel', PortfolioSchema);
const SettingsModel = mongoose.model('SettingsModel', SettingsSchema);

router.post('/add-coin', function(req, res) {
  console.log("post route on server triggered");
  console.log("req.body.coinName: " + req.body.coinName);
  const bodyObj = {
    coinName: req.body.coinName,
    coinAmt: req.body.coinAmt
  };
  //*** our next step here.   we need to figure out how to pass the user in to look up their portfolio.   May need to finish JWT. ***
  UserModel.
  find().
  where('email').
  equals(bodyObj.email).
  limit(1).
  select('password email').
  exec(function(err, dbUser) {
    if (err) throw err;
  });

});

router.post('/sign-up', function(req, res) {
  const hash = bcrypt.hashSync(req.body.password, 8);
  const bodyObj = {
    username: req.body.username,
    email: req.body.email,
    password: hash,
  };
  const newUser = new UserModel(bodyObj);

  newUser.save(function(err) {

    const newPortfolio = new PortfolioModel({
      hodler: newUser._id,
      coins: [],
      coinAmts: []
    });

    newPortfolio.save(function(err) {
      if (err) return console.log(err);
    });

    const newSettings = new SettingsModel({
      hodler: newUser._id,
      setting1: [],
      setting2: []
    });

    newSettings.save(function(err) {
      if (err) return console.log(err);
    });


  });



  // UserModel.create(bodyObj, function(err, newInstance) {
  //   if (err) return console.log(err);
  //   // saved!
  //   res.redirect('/charts');
  // });

});

router.post('/log-in', function(req, res) {
  const hash = bcrypt.hashSync(req.body.password, 8);
  const reqBody = {
    username: req.body.username,
    email: req.body.email,
    password: hash,
  };

  UserModel.
  find().
  where('email').
  equals(reqBody.email).
  limit(1).
  select('password email').
  exec(function(err, dbUser) {
    if (err) throw err;

    if (!dbUser) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
    }

    if (bcrypt.compareSync(req.body.password, dbUser[0].password)) {
      console.log("bcrypt works");
      delete dbUser[0].password;
      var token = jwt.sign(reqBody.email, privateKey);
      res.cookie('token', token, { httpOnly: true }).
      send({ 'token': token, 'id': dbUser[0]._id, 'username': dbUser[0].username, email: dbUser[0].email });
      // return res.json({ token: jwt.sign({ email: dbUser.email, fullName: dbUser.fullName, _id: dbUser._id }, privateKey) });
    } else {
      res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }

  });


  //function(err, dbUser) {
  //   if (err) throw err;
  //
  //   if (!dbUser) {
  //     res.status(401).json({ message: 'Authentication failed. User not found.' });
  //   }
  //
  //   if (bcrypt.compareSync(req.body.password, dbUser[0].password)) {
  //     console.log("bcrypt works");
  //     delete dbUser[0].password;
  //     var token = jwt.sign(reqBody.email, privateKey);
  //     res.cookie('token', token, { httpOnly: true }).
  //     send({ 'token': token, 'id': dbUser[0]._id, 'username': dbUser[0].username, email: dbUser[0].email });
  //
  //   } else {
  //     res.status(401).json({ message: 'Authentication failed. Wrong password.' });
  //   }
  //
  // });
  //);
});

// {
//   if (err) throw err;
//   if (!user[0]) {
//     res.status(401).json({ message: 'Authentication failed. User not found.' });
//   } else if (user[0]) {
//     if (!bcrypt.compareSync(bodyObj.password, user[0].password)) {
//       res.status(401).json({ message: 'Authentication failed. Wrong password.' });
//     } else {
//       return res.json({ token: jwt.sign({ email: user.email, username: user.username, _id: user._id }, privateKey) });
//     }
//   }
// }


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