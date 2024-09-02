
const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => 
{
  try{
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies?.token || req.body?.token;
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
    if(!user)
    {
        return res.status(400).json({message: "USER NOT FOUND!"});
    }
    req.user = user;

    next();

  } 
  catch(err)
  {
    return res.status(500).json({
      success:false,
      message: "Error while Authorization!"
    });
  }
};
