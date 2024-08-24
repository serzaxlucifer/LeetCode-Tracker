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

    const expires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    const jwtToken = jwt.sign( playload, process.env.JWT_SECRET);

    res.cookie('token', jwtToken, {
      expires,
      httpOnly: false,  // Prevents access via JavaScript
      secure: true,    // Ensures cookie is sent only over HTTPS
      sameSite: 'None', // Allows cross-origin requests
      domain: 'localhost'
  });

  // Send a response that closes the OAuth window
  res.send(`
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Authentication Complete</title>
        </head>
        <body>
            <script type="text/javascript">
                window.opener.postMessage('auth-success', 'http://localhost:3000');
            </script>
            <p>Authentication complete. You can close this window.</p>
        </body>
        </html>
  `);
    // We'll send a JWT token

  //   res.cookie('jwtToken', token, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'None', // Allows the cookie to be sent with cross-origin requests
  //     //domain: '.your-frontend-domain.com'
  // });

    // res.redirect('https://your-frontend-domain.com/dashboard');
    //res.status(200).json({ message: 'Authentication successful', token: jwtToken });
  }
);

module.exports = router;
