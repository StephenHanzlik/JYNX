'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PortfolioSchema = new Schema({
  hodler: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  portfolioName: String,
  coins: Schema.Types.Mixed,
  startTime: Number,
  endTime: Number
});


module.exports = mongoose.model('PortfolioModel', PortfolioSchema);
