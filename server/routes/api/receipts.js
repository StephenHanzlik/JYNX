'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';
const PortfolioModel = require('../../models/portfolioModel');
//const request = require('request-promise');
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

router.post('/', function(req, res){
    console.log("reciepts route hit");
    res.status(200).send("we got it!");
});

module.exports = router;
