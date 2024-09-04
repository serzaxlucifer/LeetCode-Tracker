const express = require('express');
const session = require('express-session');
const Submissions = require("./routes/submissions");
const Dashboard = require("./routes/dashboard");
const Ping = require("./routes/ping");
const authRoutes = require('./routes/auth'); // Auth routes
const passport = require('passport');
const config = require('./config/mongoViewConfig');
const { recreateMaterializedView } = require('./services/materializedViews'); 
const { connect } = require('./config/database');    // Import the connect function from database.js
const cors = require("cors");
require('dotenv').config({ path: './server/.env' }); // Specify the path to the .env file
require('./services/passport'); 


const app = express();

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://leetcode.com', 'https://leetcode-tracker.pages.dev'],
    credentials: true,
}));

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

app.use(session({
    secret: process.env.SESSION_SECRET, // Secret key for signing session cookies
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production',  httpOnly: true }, // Set secure flag in production
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/submissions', Submissions);
app.use('/dashboard', Dashboard);
app.use('/ping', Ping);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
