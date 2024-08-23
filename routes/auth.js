const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require( "jsonwebtoken" );

require("dotenv").config(); 

router.get('/google',

  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets'] })
);

/* JWT */
//Create a playload

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    
    //Generate JWT token
    const playload = {
      id: req.user._id
    };

    const jwtToken = jwt.sign( playload, process.env.JWT_SECRET, {expiresIn:"2h"} );

    res.status(200).json({ message: 'Authentication successful', token: jwtToken });
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
