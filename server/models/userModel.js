'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "A username is required"],
    min: [2, 'Username too short'],
    max: [20, 'Username too long']
  },
  email: {
    type: String,
    required: [true, "An email is required"],
    min: [5, 'Email too short'],
    max: [30, 'Email too long']
  },
  password: {
    type: String,
    required: [true, "A password is required"],
    min: [2, 'Password too short'],
    max: [20, 'Password too long']
  },
  created: {
    type: Date,
    default: Date.now
  },
  portfolio: [{ type: Schema.Types.ObjectId, ref: 'PortfolioSchema' }],
  privacySettings: [{ type: Schema.Types.ObjectId, ref: 'SettingsSchema' }]
});

module.exports = mongoose.model('UserModel', UserSchema);