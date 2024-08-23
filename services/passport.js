const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
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
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      // insert spreadsheet!
      console.log("Creating user!");

      user = await new User({
        email: profile.emails[0].value,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }).save();

      console.log("Passing UID ", user._id);
      const sid = await createSpreadsheet("LT TESTER", user._id);
      console.log(sid);

      user.spreadSheetId = sid;
      await user.save();
      console.log("SID updated!");
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));