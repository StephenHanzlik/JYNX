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

router.put('/', function(req, res) {
  const bodyObj = {
    coinName: req.body.coinName,
    coinAmt: req.body.coinAmt
  };

  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  sort({startTime: -1}).
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }

    let key = bodyObj.coinName;
    let value = bodyObj.coinAmt;

    if(dbPortfolio[0]){

      if(dbPortfolio[0].coins["no ticker"]){
        let shortDate = Date.now();
        // shortDate = shortDate.toString();
        // shortDate = parseInt(shortDate.slice(0, 10), 10);


        const updateDbObject = {
          hodler: req.token,
          portfolioName: "your portfolio name here",
          coins: {},
          startTime: shortDate,
          endTime: 951926120000000
        };

        updateDbObject.coins[key] = value;

        PortfolioModel.findOneAndUpdate({ hodler: req.token, coins: {"no ticker": "no amount"}}, updateDbObject, function(err, user) {
          if (err) throw err;

        });
      }
      else{

        let shortDate = Date.now();
        // shortDate = shortDate.toString();
        // shortDate = parseInt(shortDate.slice(0, 10), 10);

        if(Date.now() > dbPortfolio[0].startTime + 3600000){
          let updateDbObject ={
            hodler: dbPortfolio[0].hodler,
            portfolioName: "your portfolio name here",
            coins: dbPortfolio[0].coins,
            startTime: dbPortfolio[0].startTime,
            endTime: shortDate
          };

          PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
            if (err) throw err;

            let addDbObject = dbPortfolio[0].coins;

            if(addDbObject[key]){
              addDbObject[key] = parseInt(addDbObject[key], 10) + parseInt(value, 10);
              addDbObject[key] = addDbObject[key].toString();
            }
            else{
              addDbObject[key] = value;
            }
            let shortDate = Date.now();
            // shortDate = shortDate.toString();
            // shortDate = parseInt(shortDate.slice(0, 10), 10);

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

          });
        }// end of if
        else{
          let addDbObject = dbPortfolio[0].coins;

          if(addDbObject[key]){
            addDbObject[key] = parseInt(addDbObject[key], 10) + parseInt(value, 10);
            addDbObject[key] = addDbObject[key].toString();
          }
          else{
            addDbObject[key] = value;
          }

          let updateDbObject ={
            hodler: dbPortfolio[0].hodler,
            portfolioName: "your portfolio name here",
            coins: dbPortfolio[0].coins,
            startTime: dbPortfolio[0].startTime,
            endTime: shortDate
          };

          PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
            if (err) throw err;

          });
        }
      }
    }

    res.status(200).send("ok");
  });
});

