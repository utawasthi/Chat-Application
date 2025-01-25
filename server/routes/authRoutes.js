const express = require('express');
const { registerUser, loginUser, getUserInfo, updateProfile, addProfileImage , deleteProfileImage, logOut} = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const authRoutes = express.Router();
const multer = require("multer");


const upload = multer({dest : "uploads/profiles/"});

authRoutes.post('/signup' , registerUser);
authRoutes.post('/login' , loginUser);
authRoutes.get('/user-info' , verifyToken , getUserInfo);
authRoutes.post('/update-profile' , verifyToken , updateProfile);
authRoutes.post('/add-profile-image' , 
  verifyToken , 
  upload.single("profile-image"),
  addProfileImage
);

authRoutes.delete("/remove-profile-image" , verifyToken , deleteProfileImage);

authRoutes.post('/logout' , logOut);

module.exports = authRoutes;