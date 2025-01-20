const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {renameSync , unlinkSync, unlink} = require("fs");

const JWT_KEY = process.env.JWT_KEY;
const maxAge = 3 * 24 * 60 * 60 * 1000;

const genToken = (email , userId) => {
  return jwt.sign({ 
      email , 
      userId
    } ,
    JWT_KEY , 
    { 
      expiresIn : maxAge 
    }
  )
};

const registerUser = async (req , res) => {
  const {email , password} = req.body;
  try{
    if(!email || !password){
      return res.status(400).json({
        success : false,
        message : "user's credentials are invalid!"
      })
    }
    const newUser = await User.create({email , password});

    res.cookie("jwt" , genToken(email , newUser._id) , {
      maxAge , 
      secure : true,
      sameSite : "None",
     }
    );

    res.status(201).json({
      success : true,
      message : 'New User created successfully!',
      user : {
        userId : newUser._id,
        email : newUser.email,
        password : newUser.password,
        profileSetup : newUser.profileSetup,
      } 
    })
  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while registering : ${error}`
    })
  }
}

const loginUser = async (req , res) => {
  try{
    const {email , password} = req.body;
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        success : false,
        message : "User not found!"
      });
    }

    const isMatch = await bcrypt.compare(password , user.password);
    if(!isMatch){
      return res.status(400).json({
        success : false,
        message : 'Invalid credentials!',
      });
    }

    res.cookie("jwt" , genToken(email , user._id) , {
      maxAge , 
      secure : true,
      sameSite : "None",
     }
    );

    return res.status(200).json({
      success : true,
      message : 'Logged In Successfully!',
      user : {
        id : user._id,
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName,
        profileSetup : user.profileSetup,
        image : user.image,
        color : user.color,
      }
    });

  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while logging in : ${error}`
    })
  }
}

const getUserInfo = async (req , res) => {
  try{

    const userId = req.user.userId;
    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({
        success : false,
        message : "User not found!",
      });
    }

    return res.status(200).json({
      success : true,
      message : 'Logged In Successfully!',
      user : {
        id : user._id,
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName,
        profileSetup : user.profileSetup,
        image : user.image,
        color : user.color,
      }
    });

  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while fetching user info : ${error}`
    })
  }
}

const updateProfile = async (req , res) => {
  try{
    
    const userId = req.user.userId;
    const {firstName , lastName , color} = req.body;

    if(!firstName || !lastName || color === undefined){
      return res.status(400).send("FirstName LastName and Color is required !");
    }

    const userData = await User.findByIdAndUpdate(
      userId , 
      {
        firstName , 
        lastName , 
        color, 
        profileSetup : true,
      },
      {new : true , runValidators : true}
    );
    

    return res.status(200).json({
      success : true,
      message : 'User info updated successfully !',
      user : {
        id : userData._id,
        email : userData.email,
        firstName : userData.firstName,
        lastName : userData.lastName,
        profileSetup : userData.profileSetup,
        image : userData.image,
        color : userData.color,
      }
    });

  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while updating user info : ${error}`
    })
  }
}

const addProfileImage = async (req , res) => {
  try{
    
    if(!req.file){
      return res.status(400).send("File is required!");
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path , fileName);

    const updatedUser = await User.findByIdAndUpdate(req.user.userId , 
      {image : fileName},
      {new : true , runValidators : true},
    );

    return res.status(200).json({
      success : true,
      message : "Image uploaded successfully!",
      image : updatedUser.image,
    });
  }
  catch(error){
    res.status(500).json({
      success : false ,
      message : `Error while uploading profile image : ${error}`
    })
  }
}

const deleteProfileImage = async (req , res) => {
  try{
    
    const userId = req.user.userId;
    const updatedUser = await User.findById(userId);

    if(!updatedUser){
      return res.status(404).json({
        success : false,
        message : "User not found!",
      });
    }

    if(updatedUser.image){
      unlinkSync(updatedUser.image);
    }

    updatedUser.image = null;
    await updatedUser.save();

    return res.status(200).json({
      success : true,
      message : 'Profile Image deleted successfully !',
      user : {
        id : updatedUser._id,
        email : updatedUser.email,
        firstName : updatedUser.firstName,
        lastName : updatedUser.lastName,
        profileSetup : updatedUser.profileSetup,
        image : updatedUser.image,
        color : updatedUser.color,
      }
    });

  }
  catch(error){
    console.log(error);
    res.status(500).json({
      success : false ,
      message : `Error while updating user info : ${error}`
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  updateProfile,
  addProfileImage,
  deleteProfileImage,
}