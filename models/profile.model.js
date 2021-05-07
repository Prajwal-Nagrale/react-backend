const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const friendsSchema=new Schema({
  friendEmail:{type:String},
}, {
  timestamps: true
})



const Profile = new Schema({
    userName: {  type: String, required: true },
    email: { type: String, required: true, unique: true },
    city:{type:String},
    state:{type:String},
    gender:{type:String},
    photos:[String],
    profession:{type:String},
    profileImage:{type:String},
    createdAt: {
      type: Number,
      required: true
    },
    members:[friendsSchema],
}, {
  timestamps: true
})

module.exports = mongoose.model('Profile', Profile);