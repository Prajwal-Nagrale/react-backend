const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendsSchema=new Schema({
  friendEmail:String,
  status:String,
}, {
  timestamps: true
})

const Member = new Schema({
    userEmail: { type: String},
    friends:[friendsSchema],
}, {
  timestamps: true
})

//module.exports = mongoose.model('member', Member);