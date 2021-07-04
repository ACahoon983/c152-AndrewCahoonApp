'use strict'
const mongoose = require ('mongoose' );
const Schema = mongoose.Schema;
const ObjectId= mongoose.Schema.Types.ObjectId;

var speedRunSchema = Schema( {
  userId: ObjectId,
  game: String,
  category: String,
  hours: Number,
  minutes: Number,
  seconds: Number,
  milliseconds: Number,
  createdAt: Date,
  username: String
})

module.exports = mongoose.model('SpeedRun', speedRunSchema)
