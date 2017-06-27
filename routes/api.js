let express = require('express');
let router = express.Router();
let request = require('request-promise'); // using request-promise module
let rq = require('request');
let mongoose = require('mongoose');
let zlib = require('zlib');
let util = require('util');
let stream = require('stream');

let Repo = require('../models/repos');
let Tag = require('../models/tags')

// GET related repositories from previous days from Mongo database
router.get('/repositories', function(req, res, next) {
    Repo.find(function(err, repos){
        res.json(repos);
    });
});

// GET call to Hacker News API, to return top 5 stories in 'best' category
router.get('/hacker_news', function(req, res, next) {
    request('https://api.stackexchange.com/2.2/tags?fromdate=1498262400&todate=1498348800&order=desc&sort=popular&site=stackoverflow&key=uBIHkVmbVkHq6MNChKnpGQ((', function(error, response, body) {
        if (!error && response.statusCode===200) {
            console.log(body); // Show full raw JSON payload
            let articles = JSON.parse(body); // Interpret JSON as list
            let display_articles = []; // list of articles to be sent to front end for display
            for (i = 0; i < 5; i++) {
                let article_json = getArticle(articles[i]);
                display_articles.push(article_json); // add JSON of article onto list
                console.log('pushed'); // pushing before finish - add callback
            }
            res.send(display_articles); // return first 5 stories in response
        }
    });
    // next(); // command to move on to the next middleware: allows browser to not hang
});

// format: https://hacker-news.firebaseio.com/v0/item/2921983.json?print=pretty
let getArticle = (article_id) => {
    url = 'https://hacker-news.firebaseio.com/v0/item/' + article_id + '.json?print=pretty';
    let options = {
        uri: url,
        qs: {},
        headers: {'User-Agent': 'Request-Promise'}
    };

    request(options)
        .then(function(body) {
            console.log(body);
        })
        .catch(function(err) {
            console.log('failed to get article');
        });
};

// GET call to StackOverflow API
router.get('/overflow', function (req, res, next) {
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

// GET call to StackOverflow API - version Z
router.get('/overflowz', function (req, res, next) {
    let url = 'https://api.stackexchange.com/2.2/tags?site=stackoverflow';
    let headers = {'Accept-Encoding': 'gzip'};

    let options = {
        qs: {
            fromdate: '1498262400',
            todate: '1498348800',
            order: 'desc',
            sort: 'popular',
            site: 'stackoverflow',
            key: 'uBIHkVmbVkHq6MNChKnpGQ(('
        }
    };

    console.log("SENDING REQ")

    rq.get({url: url, 'headers': headers})
        .pipe(zlib.createGunzip())
        .pipe(bod=process.stdout);

    const chunks = [];
    req.on("data", function (chunk) {
        chunks.push(chunk);
    });


    req.on("end", function () {
        let body = Buffer.concat(chunks);
        res.send(body);
    });



    console.log("RECEIVED REQ")

    // let bod = process.stdout;
    //console.log("TSTING", bod);
    // res.send(util.inspect(bod));

        // then(function (body) {
        //     let response = body.toString();
        //     // let response = JSON.parse(body.toString());
        //
        //     console.log(response); // JSON body returned from get request to API
        //     res.send(response)
        // })
        // .catch(function (err) {
        //     console.log('failed');
        // })
});

// GET call to StackOverflow API - version S
router.get('/overflows', function(req, res) {
    let options = {
        // uri: 'https://api.stackexchange.com/2.2/tags?fromdate=1498262400&todate=1498348800&order=desc&sort=popular&site=stackoverflow&key=uBIHkVmbVkHq6MNChKnpGQ((',
        uri: 'https://api.stackexchange.com/2.2/tags',
        headers: {'User-Agent': 'Request-Promise', 'Content-Type': 'application/json'},
        qs: {
            'sort':'popular',
            'site':'stackoverflow',
            'key':'uBIHkVmbVkHq6MNChKnpGQ(('
        }
        //uri: 'https://api.stackexchange.com/2.2/info?site=stackoverflow&key='uBIHkVmbVkHq6MNChKnpGQ((',
        //qs: {
        //    key: 'uBIHkVmbVkHq6MNChKnpGQ((',
        //     client_id: '10206',
        //     scope: 'write_access',
        //     redirect_uri: 'https://stackexchange.com/oauth/login_success'
        //},
        // headers: {'Content_Type': 'application/json'}
        // json: true // Automatically parses the JSON string in the response; no need to use JSON.parse(body)
    };
    console.log(options);
    request(options)
        .then(function (body) {
            console.log(body); // JSON body returned from get request to API
            res.send(body);
            // extract tags
            // pass to method to call github API using each tag as search queries
        })
        .catch(function (err) {
            // If any of the above fails, go here
            console.log('failed');
        });
});

// Helper function for /github GET function
let generate_query = (tags) => {
    let queryString = '';
    // create forEach loop
    // for tag in tags:
    //     'topic:' + tag + '+'
    return queryString;
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

// GET call to github API
router.get('/github', function(req, res) {
    // let tags = /overflow
    // let top_tag = tags[0]

    // Get Tags from db (temporarily)

    let options = {
        uri: 'https://api.github.com/search/repositories?q=topic:' + tags[0],
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
    //     },
    //     // Queries
    //     qs: {
    //
    //     }
    // };
    //
    // request.get(githubAPI, githubOptions).then(function(err, response) {
    //        if (!err && response.statusCode===200) {
    //            res.send(body);
    //            console.log(body);
    //        }
    //    });
});

module.exports = router;