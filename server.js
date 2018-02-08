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
const auth = require('./server/routes/auth');
const request = require('request-promise');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

setInterval(function(){
  console.log("interval ran");
  
  const options = {
    method: 'GET',
    uri: 'ttps://api.coinmarketcap.com/v1/ticker/',
    // headers: {
    //   'X-Username': 'stephenhanzlik@gmail.com',
    //   'X-Api-Key': '/dGns7iU5t6j9/78Ld/6miNNMYJn0AlOcLTOK3Mu+5A=',
    //   'Content-Type': 'application/json'
    // },
  };

  request(options)
    .then(function(response) {
      console.log("response in interval");
      console.log(response)
      // Handle the response
    })
    .catch(function(err) {
      // Deal with the error
    })
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


// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
