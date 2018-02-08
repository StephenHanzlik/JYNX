'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  name: "priceData",
  priceString: String,
});

module.exports = mongoose.model('PriceModel', PriceSchema);
