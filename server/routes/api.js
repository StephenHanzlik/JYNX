'use strict';
const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const sha256 = crypto.createHash('sha256');


//TierionService
// const hashclient = require('hashapi-lib-node');
// const username = 'stephenhanzlik@gmail.com';
// const password = 'OQJgbTvXMZbPyy5Dkjs2KYd8IvxDCUwUCstXqbRQron1JkKHDKX0MxQxyP3Xqth9G3dcPc5DZP3T6jiTrgVpXegUUKAI';
// const hashClient = new hashclient();

hashClient.authenticate(username, password, function(err, authToken) {
  if (err) {
    // handle the error
    console.log("auth error");
  } else {
    // authentication was successful
    // access_token, refresh_token are returned in authToken
    // authToken values are saved internally and managed autmatically for the life of the HashClient
    console.log("auth successful");
  }
});

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

// Response handling
let response = {
  status: 200,
  data: [],
  message: null
};

router.post('/sign-up', (req, res) => {
      req.headers['X-Username'] = "stephenhanzlik@gmail.com";
      req.headers['X-Api-Key'] = "/dGns7iU5t6j9/78Ld/6miNNMYJn0AlOcLTOK3Mu+5A=";
      req.headers['Content-Type'] = "Content-Type: application/json";



    }
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

    module.exports = router;