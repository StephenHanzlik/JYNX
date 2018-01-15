'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PortfolioSchema = new Schema({
  hodler: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  coins: [String],
  coinAmts: [Number]
});


module.exports = mongoose.model('PortfolioModel', PortfolioSchema);