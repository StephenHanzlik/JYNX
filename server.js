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
const apiShortener = require('./server/routes/api/shortener');
const auth = require('./server/routes/auth');
const request = require('request-promise');
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds245548.mlab.com:45548/jynx';
const PortfolioModel = require('./server/models/portfolioModel');

//use to prevent cors issues for development
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


setInterval(function(req, res){

  PortfolioModel.
  find().
  where('endTime').
  equals(951926120000000).
  select('hodler portfolioName coins masterPortfolioList masterCoinList startTime endTime').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }

    dbPortfolio.forEach(data=>{
      //console.log(data);
        let coinQueryString = Object.keys(data.coins).join();
        let totalPortfolioValue = [];
        //  { _id: 5a8efeb9fe6e060a00833b00,
        //   portfolioName: 'your portfolio name here',
        //   coins: { BTC: '1' },
        //   masterCoinList: { 'add keys': true },
        //   startTime: 1519320920408,
        //   endTime: 951926120000000,
        //   masterPortfolioList: [],
        //   hodler: [ 5a8efeb9fe6e060a00833aff ] }

        let options = {
           method: 'GET',
           uri: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coinQueryString}&tsyms=USD`,
         };

         request(options)
           .then(function(response) {

             response = JSON.parse(response);
             response = response['RAW'];
             let dataCoinsKeys = Object.keys(data.coins);
             let priceTimeStamp = Date.now();

             dataCoinsKeys.forEach(coin => {
               if(!data.masterCoinList[coin]){
                 data.masterCoinList[coin] = [];
               }
               if(data.masterCoinList['add keys']){
                 delete data.masterCoinList['add keys'];
               }
               let pushArr = [];
               let coinPriceUSD = response[coin].USD.PRICE * data.coins[coin];

               pushArr = [priceTimeStamp, coinPriceUSD];
               data.masterCoinList[coin].push(pushArr);
               totalPortfolioValue.push(pushArr);
             });

             let totalValue = 0;
             totalPortfolioValue.forEach(item =>{
                totalValue += item[1];
             });

             totalValue = Math.round(totalValue * 100)/100
             //console.log(totalValue);
             let pushToMaster = [priceTimeStamp, totalValue];
             data.masterPortfolioList.push(pushToMaster);
             let updateObj = data;
             //console.log(updateObj.masterPortfolioList)

             PortfolioModel.findOneAndUpdate({ endTime: 951926120000000, hodler: data.hodler }, updateObj, function(err, user) {
              if (err) {
                throw err;
              }
            });

          })
           .catch(function(err) {
             // Deal with the error
           });
    });

  });
  console.log("updated")

//3600000 hour
//86400000 day
//10000 10 sec
//60000 minnute
}, 2300000);

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
app.use('/api/shortener', apiShortener);
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
