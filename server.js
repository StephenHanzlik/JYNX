'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const jwt = require('jsonwebtoken');
const privateKey = 'xt67rhdk30_cookie_signing_key_1las01103ksd';
const api = require('./server/routes/api');

const authorize = function(req, res, next) {
  console.log(req.cookie);
  if (req.cookies) {
    console.log('you have a cookie');
    const token = req.cookies.token;
    jwt.verify(token, privateKey, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: 'You need a cookie' });
      }
      req.token = decoded;
      next();
    });
  } else {
    console.log("no cookie");
    res.status(400).json({ message: 'You need a cookie' });
  }
};

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// API location
app.use('/api', authorize, api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  if (req.token) {
    console.log("we have a token");
    res.sendFile(path.join(__dirname, 'dist/index.html'));

  } else {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  }

});


//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));