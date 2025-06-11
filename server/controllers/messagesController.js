const Messages = require("../models/MessageModel");
const {mkdirSync, renameSync} = require('fs');

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
    }).sort({timestamp : 1});

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

const uploadFile = async (req , res) => {
  try{

    console.log("req object dekh lo bhai ----> " ,req);

    if(!req.file){
      return res.status(400).json({
        success : false,
        message : 'File is required !',
      });
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;

    mkdirSync(fileDir , {recursive : true});
    /*    recursive: true ensures:
      Parent directories (uploads/files/) are created if missing
      No errors if the directory already exists
    */

    renameSync(req.file.path , fileName); 
    /* 
      Moves the uploaded file from its temporary location (req.file.path)
      Renames it to the structured path (fileName)
      This is atomic (safer than copy+delete)

      Temporary Upload: /tmp/multer-abc123 → Final Location: uploads/files/1678901234567/report.pdf
    */
     
    return res.status(200).json({
       success : true,
       filePath : fileName,
    });
  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while fetching messages : ${error}`
    })
  }
}

module.exports = {getAllMessages , uploadFile};