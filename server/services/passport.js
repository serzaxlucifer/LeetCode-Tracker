const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {createSpreadsheet} = require('./sheets');
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

passport.use(new GoogleStrategy({

  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
  access_type: 'offline',  // This ensures that a refresh token is returned
  prompt: 'consent' ,

}, async (accessToken, refreshToken, expiry, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // insert spreadsheet!
      
      user = await new User({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        expiryDate: expiry.expires_in,
        accessToken: accessToken,
        refreshToken: refreshToken,
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