let express = require('express');
let router = express.Router();

let app = express();

// // Middleware for Express and Passport Session
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(require('express-session')({
//     secret: 'keyboard cat',
//     resave: true,
//     saveUninitialized: true
// }));
//

let passport = require('passport'); // for OAuth authentication
// app.use(passport.initialize());
// app.use(passport.session());


// User authentication
// Authentication: main menu route
router.get('/', function (req, res) {
    let html = "<ul>\
    <li><a href='/auth/github'>GitHub</a></li>\
    <li><a href='/auth/logout'>logout</a></li>\
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

let GithubStrategy = require('passport-github').Strategy;
passport.use(new GithubStrategy({
        clientID: "32b333ed43fccdfeedce",
        clientSecret: "d8ce6ad33907334c946c8bdac08e9820f3473330",
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// we will call this to start the GitHub Login process
router.get('/github', passport.authenticate('github'));

// GitHub will call this URL after authentication
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('http://localhost:4200');
        alert(req.user + 'is now logged in');
    }
);


module.exports = router;