const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = async (req, res, next) => 
{
  // Write JWT Code.
  
  const user = await User.findById();
  if (!user) {
    return res.status(401).send('User not found');
  }
  
  req.user = user;
  next();
};
