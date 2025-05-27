require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken = (req , res , next) => {
  const token = req.cookies.jwt;
  if(!token){
    return res.status(401).json({
      success : false,
      message : "Access Denied !",
    });
  }

  try{
    const decoded = jwt.verify(token , process.env.JWT_KEY);
    req.user = decoded;
    next();
  }
  catch(error){
    return res.status(403).json({
      success : false,
      message : "Invalid Token!",
    })
  }
}

module.exports = verifyToken;