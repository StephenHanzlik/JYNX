'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  hodler: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
  setting1: [], //filler setting for later
  setting2: [] //filler setting for later
});

module.exports = mongoose.model('SettingsModel', SettingsSchema);