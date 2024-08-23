const mongoose = require('mongoose');
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongoose').Types;

module.exports = async (req, res, next) => 
{
  console.log("INSIDE AUTH");
  try{
    console.log("INSIDE AUTH");
    //Extracting token
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token || req.body?.token;
    console.log("TOKEN: ", token);

    //Checking presence of token
    if(!token)
    {
      return res.status(401).json({
          success:false,
          message:"Token is missing!"
          });
    }

    //Verifing Token
    let decoded;
    try
    {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        
    } 
    catch(err)
    {
      return res.status(401).json({
          success:false,
          message:"Invalid Token ( Inside middleware auth ) !"
        });
    }

    let user = await User.findById(decoded._id);
    req.user = user;
    next();

  } 
  catch(err)
  {
    console.log(err.message);
    return res.status(500).json({
      success:false,
      message: "Error while Authorization!"
    });
  }
};
