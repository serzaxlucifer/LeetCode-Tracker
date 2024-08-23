const express = require('express');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/mongoViewConfig');
const { recreateMaterializedView } = require('./services/materializedViews'); 
const { connect } = require('./config/database'); // Import the connect function from database.js
require('dotenv').config({ path: './server/.env' }); // Specify the path to the .env file


const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connect(); 


const checkForChanges = async () => 
{
    if (config.getChangesDetected()) 
    {
        console.log('RECREATING CACHED VIEWS: Changes detected. Recreating materialized view.');
        await recreateMaterializedView();
        config.setChangesDetected(false); // Reset flag
    } 
    else 
    {
        console.log('RECREATING CACHED VIEWS: No changes detected.');
    }
};

setInterval(checkForChanges, 30 * 60 * 1000); // 30 minutes


/*app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key for signing session cookies
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Set secure flag in production
}));*/

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());


require('./services/passport'); // Passport configuration (Google OAuth)
const authRoutes = require('./routes/auth'); // Auth routes


app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the app!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
