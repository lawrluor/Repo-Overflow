let mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    githubId: Number, // parse ObjectId value: ObjectId("59532a9f1634e53de261c6b5")
    name: String,
    email: String,
    username: String,
    provider: String,
    // accessToken: String,
    // github: JSON // saves entire JSON of user profile
});

// export model schema: this is what is returned or passed back to require method calls
const User = module.exports = mongoose.model('User', UserSchema);
