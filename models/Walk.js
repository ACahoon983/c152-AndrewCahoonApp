'use strict'
const mongoose = require ('mongoose' );
const Schema = mongoose.Schema;
const ObjectId= mongoose.Schema.Types.ObjectId;

var walkSchema = Schema( {
  userId: ObjectId,
  date: String,
  steps: String,
  minutes: String,
  speed: Number,
  createdAt: Date,
  username: String
})

module.exports = mongoose.model('Walk', walkSchema)
