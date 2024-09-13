const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {createSpreadsheet} = require('./sheets');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const User = require('../models/User'); // Adjust the path as necessary

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
} );

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user); 
  } catch (err) {
    done(err, null); 
  }
});

function encryptToken(token) {
  const ciphertext = CryptoJS.AES.encrypt(token, process.env.AES_SECRET  , {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
  }).toString();
  return ciphertext;
}

passport.use(new GoogleStrategy({

  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + '/auth/google/callback',
  access_type: 'offline',  // This ensures that a refresh token is returned
  prompt: 'consent' ,

}, async (accessToken, refreshToken, expiry, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    const encryptedToken = encryptToken(accessToken);
    const refreshEncToken = encryptToken(refreshToken);
    console.log(accessToken);
    console.log("RTT: ", refreshToken);
    console.log("AT: ", encryptedToken);
    console.log("RT: ", refreshEncToken);

    if (!user) {
      // insert spreadsheet!

      const encryptedToken = encryptToken(accessToken);
      const refreshEncToken = encryptToken(refreshToken);
      console.log(encryptedToken);
      console.log(refreshEncToken);
      
      user = await new User({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        expiryDate: expiry.expires_in,
        accessToken: encryptedToken,
        refreshToken: refreshEncToken,
      }).save();
      
      const req = {user: user};
      const sid = await createSpreadsheet("LeetCode Tracker", req);

      user.spreadSheetId = sid;
      await user.save();
    }

    done(null, user);
  } catch (err) {
    console.log(err.message);
    done(err, null);
  }
}));