const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  firstName : {
    type : String , 
    required : false,
  },
  lastName : {
    type : String , 
    required : false,
  },
  email : {
    type : String , 
    required : true,
  },
  password : {
    type : String , 
    required : true,
  },
  color : {
    type : Number ,
    required : false,
  },
  image : {
    type : String , 
    required : false,
  },
  profileSetup : {
    type : Boolean,
    required : false,
  }
} , {timestamps : true});

// hash the password before saving

userSchema.pre('save' , async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password , salt);
  next();
})

module.exports = mongoose.model('User' , userSchema);