'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds245548.mlab.com:45548/jynx';
const Url = require('../../models/urlModel');
const base58 = require('../../modules/base58');
const config = require('../../config')
//const request = require('request-promise');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/', function(req, res){
  console.log("post req hit");
  console.log("req.body");
  console.log(req.body)

  var longUrl = req.body.id;
  var shortUrl = '';

  // check if url already exists in database
  Url.findOne({long_url: longUrl}, function (err, doc){
    if (doc){
      // base58 encode the unique _id of that document and construct the short URL
      let uniqueNum = base58.encode(doc._id);
      if(uniqueNum.length < 2){
          uniqueNum = uniqueNum + 'GdF';
      }
    //  shortUrl = config.webhost + uniqueNum;
      shortUrl = uniqueNum;

      // since the document exists, we return it without creating a new entry
      res.send({'shortUrl': shortUrl});
    } else {
      // The long URL was not found in the long_url field in our urls
      // collection, so we need to create a new entry:
      var newUrl = Url({
        long_url: longUrl
      });

      // save the new link
      newUrl.save(function(err) {
        if (err){
          console.log(err);
        }

        // construct the short URL
        let uniqueNum = base58.encode(newUrl._id);
        if(uniqueNum.length < 2){
            uniqueNum = uniqueNum + 'GdF';
        }

      //  shortUrl = config.webhost + uniqueNum;
        shortUrl = uniqueNum;

        res.send({'shortUrl': shortUrl});
      });
    }

  });

});

router.get('/:encoded_id', function(req, res){
  // route to redirect the visitor to their original URL given the short URL
});

module.exports = router;
