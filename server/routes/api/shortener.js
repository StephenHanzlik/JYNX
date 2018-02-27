'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds245548.mlab.com:45548/jynx';const PriceModel = require('../../models/priceModel');
//const request = require('request-promise');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/api/shorten', function(req, res){
  // route to create and return a shortened URL given a long URL
});

router.get('/:encoded_id', function(req, res){
  // route to redirect the visitor to their original URL given the short URL
});

module.exports = router;
