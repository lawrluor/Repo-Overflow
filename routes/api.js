let express = require('express');
let router = express.Router();
let request = require('request-promise'); // using request-promise module
let mongoose = require('mongoose');
let zlib = require('zlib');
// let ensureAuthenticated = require('./auth');

// Import schemas
let Repo = require('../models/repos'); // import Repo schema, representing a Github repository
let Tag = require('../models/tags'); // import Tag schema, representing a Stack Overflow topic tag

/* REPOSITORIES ROUTE: Displays repositories related to the most popular Stack Overflow tags
** Routes: front-end: http://localhost:4200/repositories, linked to back-end (routes/api.js): http://localhost:3000/api/repositories
** 1. Call to Stack Overflow API to get top tag to query in Github
** 2. Display Github query results as list on front end
**/
router.get('/repositories', function(req, res) {
    let overflow_promise = overflowGet(); // call to helper function to return last 24 hours' most popular Stack Overflow tags
    overflow_promise.then(function(body) {
        top_tag = body['items'][1]['name']; // store the most popular tags in variable
        console.log(top_tag);

        // Make query to Github API, inserting the top tags as parameters of query string
        let options = {
            uri: 'https://api.github.com/search/repositories?q=topic:' + top_tag,
            qs: {}, // qs concatenating format doesn't work for this format of query because it adds a '?' char for each query
            headers: {'User-Agent': 'Request-Promise'},
            json: true // Automatically parses the JSON string in the response; no need to use JSON.parse(body)
        };

        // Make request promise
        request(options)
            .then(function(body) {
                console.log("body", body['items']); // body may be empty if no related repos related to the top tag are found from searching Github
                if (body.length===0) {
                    console.log('body is empty');
                } else {
                    console.log('body not empty');
                }

                // Create and send list of top related Github repos to be sent to front end for display
                let top_repos = [];
                for (i = 0; i < 5; i++) {
                    current_item = body['items'][i];
                    top_repos.push(current_item);
                }
                res.send(top_repos)
            });
    });
});

// Helper function to return a JSON body consisting of top Tags from StackOverflow API from the last 24 hours
let overflowGet = () => {
    return new Promise((resolve, reject) => {
        let date_promise = getDate(); // make call to helper function to get query dates
        console.log("date_promise", date_promise);
        date_promise.then(function(dates) { // extract value from date_promise, execute rest of function
            let reqData = {
                url: "https://api.stackexchange.com/2.2/tags?site=stackoverflow",
                headers: {'Accept-Encoding': 'gzip'},
                qs: {
                    fromdate: dates.previous_date, // dates.previous_date
                    todate: dates.current_date, // dates.current_date
                    order: 'desc',
                    sort: 'popular',
                    site: 'stackoverflow',
                    key: 'uBIHkVmbVkHq6MNChKnpGQ(('
                }
            };

            // Data from Stack Overflow API is chunked. Intercept the data stream chunks and aggregate the body piece by piece
            // Adapted from https://stackoverflow.com/questions/27386119/http-request-to-stackexchange-api-returns-unreadable-json?rq=1
            let gunzip = zlib.createGunzip();
            let body = "";
            gunzip.on('data', function (data) {
                body += data.toString();
            });
            gunzip.on('end', function () {
                body = JSON.parse(body);
                if (body) {
                    resolve(body);
                } else {
                    reject("error");
                }
            });
            request(reqData)
                .pipe(gunzip);
            // End functionality:
            // let body = overflowGet();
            // res.json(body);
        });
    });
};

// Helper function to get dates for querying. Queries for top results between current time and 24 hours before before
let getDate = () => {
    // Calculate date: Stack Overflow counts time in seconds (from the standard Jan 1, 1970). getTime counts milliseconds
    // Overflow: https:/api.stackexchange.com//2.2/tags?fromdate=1498521600&todate=1498608000&order=desc&sort=popular&site=stackoverflow
    // getTime() https://api.stackexchange.com/2.2/tags?fromdate=1498573451962&todate=1498659851962&order=desc&sort=popular&site=stackoverflow
    return new Promise((resolve, reject) => {
        let d = new Date();
        let current_date = Math.trunc((d.getTime() / 1000)); // convert from milliseconds to seconds
        let previous_date = current_date - 86400; // subtract number of seconds in 1 day to go back one day
        let dates = {'previous_date': previous_date, 'current_date': current_date};
        if (!isEmpty(dates)) {
            resolve(dates);
        } else {
            reject("error");
        }
    });
};

