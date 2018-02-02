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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
