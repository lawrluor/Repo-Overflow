let express = require('express');
let mongoose = require('mongoose');
let bodyparser = require('body-parser');
let cors = require('cors');

// Register App
let app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/repo_overflow'); // address of database is localhost, database name
mongoose.connection.on('connected', ()=>{
    console.log('Connected to database mongodb @ 27017'); // on connection, call function to print success message
});
mongoose.connection.on('error', ()=>{
    if (err) {
        console.log('Error in database connection:' + err); // on error, cal function to print err message
    }
});

// Register Middleware
app.use(cors());
// app.use(bodyparser.json());

// Middleware for Express and Passport Session
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

let passport = require('passport'); // for OAuth authentication
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    // placeholder for custom user serialization
    // null is for errors
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    // placeholder for custom user deserialization.
    // maybe you are going to get the user from mongo by id?
    // null is for errors
    done(null, user);
});

// Register routes
app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, ()=>{
    console.log('Server started at port:' + 3000);
});