const mongoose = require("mongoose");

const userSchema = new mongoose.Schema( {
    //googleId: { type: String, required: true }, // Use camelCase and lowercase "required"
    leetcodeId: { type: String , default: ""
    }, // Consistent camelCase
    displayName: String,
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    firstName: String,
    lastName: String,
    expiryDate: Number,
    accessToken: String,
    refreshToken: String,
    storeToDB: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    spreadSheetId: {
        type: String,
        default: ""
    },
    totalSubmissions: {
        type: Number,
        default: 0
    }
} );

module.exports = mongoose.model( "User", userSchema ); // Use singular model name
