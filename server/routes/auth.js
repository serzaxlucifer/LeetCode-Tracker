const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require( "jsonwebtoken" );

require("dotenv").config(); 

router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets'], accessType: "offline",
    approvalPrompt: "force",
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

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes from now
    const jwtToken = jwt.sign( playload, process.env.JWT_SECRET);


    res.cookie('token', jwtToken, {
      expires,
      httpOnly: false,  // Prevents access via JavaScript
      secure: true,     // Ensures cookie is sent only over HTTPS
      sameSite: 'None', // Allows cross-origin requests
      domain: process.env.DOMAIN
    });
    res.send(`
        <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Authentication Complete</title>
          </head>
          <body>
              <p>Authentication complete. You can close this window.</p>
          </body>
          </html>
    `);

   
  }
);

module.exports = router;
