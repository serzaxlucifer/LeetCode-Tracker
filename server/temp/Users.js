const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    googleID: { type: String, Required: true },
    leetcode_id: { type: String },
    displayName: String,
    firstName: String,
    lastName: String,
    expiryDate: Date,
    accessToken: String,
    refreshToken: String,
    storeToDB: {
        type: Boolean,
        default: true
    },
    createdAt: 
    {
        type: Date,
        default: Date.now
    },
    spreadSheetID:
    {
        type: String
    }
});



module.exports = mongoose.model( "Users", userSchema )