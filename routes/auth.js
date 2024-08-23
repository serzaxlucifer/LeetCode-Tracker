const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require( "jsonwebtoken" );

require("dotenv").config(); 

router.get('/google',

  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets'], accessType: "offline",
    approvalPrompt: "force"
})
);

/* JWT */
//Create a playload

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    
    //Generate JWT token
    const playload = {
      _id: req.user._id
    };

    const jwtToken = jwt.sign( playload, process.env.JWT_SECRET);
    // We'll send a JWT token

    res.status(200).json({ message: 'Authentication successful', token: jwtToken });
  }
);

module.exports = router;
