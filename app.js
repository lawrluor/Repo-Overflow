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
app.use(bodyparser.json());

// Register routes
const api = require('./routes/api');
app.use('/api', api);

app.listen(3000, ()=>{
    console.log('Server started at port:' + 3000);
});