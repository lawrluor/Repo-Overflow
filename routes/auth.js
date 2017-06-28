let express = require('express');
let router = express.Router();

let User = require('../models/users'); // import User schema

// Authentication: main menu route
router.get('/', function(req, res) {
    let html = "<ul>\
    <li><a href='http://localhost:3000/auth/github'>GitHub</a></li>\
    <li><a href='http://localhost:3000/auth/logout'>logout</a></li>\
  </ul>";

    // dump the user for debugging
    if (req.isAuthenticated()) {
        html += "<p>authenticated as user:</p>"
        html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
    }
    res.send(html);
});

router.get('/logout', function(req, res){
    console.log('logging out');
    req.logout();
    res.redirect('/auth');
});

let passport = require('passport'); // for OAuth authentication
let GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
        clientID: "32b333ed43fccdfeedce", //GITHUB_CLIENT_ID
        clientSecret: "d8ce6ad33907334c946c8bdac08e9820f3473330", // GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        // check user table for anyone with a github ID of profile.id
        User.findOne({ githubId: profile.id }, function (err, user) {
            if (err) {
                return cb(err);
            }

            // If no user found, create new user with profile values from Github
            if (!user) {
                user = new User({
                    githubId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    username: profile.username,
                    provider: 'github',
                    // accessToken: String
                    // github: profile._json, // saves entire user profile - searching on User.findOne({'github.id': profile.id } will now match
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return cb(err, user);
                });
            } else {
                // found user in database, return
                return cb(err, user);
            }
        });
    }
));

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

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/auth');
    });

module.exports = router;