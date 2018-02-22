'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = 'xt67rhdk30_cookie_signing_key_1las01103ksd';
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds245548.mlab.com:45548/jynx';
const UserModel = require('../models/userModel');
const PortfolioModel = require('../models/portfolioModel');
const SettingsModel = require('../models/settingsModel');
const request = require('request-promise');

const hashclient = require('hashapi-lib-node');
const username = 'stephenhanzlik@gmail.com';
const password = 'OQJgbTvXMZbPyy5Dkjs2KYd8IvxDCUwUCstXqbRQron1JkKHDKX0MxQxyP3Xqth9G3dcPc5DZP3T6jiTrgVpXegUUKAI';
const hashClient = new hashclient();

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


router.post('/sign-up', function(req, res) {

  const hash = bcrypt.hashSync(req.body.password, 8);
  let bodyObj = {
    username: req.body.username,
    email: req.body.email,
    password: hash,
    datastoreId: 5841
  };

  //Hash to Tierion API
    // hashClient.authenticate(username, password,   function(err, authToken){
    //     if(err) {
    //       console.log("there was an error with hash client");
    //         // handle the error
    //     } else {
    //       console.log("no error with hash client");
    //
    //
            // const hashTarget = JSON.stringify(bodyObj);
            // const crypto = require('crypto');
            // let hash = crypto.createHash('sha256')
            //   .update(hashTarget)
            //
            // let hex = hash.digest('hex');
            //
            // hashClient.submitHashItem(hex, function(err, result) {
            //    if (err) {
            //      console.log("error in submit hash: " + JSON.stringify(err));
            //    } else {
            //      console.log("Succes!!! result: ");
            //      console.log(typeof result);
            //      console.log(result);
            //
            //      bodyObj.tierionReceipt = result.receiptId;
            //      bodyObj.tierionTimeStamp = result.timestamp;
            //
                 const newUser = new UserModel(bodyObj);
            //
                 newUser.save(function(err) {

                   const newPortfolio = new PortfolioModel({
                     hodler: newUser._id,
                     portfolioName: "your portfolio name here",
                     coins: {"no ticker": "no amount"},
                   });

                   newPortfolio.save(function(err) {
                     if (err) return console.log(err);
                   });
                   //
                   // const newSettings = new SettingsModel({
                   //   hodler: newUser._id,
                   //   setting1: [],
                   //   setting2: []
                   // });
                   //
                   // newSettings.save(function(err) {
                   //   if (err) return console.log(err);
                   // });
                 });
            //
            //   }
            // });

    //     }
    // });
    res.status(200).send("ok");

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
    if (err) {
      res.status(500).send(err);
    }
    if (!dbUser) {
      res.status(401).json({ message: 'Authentication failed. User not found.' });
      throw err;
    }

    if (req.body.password && dbUser[0]) {
      if (bcrypt.compareSync(req.body.password, dbUser[0].password)) {
        console.log("dbUser[0]._id: " + dbUser[0]._id);
        let idString = dbUser[0]._id.toString();
        delete dbUser[0].password;
        var token = jwt.sign(idString, privateKey);
        res.cookie('token', token, { httpOnly: false }).
        send({ 'token': token, 'id': dbUser[0]._id, 'username': dbUser[0].username, email: dbUser[0].email });
      } else {
        res.status(401).json({ message: 'Authentication failed. Wrong password.' });
      }
    } else {
      res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }
  });
});

module.exports = router;
