'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = 'xt67rhdk30_cookie_signing_key_1las01103ksd';
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';
const UserModel = require('../models/userModel');
const PortfolioModel = require('../models/portfolioModel');
const SettingsModel = require('../models/settingsModel');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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
    }
    if (bcrypt.compareSync(req.body.password, dbUser[0].password)) {
      delete dbUser[0].password;
      var token = jwt.sign(reqBody.email, privateKey);
      res.cookie('token', token, { httpOnly: false }).
      send({ 'token': token, 'id': dbUser[0]._id, 'username': dbUser[0].username, email: dbUser[0].email });
    } else {
      res.status(401).json({ message: 'Authentication failed. Wrong password.' });
    }
  });
});

module.exports = router;