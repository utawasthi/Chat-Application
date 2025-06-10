const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const Messages = require("../models/MessageModel");

const searchContacts = async (req, res) => {
  try {

    const { searchTerm } = req.body;
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "Search Term is required!",
      });
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        {
          _id: { $ne: req.userId }
        },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    return res.status(200).json({
      success : true,
      message : "Contact searched successfully !",
      contacts : contacts,
    });
  }
  catch (error) {
    return response.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    })
  }
}

const getContactForDmList = async (req , res) => {
  try{
    let userId = req.user.userId;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Messages.aggregate([
      {
        $match : {
          $or : [{sender : userId} , {recipient : userId}],
        }
      },
      {
        $sort : {timestamp : -1}  ,
      }
      ,{
        $group : {
          _id : {
            $cond : {
              if : {$eq : ["$sender" , userId]},
              then : "$recipient",
              else : "$sender",
            },
          },
          lastMessageTime : {$first : "$timestamp"}
        },
      },
      {
        $lookup : {
          from : "users",
          localField : "_id",
          foreignField : "_id",
          as : "contactInfo",
        },
      },
      {
        $unwind : "$contactInfo",
      },
      {
        $project : {
          _id : 1 ,
          lastMessageTime : 1,
          email : "$contactInfo.email",
          firstName : "$contactInfo.firstName",
          lastName : "$contactInfo.lastName",
          image : "$contactInfo.image",
          color : "$contactInfo.color",
        },
      },
      {
        $sort : {lastMessageTime : -1} ,
      }
    ]);
    
    return res.status(200).json({
      success : true,
      message : "Contact searched successfully !",
      contacts : contacts,
    });
  }
  catch(error){
    return response.status(500).json({
      success: false,
      message: "Internal Server Error!!",
    })
  }
}

module.exports = {searchContacts , getContactForDmList}