// This will demonstrate the article model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var articleSchema = new Schema({
  id: {
    type: Number,
    unique: true,
    reuired: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
  },
  articleBody: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.module('Article', articleSchema);
