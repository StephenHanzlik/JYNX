'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = 'xt67rhdk30_cookie_signing_key_1las01103ksd';
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';
const UserModel = require('../models/userModel');
const PortfolioModel = require('../models/portfolioModel');
const SettingsModel = require('../models/settingsModel');
const request = require('request-promise');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.put('/portfolio', function(req, res) {
  const bodyObj = {
    coinName: req.body.coinName,
    coinAmt: req.body.coinAmt
  };

  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  limit(1).
  select('coins coinAmts _id').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }
    let newCoinsArr = dbPortfolio[0].coins;
    newCoinsArr.push(bodyObj.coinName);
    let newAmountsArr = dbPortfolio[0].coinAmts;
    newAmountsArr.push(bodyObj.coinAmt);

    const updateDbObject = {
      coinAmts: newAmountsArr,
      coins: newCoinsArr,
      datastoreId: 5840
    };

    PortfolioModel.findOneAndUpdate({ hodler: req.token }, updateDbObject, function(err, user) {
      if (err) throw err;

      //Tierion Data API
      // const options = {
      //   method: 'POST',
      //   uri: 'https://api.tierion.com/v1/records',
      //   body: updateDbObject,
      //   headers: {
      //     'X-Username': 'stephenhanzlik@gmail.com',
      //     'X-Api-Key': '/dGns7iU5t6j9/78Ld/6miNNMYJn0AlOcLTOK3Mu+5A=',
      //     'Content-Type': 'application/json'
      //   },
      //   json: true
      // };
      //
      // request(options)
      //   .then(function(response) {
      //     // Handle the response
      //   })
      //   .catch(function(err) {
      //     // Deal with the error
      //   })

    });
    res.status(200).send("ok");
  });
});

router.get('/portfolio', function(req, res) {
  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  limit(1).
  select('coins coinAmts').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(dbPortfolio);
  });
});

router.delete('/portfolio/:name/:amount', function(req, res) {
  const bodyObj = {
    coinName: req.params.name,
    coinAmt: req.params.amount
  };

  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  limit(1).
  select('coins coinAmts _id').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }

    let newCoinsArr = dbPortfolio[0].coins
    let newAmountsArr = dbPortfolio[0].coinAmts
    let difference = 0;

    for(let i = newCoinsArr.length - 1; i >= 0; i--){

      if(bodyObj.coinName === newCoinsArr[i]){
        if(newAmountsArr[i] - bodyObj.coinAmt > 0){
          newAmountsArr[i] = newAmountsArr[i] - bodyObj.coinAmt;
          break;
        }
        else if(newAmountsArr[i] - bodyObj.coinAmt === 0){
          newAmountsArr[i] = newAmountsArr[i] - bodyObj.coinAmt;
          newAmountsArr.splice(i, 1);
          newCoinsArr.splice(i, 1);
          break;
        }
        else{
          difference = newAmountsArr[i] - bodyObj.coinAmt;
          bodyObj.coinAmt = Math.abs(difference);
          newAmountsArr.splice(i, 1);
          newCoinsArr.splice(i, 1);
        }
      }
    }

    const updateDbObject = {
      coinAmts: newAmountsArr,
      coins: newCoinsArr,
      datastoreId: 5840
    };

    PortfolioModel.findOneAndUpdate({ hodler: req.token }, updateDbObject, function(err, user) {
      if (err) throw err;
    });

    res.status(200).send("ok");
  });
});

// router.post('/sign-up', function(req, res) {
//   const hash = bcrypt.hashSync(req.body.password, 8);
//   const bodyObj = {
//     username: req.body.username,
//     email: req.body.email,
//     password: hash,
//   };
//   const newUser = new UserModel(bodyObj);
//
//   newUser.save(function(err) {
//
//     const newPortfolio = new PortfolioModel({
//       hodler: newUser._id,
//       coins: [],
//       coinAmts: []
//     });
//
//     newPortfolio.save(function(err) {
//       if (err) return console.log(err);
//     });
//
//     const newSettings = new SettingsModel({
//       hodler: newUser._id,
//       setting1: [],
//       setting2: []
//     });
//
//     newSettings.save(function(err) {
//       if (err) return console.log(err);
//     });
//   });
// });
//
// router.post('/log-in', function(req, res) {
//   const hash = bcrypt.hashSync(req.body.password, 8);
//   const reqBody = {
//     username: req.body.username,
//     email: req.body.email,
//     password: hash,
//   };
//
//   UserModel.
//   find().
//   where('email').
//   equals(reqBody.email).
//   limit(1).
//   select('password email').
//   exec(function(err, dbUser) {
//     if (err) throw err;
//
//     if (!dbUser) {
//       res.status(401).json({ message: 'Authentication failed. User not found.' });
//     }
//
//     if (bcrypt.compareSync(req.body.password, dbUser[0].password)) {
//       console.log("bcrypt works");
//       delete dbUser[0].password;
//       var token = jwt.sign(reqBody.email, privateKey);
//       res.cookie('token', token, { httpOnly: false }).
//       send({ 'token': token, 'id': dbUser[0]._id, 'username': dbUser[0].username, email: dbUser[0].email });
//       // return res.json({ token: jwt.sign({ email: dbUser.email, fullName: dbUser.fullName, _id: dbUser._id }, privateKey) });
//     } else {
//       res.status(401).json({ message: 'Authentication failed. Wrong password.' });
//     }
//   });
// }); //*****

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



// //Tierion Hash API node interface
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
// });//

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
