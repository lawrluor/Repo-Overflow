let express = require('express');
let router = express.Router();
let request = require('request-promise'); // using request-promise module
let mongoose = require('mongoose');
let zlib = require('zlib');
let stream = require('stream');
let ensureAuthenticated = require('./auth')

let Repo = require('../models/repos'); // import Repo schema
let Tag = require('../models/tags'); // import Tag schema

// GET related repositories from previous days from Mongo database
router.get('/archived_repositories', function(req, res, next) {
    Repo.find(function(err, repos){
        res.json(repos);
    });
});

// Helper function for /overflow. returns top Tags as JSON body from StackOverflow API from the last 24 hours
let overflowGet = () => {
    return new Promise((resolve, reject) => {
        let date_promise = getDate(); // resolved Promise
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

// Helper function to check if dictionary object is empty
function isEmpty(obj) {
    return Object.keys(obj).length===0;
}

// Helper function to get date window for /overflow. Queries for top results between current time and 1 day before
let getDate = () => {
    // Calculate date: Stack Overflow counts time in seconds (from the standard Jan 1, 1970). getTime counts milliseconds
    // Overflow: https:/api.stackexchange.com//2.2/tags?fromdate=1498521600&todate=1498608000&order=desc&sort=popular&site=stackoverflow
    // getTime() https://api.stackexchange.com/2.2/tags?fromdate=1498573451962&todate=1498659851962&order=desc&sort=popular&site=stackoverflow
    return new Promise((resolve, reject) => {
        let d = new Date();
        let current_date = Math.trunc((d.getTime() / 1000)); // convert from milliseconds to seconds
        let previous_date = current_date - 86400;
        let dates = {'previous_date': previous_date, 'current_date': current_date};
        if (!isEmpty(dates)) {
            resolve(dates);
        } else {
            reject("error");
        }
    });
};

// GET call to StackOverflow API to grab tags
router.get('/overflow', function(req, res, next) {
    let api_promise = overflowGet(); // call to helper function to get JSON body
    console.log("api_promise:", api_promise);
    api_promise.then(function(body) {
        res.json(body);
    });
});

router.get('/repositories', function(req, res) {
    let overflow_promise = overflowGet();
    overflow_promise.then(function(body) {
        top_tag = body['items'][1]['name'];
        console.log(top_tag);

        let options = {
            uri: 'https://api.github.com/search/repositories?q=topic:' + top_tag,
            qs: {}, // qs concatenating format doesn't work for this format of query because it adds a '?' char for each query
            headers: {'User-Agent': 'Request-Promise'},
            json: true // Automatically parses the JSON string in the response; no need to use JSON.parse(body)
        };

        request(options)
            .then(function (body) {
                console.log("body", body['items']); // may be empty if no related repos related to the top tag are found from searching Github
                if (body.length===0) {
                    console.log('body is empty');
                } else {
                    console.log('body not empty');
                }
                let top_repos = []; // list of repos to be sent to front end for display
                for (i = 0; i < 5; i++) {
                    current_item = body['items'][i];
                    top_repos.push(current_item); // push repos in list items
                }
                res.send(top_repos) // new route to load top repos
            });
    });
});

// GET call to github API
router.get('/github', function(req, res) {
    // Get tags from /api/overflow
    // let tags = /overflow
    // let top_tag = tags[0]
    let options = {
        uri: 'https://api.github.com/search/repositories?q=topic:', // + tags[0],
        //uri: 'https://api.github.com/search/repositories',
        // qs concatenating format doesn't work for this format of query because it adds a '?' char for each query
        qs: {},
        headers: {'User-Agent': 'Request-Promise'},
        json: true // Automatically parses the JSON string in the response; no need to use JSON.parse(body)
    };
    console.log(options);
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
        // .catch(function(err) {
        //     // If any of the above fails, go here
        //     console.log('failed');
        // });

    // let Token = "8eb8fbcfc2238ddefbddc57d11e6b4137649fc1e";
    // let githubAPI = "https://api.github.com/users/lawrluor";
    // let githubOptions = {
    //     headers: {
    //         'User-Agent': 'lawrluor', // required by Github API as identification
    //         'Authorization': Token,
    //         'Accept-Language': 'en_US', // set language
    //         'Content-Type': 'application/JSON', // set input
    //     }
});

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

// GET all Tags from database
let getTags = () => {
    Tag.find(function(err, tags){
        console.log(tags);
        return tags;
    });
};

router.get('/tags', function(req, res) {
    let tags = getTags();
    res.json(tags);
});

module.exports = router;