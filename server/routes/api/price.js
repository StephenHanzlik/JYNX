'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';
const PriceModel = require('../../models/priceModel');
//const request = require('request-promise');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// router.post('/', function(req, res){
//     console.log("reciepts route hit");
//     res.status(200).send("we got it!");
// });

router.get('/', function(req, res){
  PriceModel.
  find().
  where('name').
  equals('priceData').
  limit(1).
  select('priceString').
  exec(function(err, dbPriceString) {
    if (err) {
      res.status(500).send(err);
    }

  //  console.log("dbPriceString");
    //console.log(JSON.parse(dbPriceString[0].priceString));
    //console.log("dbPriceString end");

    res.status(200).send(JSON.parse(dbPriceString[0].priceString));
  })
});

router.post('/', function(req, res) {
  const bodyObj = {
    priceData: req.body,
  };

  console.log("req.body");
  console.log(req.body);
  console.log("req.body triggered");

  PriceModel.
  find().
  where('name').
  equals('priceData').
  limit(1).
  select('priceString').
  exec(function(err, dbPriceString) {
    if (err) {
      res.status(500).send(err);
    }
    //console.log(dbPriceString);

    const updateDbObject = {
      //new JSON data goes here

      //coinAmts: newAmountsArr,
      //coins: newCoinsArr,
      //datastoreId: 5840
    };

    PriceModel.findOneAndUpdate({ name: 'priceData' }, updateDbObject, function(err, user) {
      if (err) throw err;

    });
    res.status(200).send("ok");
  });
});

module.exports = router;
