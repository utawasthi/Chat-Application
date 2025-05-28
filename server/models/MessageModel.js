const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
  sender : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : true
  },
  recipient : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : false,
  },
  msgType : {
    type : String,
    enum : ["text" , "file"],
    required : true,
  },
  content : {
    type : String,
    required : function () {
      return this.msgType == 'text';
    }
  },
  fileUrl : {
    type : String ,
    required : function () {
      return this.msgType == 'file';
    }
  },
  timestamp : {
    type : Date,
    default : Date.now,
  },
});

modules.exports =  mongoose.model("Messages" , msgSchema);