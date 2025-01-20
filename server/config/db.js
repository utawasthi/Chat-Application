require('dotenv').config();
const mongoose = require('mongoose')

const URI = process.env.URI;

const connectToDB = async () => {
  try{
    await mongoose.connect(URI);
    console.log("Mongo DB connected successfully!!");
  }
  catch(error){
    console.log("Database connection failed... !!!"  , error);
  }
}

module.exports = connectToDB;