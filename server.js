'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const jwt = require('jsonwebtoken');
const privateKey = 'xt67rhdk30_cookie_signing_key_1las01103ksd';
const cookieParser = require('cookie-parser');
const apiPortfolio = require('./server/routes/api/portfolio');
const apiReceipts = require('./server/routes/api/receipts');
const apiPrice = require('./server/routes/api/price');
const auth = require('./server/routes/auth');
const request = require('request-promise');
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx';
const PriceModel = require('./server/models/priceModel');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//use this to create price data entry in Db if Db is deleted
// const priceData = {
//   name: "priceData",
//   priceString: "update JSON here"
// }

// const newPrice = new PriceModel(priceData);
//
// newPrice.save(function(err) {
//
// })

setInterval(function(){

  const options = {
    method: 'GET',
    uri: 'https://api.coinmarketcap.com/v1/ticker/?limit=200',
  };

  request(options)
    .then(function(response) {

      const updateObj = {
        priceString: response
      };

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
        PriceModel.findOneAndUpdate({ name: 'priceData' }, updateObj, function(err, user) {
          if (err) {
            throw err;
          }
        });
      });

   })
    .catch(function(err) {
      // Deal with the error
    });
}, 330000);


const authorize = function(req, res, next) {
  if (req.cookies) {
    const token = req.cookies.token;
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        res.status(400).json({ message: 'You need a cookie' });
        return;
      } else {
        req.token = decoded;
        next();
      }

    });
  } else {
    res.status(400).json({ message: 'You need a cookie' });
  }
};

const authorizeReceipts = function(req, res, next){
  console.log("req.body");
  console.log(req.body);
  next();
}

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/auth', auth);
app.use('/api/portfolio', authorize, apiPortfolio);
app.use('/api/receipts', authorizeReceipts, apiReceipts);
app.use('/api/price', apiPrice);


// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
