let express = require('express');
let router = express.Router();
let request = require('request-promise'); // using request-promise module
let mongoose = require('mongoose');
let zlib = require('zlib');
let util = require('util');
let stream = require('stream');

let Repo = require('../models/repos'); // import Repo schema
let Tag = require('../models/tags'); // import Tag schema

// GET related repositories from previous days from Mongo database
router.get('/repositories', function(req, res, next) {
    Repo.find(function(err, repos){
        res.json(repos);
    });
});

// GET call to StackOverflow API to grab tags
router.get('/overflow', function(req, res, next) {
    let reqData = {
        url: "https://api.stackexchange.com/2.2/tags?site=stackoverflow",
        headers: {'Accept-Encoding': 'gzip'}
        // qs: {
        //     fromdate: '1498262400',
        //     todate: '1498348800',
        //     order: 'desc',
        //     sort: 'popular',
        //     site: 'stackoverflow',
        //     key: 'uBIHkVmbVkHq6MNChKnpGQ(('
    };

    // Data from Stack Overflow API is chunked. Intercept the data stream chunks and aggregate the body piece by piece
    // Adapted from https://stackoverflow.com/questions/27386119/http-request-to-stackexchange-api-returns-unreadable-json?rq=1
    let gunzip = zlib.createGunzip();
    let body = "";
    gunzip.on('data', function(data){
        body += data.toString();
    });
    gunzip.on('end', function(){
        body = JSON.parse(body);

        // DO THINGS WITH THE BODY
        console.log(body);
        res.send(body);
    });
    request(reqData)
        .pipe(gunzip);
});

// GET call to StackOverflow API
router.get('/overflow_reference', function (req, res, next) {
    let url = 'https://api.stackexchange.com/2.2/tags?site=stackoverflow';
    let options = {
        qs: {
            fromdate: '1498262400',
            todate: '1498348800',
            order: 'desc',
            sort: 'popular',
            site: 'stackoverflow',
            key: 'uBIHkVmbVkHq6MNChKnpGQ(('
        },
        headers: {'Accept-Encoding': 'gzip'}
    };
    request(options)
        .then(function(body) {
            console.log(body);
            for (i = 0; i < 5; i++) {
                let current_item = body['items'][i];
                saveTag(current_item);
            }
        })
        .catch(function(err) {
            console.log('Saved Tags');
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
                saveRepo(current_item);

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