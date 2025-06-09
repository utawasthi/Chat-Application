const Messages = require("../models/MessageModel");

const getAllMessages = async (req , res) => {
  try{

    const user1 = req.user.userId;
    const user2 = req.query.id;

    if(!user1 || !user2){
      return res.status(400).send("Both user's Id are required !!");
    }
    
    const messages = await Messages.find({
      $or : [
        {sender : user1 , recipient : user2},
        {sender : user2 , recipient : user1},
      ],
    }).sort({timestamps : 1});

    return res.status(200).json({
       success : true,
       messages,
    });

  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while fetching messages : ${error}`
    })
  }
}

module.exports = {getAllMessages};