'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongoDB = 'mongodb://jynx-db-user:y6t5w8M21@ds245548.mlab.com:45548/jynx';
const PortfolioModel = require('../../models/portfolioModel');
//const request = require('request-promise');
const hashclient = require('hashapi-lib-node');
const username = 'stephenhanzlik@gmail.com';
const password = 'OQJgbTvXMZbPyy5Dkjs2KYd8IvxDCUwUCstXqbRQron1JkKHDKX0MxQxyP3Xqth9G3dcPc5DZP3T6jiTrgVpXegUUKAI';
const hashClient = new hashclient();
const request = require('request-promise');

mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.put('/', function(req, res) {
  const bodyObj = {
    coinName: req.body.coinName,
    coinAmt: req.body.coinAmt
  };
  let options = {
     method: 'GET',
     uri: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${bodyObj.coinName}&tsyms=USD`,
   };

  request(options)
    .then(function(response) {
      response = JSON.parse(response);
      let currPrice = response['RAW'][bodyObj.coinName]['USD']['PRICE'];

        PortfolioModel.
        find().
        where('hodler').
        equals(req.token).
        sort({startTime: -1}).
        exec(function(err, dbPortfolio) {
          if (err) {
            res.status(500).send(err);
          }

          if(dbPortfolio[0]){

            let key = bodyObj.coinName;
            let value = bodyObj.coinAmt;
            let existingHoldings
            if(dbPortfolio[0].coins[key]){
              existingHoldings = dbPortfolio[0].coins[key] * currPrice;
            }
            else{
              existingHoldings = 0;
            }
            let indHoldingsValue = value * currPrice;
            let currentCoinValue = existingHoldings + indHoldingsValue;
            let date = Date.now();
            let pushArr = [date, currentCoinValue];
            let masterPortPushArr = [];

            let queryCoins = Object.keys(dbPortfolio[0].coins)

            queryCoins = queryCoins.join();

            let totalPortfolioAggrObj = {};
            if(queryCoins === "no ticker"){
              queryCoins = "BTC";
            }

            let options = {
               method: 'GET',
               uri: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${queryCoins}&tsyms=USD`,
             };
            request(options)
              .then(function(response) {
                response = JSON.parse(response);


                if(dbPortfolio[0].coins["no ticker"]){
                  console.log("1");
                  let shortDate = Date.now();
                  // shortDate = shortDate.toString();
                  // shortDate = parseFloat(shortDate.slice(0, 10), 10);

                  let currPrice = response['RAW'][key]['USD']['PRICE'];
                  currPrice = value * currPrice;
                  masterPortPushArr = [date, currPrice];

                  let updateDbObject = {
                    hodler: req.token,
                    portfolioName: "your portfolio name here",
                    coins: {},
                    startTime: shortDate,
                    endTime: 951926120000000
                  };

                  updateDbObject.coins[key] = value;
                  updateDbObject.masterCoinList = {};
                  updateDbObject.masterCoinList[key] = []
                  updateDbObject.masterCoinList[key].push(pushArr);
                  updateDbObject.masterPortfolioList = [];
                  updateDbObject.masterPortfolioList.push(masterPortPushArr);

                  PortfolioModel.findOneAndUpdate({ hodler: req.token, coins: {"no ticker": "no amount"}}, updateDbObject, function(err, user) {
                    if (err) throw err;

                  });
                }
                else{
                  console.log("3");

                  for(let coin in dbPortfolio[0].coins){
                    let currPrice = response['RAW'][coin]['USD']['PRICE'];
                    totalPortfolioAggrObj[coin] = currPrice * dbPortfolio[0].coins[coin];
                  }

                  totalPortfolioAggrObj[key] = currentCoinValue;

                  let accum = 0;

                  for(let coin in totalPortfolioAggrObj){
                    accum += totalPortfolioAggrObj[coin];
                  }

                  masterPortPushArr = [date, accum];

                  let shortDate = Date.now();

                  if(Date.now() > dbPortfolio[0].startTime + 2300000){
                    console.log("3a");

                    let updateDbObject ={
                      hodler: dbPortfolio[0].hodler,
                      portfolioName: "your portfolio name here",
                      coins: dbPortfolio[0].coins,
                      startTime: dbPortfolio[0].startTime,
                      masterCoinList: dbPortfolio[0].masterCoinList,
                      masterPortfolioList: dbPortfolio[0].masterPortfolioList,
                      endTime: shortDate
                    };

                    updateDbObject.masterCoinList[key].push(pushArr);
                    updateDbObject.masterPortfolioList.push(masterPortPushArr);

                    PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
                      if (err) throw err;

                      console.log("dbPortfolio[0].coins in find on update");
                      console.log(dbPortfolio[0].coins);

                      let addDbObject = dbPortfolio[0].coins;

                      if(addDbObject[key]){
                        addDbObject[key] = parseFloat(addDbObject[key]) + parseFloat(value);
                        addDbObject[key] = addDbObject[key].toFixed(8);
                        addDbObject[key] = addDbObject[key].toString();
                        console.log("addDbObject[key] in else");
                        console.log(addDbObject[key])
                      }
                      else{

                        addDbObject[key] = value;
                         console.log("addDbObject[key] in else");
                         console.log(addDbObject[key])
                      }
                      let shortDate = Date.now();
                      // shortDate = shortDate.toString();
                      // shortDate = parseFloat(shortDate.slice(0, 10), 10);

                      let newPortfolio = new PortfolioModel({
                        hodler: req.token,
                        portfolioName: "your portfolio name here",
                        coins: addDbObject,
                        masterCoinList: dbPortfolio[0].masterCoinList,
                        masterPortfolioList: dbPortfolio[0].masterPortfolioList,
                        startTime: shortDate,
                        endTime: 951926120000000
                      });

                      newPortfolio.masterCoinList[key].push(pushArr);
                      updateDbObject.masterPortfolioList.push(masterPortPushArr);
                      // console.log("newPortfolio");
                      // console.log(newPortfolio);

                      newPortfolio.save(function(err) {
                        if (err) return console.log(err);
                      });

                    });
                  }// end of if
                  else{
                    console.log("3b");
                    let addDbObject = dbPortfolio[0].coins;

                    if(addDbObject[key]){
                      addDbObject[key] = parseFloat(addDbObject[key]) + parseFloat(value);
                      addDbObject[key] = parseFloat(addDbObject[key]).toFixed(8);
                      addDbObject[key] = addDbObject[key].toString();
                    }
                    else{
                      addDbObject[key] = value;
                    }

                    let updateDbObject ={
                      hodler: dbPortfolio[0].hodler,
                      portfolioName: "your portfolio name here",
                      coins: addDbObject,
                      masterCoinList: dbPortfolio[0].masterCoinList,
                      masterPortfolioList: dbPortfolio[0].masterPortfolioList,
                      startTime: dbPortfolio[0].startTime,
                      endTime: 951926120000000
                    };


                    if(updateDbObject.masterCoinList[key]){
                      updateDbObject.masterCoinList[key].pop();
                      updateDbObject.masterCoinList[key].push(pushArr);
                    }
                    else{
                      updateDbObject.masterCoinList[key] = []
                      updateDbObject.masterCoinList[key].push(pushArr);
                    }
                    updateDbObject.masterPortfolioList.pop();
                    updateDbObject.masterPortfolioList.push(masterPortPushArr);

                    PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
                      if (err) return console.log(err);

                    });
                  }
                }


              })
              .catch(function(err){
                  res.status(500).send("Something went wrong adding your coin");
              });

          }

          res.status(200).send("ok");
        });

    })
    .catch(function(err){
      res.status(500).send("Something went wrong adding your coin");
    });

});

