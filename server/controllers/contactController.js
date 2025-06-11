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
          // keep the msgs where user is either sender or receiver , because we want the msgs related to user only
          $or : [{sender : userId} , {recipient : userId}],
        }
      },
      { 
        // sort msgs from newest (first) --> oldest(last)
        $sort : {timestamp : -1}  ,
      }
      ,{
        // 
        $group : {
          _id : {
            $cond : {
              if : {$eq : ["$sender" , userId]},
              then : "$recipient",
              else : "$sender",
            },
          },
          lastMessageTime : {$first : "$timestamp"}

          /* equivalent simpler , intuitive syntax --> 
             this all get wrapped inside the _id 
            _id = {
              DMcontactId = (message.sender === userId) ? message.recipient : message.sender;
            }
            All these grouping results are wrapped inside _id field by mongoDB , it's a convention to keep all the results of grouping inside _id field
          */
        },
      },
      {
        $lookup : {
          from : "users", // document User tha , docs par query krte time User --> users (small case and plural) mein change ho jata h....
          localField : "_id", // from grouped results
          foreignField : "_id", // from user's collection
          as : "contactInfo",
        },

        /* The lookup is essentially saying ----> 
          "Take the _id from our current pipeline document (which is a contact's user ID , that we got after grouping query), and find the user in the 'users' collection who has that same _id." */
      },
      {
        $unwind : "$contactInfo",
        // Convert contactInfo from [ {...} ] to {...} (from Array to Object)
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
    });
  }
}

module.exports = {searchContacts , getContactForDmList}