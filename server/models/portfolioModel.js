'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const PortfolioSchema = new Schema({
  hodler: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  portfolioName: String,
  // coins: [String],
  // coinAmts: [Number],
  coins: Schema.Types.Mixed,
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date }
});


module.exports = mongoose.model('PortfolioModel', PortfolioSchema);
