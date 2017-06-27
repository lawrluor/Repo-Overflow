let mongoose = require('mongoose');

// Create the movieSchema.
let TagSchema = mongoose.Schema({
    name: String, // item['name']
    count: Number // item['count']
});

// export model schema: this is what is returned or passed back to require method calls
const Tag = module.exports = mongoose.model('Tag', TagSchema); // export model for use

let sample = {
    "has_synonyms":true,
    "is_moderator_only":false,
    "is_required":false,
    "count":1277850,
    "name":"java"
};