router.get('/', function(req, res) {
  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  sort({startTime: -1}).
  select('coins portfolioName startTime endTime').
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

  PortfolioModel.
  find().
  where('hodler').
  equals(req.token).
  sort({startTime: -1}).
  select('coins portfolioName startTime endTime hodler').
  exec(function(err, dbPortfolio) {
    if (err) {
      res.status(500).send(err);
    }

    let shortDate = Date.now();
    // shortDate = shortDate.toString();
    // shortDate = parseInt(shortDate.slice(0, 10), 10);

    let key = bodyObj.coinName;
    let value = bodyObj.coinAmt;

    if(Date.now() > dbPortfolio[0].startTime + 3600000){

      let updateDbObject ={
        hodler: dbPortfolio[0].hodler,
        portfolioName: "your portfolio name here",
        coins: dbPortfolio[0].coins,
        startTime: dbPortfolio[0].startTime,
        endTime: shortDate
      };

      PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
        if (err) throw err;

        let addDbObject = dbPortfolio[0].coins;

        if(addDbObject[key] && parseInt(addDbObject[key], 10) - parseInt(value, 10) > 0){

            addDbObject[key] = parseInt(addDbObject[key], 10) - parseInt(value, 10);
            addDbObject[key] = addDbObject[key].toString();

            let shortDate = Date.now();
            // shortDate = shortDate.toString();
            // shortDate = parseInt(shortDate.slice(0, 10), 10);

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
        else if(addDbObject[key] && parseInt(addDbObject[key], 10) - parseInt(value, 10) === 0){

          delete addDbObject[key];
          let shortDate = Date.now();
          // shortDate = shortDate.toString();
          // shortDate = parseInt(shortDate.slice(0, 10), 10);

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

      let addDbObject = dbPortfolio[0].coins;
      let shortDate = Date.now();
      // shortDate = shortDate.toString();
      // shortDate = parseInt(shortDate.slice(0, 10), 10);

      let updateDbObject ={
        hodler: dbPortfolio[0].hodler,
        portfolioName: "your portfolio name here",
        coins: addDbObject,
        startTime: shortDate,
        endTime: dbPortfolio[0].endTime
      };

      if(addDbObject[key] && parseInt(addDbObject[key], 10) - parseInt(value, 10) > 0){

          addDbObject[key] = parseInt(addDbObject[key], 10) - parseInt(value, 10);
          addDbObject[key] = addDbObject[key].toString();

          // let newPortfolio = new PortfolioModel({
          //   hodler: req.token,
          //   portfolioName: "your portfolio name here",
          //   coins: addDbObject,
          //   startTime: shortDate,
          //   endTime: 951926120000000
          // });

          // newPortfolio.save(function(err) {
          //   if (err) return console.log(err);
          // });
          res.status(200).send("ok");
      }
      else if(addDbObject[key] && parseInt(addDbObject[key], 10) - parseInt(value, 10) === 0){

        delete addDbObject[key];
        let shortDate = Date.now();
        // shortDate = shortDate.toString();
        // shortDate = parseInt(shortDate.slice(0, 10), 10);

        // let newPortfolio = new PortfolioModel({
        //   hodler: req.token,
        //   portfolioName: "your portfolio name here",
        //   coins: addDbObject,
        //   startTime: shortDate,
        //   endTime: 951926120000000
        // });

        // newPortfolio.save(function(err) {
        //   if (err) return console.log(err);
        // });
        res.status(200).send("ok");

      }
      else{
        res.status(500).send("You can't sell more coins then you own");
      }



      PortfolioModel.findOneAndUpdate({ hodler: req.token, endTime: 951926120000000}, updateDbObject, function(err, user) {
        if (err) throw err;

        res.status(200).send("ok");



      });
    }



    // let newCoinsArr = dbPortfolio[0].coins
    // let newAmountsArr = dbPortfolio[0].coinAmts
    // let difference = 0;
    //
    // for(let i = newCoinsArr.length - 1; i >= 0; i--){
    //
    //   if(bodyObj.coinName === newCoinsArr[i]){
    //     if(newAmountsArr[i] - bodyObj.coinAmt > 0){
    //       newAmountsArr[i] = newAmountsArr[i] - bodyObj.coinAmt;
    //       break;
    //     }
    //     else if(newAmountsArr[i] - bodyObj.coinAmt === 0){
    //       newAmountsArr[i] = newAmountsArr[i] - bodyObj.coinAmt;
    //       newAmountsArr.splice(i, 1);
    //       newCoinsArr.splice(i, 1);
    //       break;
    //     }
    //     else{
    //       difference = newAmountsArr[i] - bodyObj.coinAmt;
    //       bodyObj.coinAmt = Math.abs(difference);
    //       newAmountsArr.splice(i, 1);
    //       newCoinsArr.splice(i, 1);
    //     }
    //   }
    // }
    //
    // const updateDbObject = {
    //   coinAmts: newAmountsArr,
    //   coins: newCoinsArr,
    //   datastoreId: 5840
    // };
    //
    // PortfolioModel.findOneAndUpdate({ hodler: req.token }, updateDbObject, function(err, user) {
    //   if (err) throw err;
    // });

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