router.get('/', function(req, res) {
  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  sort({startTime: -1}).
  select('coins portfolioName masterPortfolioList masterCoinList startTime endTime').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }

    res.status(200).send(dbPortfolio);
  });
});

router.delete('/:name/:amount', function(req, res) {

  const bodyObj = {
    coinName: req.params.name,
    coinAmt: req.params.amount
  };

  let totalPortfolioAggrObj = {};

  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  sort({startTime: -1}).
  select('coins portfolioName startTime endTime hodler masterPortfolioList').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }

    let coinsToUpdate = dbPortfolio[0].coins;
    let queryCoins = Object.keys(dbPortfolio[0].coins)

    queryCoins = queryCoins.join();

    let options = {
       method: 'GET',
       uri: `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${queryCoins}&tsyms=USD`,
     };

    request(options)
      .then(function(response) {
        response = JSON.parse(response);
        console.log("JSON Data");
        console.log(response);
        queryCoins = Object.keys(dbPortfolio[0].coins)
        let valAccum = 0;

        for(let coin of queryCoins){
          let coinAmt = coinsToUpdate[coin];
          let coinPrice = response['RAW'][coin]['USD']['PRICE'];
          let coinVal = coinAmt * coinPrice;
          valAccum += coinVal; 
        }

      })
      .catch(function(err){
        res.status(500).send("Something went wrong deleting your coin");
      });



    if(queryCoins === "no ticker"){
      queryCoins = "BTC";
    }

        let key = bodyObj.coinName;
        let value = bodyObj.coinAmt;


        let date = Date.now();


        if(Date.now() > dbPortfolio[0].startTime + 3600000){
          let updateDbObject ={
            hodler: dbPortfolio[0].hodler,
            portfolioName: "your portfolio name here",
            coins: dbPortfolio[0].coins,
            startTime: dbPortfolio[0].startTime,
            endTime: date,
          };

          PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
            if (err) throw err;

            let addDbObject = dbPortfolio[0].coins;

            if(addDbObject[key] && parseFloat(addDbObject[key]).toFixed(2) - parseFloat(value).toFixed(2) > 0){

                addDbObject[key] = parseFloat(addDbObject[key]).toFixed(2) - parseFloat(value).toFixed(2);
                addDbObject[key] = addDbObject[key].toString();

                let shortDate = Date.now();
                // shortDate = shortDate.toString();
                // shortDate = parseFloat(shortDate.slice(0, 10), 10);

                let newPortfolio = new PortfolioModel({
                  hodler: req.token,
                  portfolioName: "your portfolio name here",
                  coins: addDbObject,
                  startTime: shortDate,
                  endTime: 951926120000000
                });

                newPortfolio.save(function(err) {
                  if (err) return console.log(err);
                });
                res.status(200).send("ok");
            }
            else if(addDbObject[key] && parseFloat(addDbObject[key]).toFixed(2) - parseFloat(value).toFixed(2) === 0){

              delete addDbObject[key];
              let shortDate = Date.now();
              // shortDate = shortDate.toString();
              // shortDate = parseFloat(shortDate.slice(0, 10), 10);

              let newPortfolio = new PortfolioModel({
                hodler: req.token,
                portfolioName: "your portfolio name here",
                coins: addDbObject,
                startTime: shortDate,
                endTime: 951926120000000
              });

              newPortfolio.save(function(err) {
                if (err) return console.log(err);
              });
              res.status(200).send("ok");

            }
            else{
              res.status(500).send("You can't sell more coins then you own");
            }
          });
        }
        else{
          console.log("2")
          let addDbObject = dbPortfolio[0].coins;
          let shortDate = Date.now();
          // shortDate = shortDate.toString();
          // shortDate = parseFloat(shortDate.slice(0, 10), 10);

          let updateDbObject ={
            hodler: dbPortfolio[0].hodler,
            portfolioName: "your portfolio name here",
            coins: addDbObject,
            startTime: shortDate,
            endTime: dbPortfolio[0].endTime
          };

          if(addDbObject[key] && parseFloat(addDbObject[key]) - parseFloat(value) > 0){
            console.log("a")

              addDbObject[key] = parseFloat(addDbObject[key]) - parseFloat(value);
              addDbObject[key] = addDbObject[key].toFixed(8);
              console.log("addDbObject[key]");
              console.log(addDbObject[key]);
              addDbObject[key] = addDbObject[key].toString();

              PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
                if (err) throw err;

                res.status(200).send("ok");
              });
          }
          else if(addDbObject[key] && parseFloat(addDbObject[key]).toFixed(2) - parseFloat(value).toFixed(2) === 0){
            // console.log("b")
            // console.log("dbPortfolio[0].masterPortfolioList in delete");
            // console.log(dbPortfolio[0].masterPortfolioList);
            //
            // console.log("updateDbObject in delete");
            // console.log(updateDbObject);

            delete addDbObject[key];
            let shortDate = Date.now();

            PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
              if (err) throw err;

              res.status(200).send("ok");
            });

          }
          else{
            res.status(500).send("You can't sell more coins then you own");
          }

        }


  });
});

// router.post('/user-hash', function(req, res){
//
//   //Tierion Hash API node interface
//   let hashTarget = JSON.stringify(bodyObj);
//   let crypto = require('crypto');
//   let hash = crypto.createHash('sha256')
//     .update(hashTarget)
//
//   let hex = hash.digest('hex');
//
//   hashClient.submitHashItem(hex, function(err, result) {
//     if (err) {
//       console.log("error in submit hash: " + JSON.stringify(err));
//     } else {
//       console.log("Succes!!! result: " + JSON.stringify(result));
//       //Get receipt needs to wait for block to process
//       // hashClient.getReceipt(result.receiptId, function(err, result){
//       //     if(err) {
//       //       console.log("error on receipt");
//       //       console.log(err);
//       //     } else {
//       //       console.log("Sucess!! receipt");
//       //       console.log(result);
//       //     }
//       // });
//     }
//   });//
//
//
// });

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
