const mongoose = require('mongoose');//mongoose module
const Schema = mongoose.Schema;

//structure of table
const User = new Schema({
    userName: {  type: String, required: true },
    email: { type: String, required: true, unique: true },
    password:{type:String,required:true},
    
}, {
  timestamps: true
})

module.exports = mongoose.model('User', User);