// Helper function to check if dictionary object is empty
// Taken from: https://stackoverflow.com/questions/6072590/how-to-match-an-empty-dictionary-in-javascript
function isEmpty(obj) {
    return Object.keys(obj).length===0;
}

// Middleware to ensure user is authenticated to be used on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session), request will proceed.
// Otherwise, the user will be redirected to the login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // req.user is available for use here
        console.log('user logged in');
        return next();
    }

    // Else: Access denied, Redirect to login
    console.log('user not logged in');
    res.redirect('http://localhost:3000/auth/github')
}

/* ARCHIVE - Protected Route
 ** The archive displays popular Github repositories from previous days from the database.
 ** You must be logged in to view this route; it is protected by ensureAuthenticated function
 ** Routes: front-end: http://localhost:4200/archive, linked to back-end (routes/api.js): http://localhost:3000/api/archive
 ** 1. Call Mongo database to get list of all repositories in database
 ** 2. Display all repositories as list of Repo objects on front end
 */
router.get('/archive', ensureAuthenticated, function(req, res) {
    console.log("Access granted. Welcome to the Archive");
    Repo.find(function(err, repos){
        res.json(repos);
    });


});


/* TEST ROUTES FOR APIS: Stack Overflow and Github
** Feel free to ignore these routes
*/

// GET call to StackOverflow API to grab tags
router.get('/overflow', function(req, res, next) {
    let api_promise = overflowGet(); // call to helper function to get JSON body
    console.log("api_promise:", api_promise);
    api_promise.then(function(body) {
        res.json(body);
    });
});

// GET call to github API
router.get('/github', function(req, res) {
    let options = {
        uri: 'https://api.github.com/search/repositories?q=topic:python',
        qs: {}, // qs concatenating format doesn't work for this format of query because it adds a '?' char for each query
        headers: {'User-Agent': 'Request-Promise'},
        json: true // Automatically parses the JSON string in the response; no need to use JSON.parse(body)
    };

    request(options)
        .then(function(body) {
            console.log(body['items']); // JSON body returned from get request to API
            // res.send(body);

            // save to DB
            let top_repos = []; // list of repos to be sent to front end for display
            for (i = 0; i < 5; i++) {
                current_item = body['items'][i];
                top_repos.push(current_item); // push repos in list items
                console.log('pushed'); // pushing before finish - add callback

                // save to database
                // saveRepo(current_item);

            }
            res.send(top_repos) // new route to load top repos
        })
        .catch(function(err) {
            // If any of the above fails, go here
            console.log('failed');
        });
});


/* DATABASE FUNCTIONS: these are not used in the main app */

// GET stored Repos from from Mongo database
router.get('/archived_repositories', function(req, res, next) {
    Repo.find(function(err, repos){
        res.json(repos);
    });
});

router.get('/tags', function(req, res) {
    let tags = getTags();
    res.json(tags);
});

// GET stored Tags from Mongo database
let getTags = () => {
    Tag.find(function(err, tags){
        console.log(tags);
        return tags;
    });
};

// Helper function that takes a JSON object representing a Tag and saves it to the database
let saveTag = (obj) => {
    newTag = new Tag();
    newTag.name = obj['name'];
    newTag.count = obj['count'];
    newTag.save(function() {
        console.log("Saved Tag: " + newTag.name);
    });
};

// Helper function that takes a JSON object representing a Repo and saves it to the database
let saveRepo = (obj) => {
    let newRepo = new Repo();
    newRepo.repo_id = obj['repo_id'];
    newRepo.name = obj['name'];
    newRepo.url = obj['url'];
    newRepo.description = obj['description'];
    newRepo.owner = obj['owner']['login'];
    newRepo.avatar = obj['owner']['avatar_url'];
    newRepo.save(function() {
        console.log("Saved Repo: " + newRepo.name);
    });
};

module.exports = router;