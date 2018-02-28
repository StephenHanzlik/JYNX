'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create the counters schema with an _id field and a seq field
var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});

// create a model from that schema
var Counter = mongoose.model('Counter', CounterSchema);

// create a schema for our links
var urlSchema = new Schema({
  _id: {type: Number, index: true},
  long_url: String,
  created_at: Date
});

// The pre('save', callback) middleware executes the callback function
// every time before an entry is saved to the urls collection.
urlSchema.pre('save', function(next){
  var doc = this;
  // find the url_count and increment it by 1
  Counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1} }, function(error, Counter) {
      if (error)
          return next(error);
      // set the _id of the urls collection to the incremented value of the counter
      doc._id = Counter.seq;
      doc.created_at = new Date();
      next();
  });
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
