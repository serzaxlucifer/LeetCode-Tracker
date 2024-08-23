const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {createSpreadsheet} = require('./sheets');

require('dotenv').config();

const User = require('../models/User'); // Adjust the path as necessary

passport.serializeUser((user, done) => {
  console.log("Serializing User");
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
    console.log("Back to Passport");
    console.log("AccessToken ", accessToken);
    console.log("RefreshToken, ", refreshToken);
    console.log("Profile ", profile);

    let user = await User.findOne({ email: profile.emails[0].value });

    console.log("User ", user);

    if (!user) {
      // insert spreadsheet!
      console.log("Creating user!");
      
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
      console.log(sid);

      user.spreadSheetId = sid;
      await user.save();
      console.log("SID updated!");
    }

    console.log("Calling Done");

    done(null, user);
  } catch (err) {
    console.log(err.message);
    done(err, null);
  }
}));