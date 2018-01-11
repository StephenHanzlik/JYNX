'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

const MongoClient = require('mongodb').MongoClient;

// API file for interacting with MongoDB
const api = require('./server/routes/api');

let db;

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

MongoClient.connect('mongodb://jynx-db-user:y6t5w8M21@ds151207.mlab.com:51207/jynx', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

// API location
app.use('/api', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  //res.sendFile('index.html', { root: path.join(__dirname, 'src') });
  //res.sendFile(path.join(__dirname, 'src/index.html'));

  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


//Set Port
// const port = process.env.PORT || '3000';
// app.set('port', port);
//
// const server = http.createServer(app);
//
// server.listen(port, () => console.log(`Running on localhost:${port}`));