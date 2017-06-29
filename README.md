# H1 Repo Overflow
Displays Github repositories related to daily trending topics on Stack Overflow

# H2 Routes
-Routes from the /routes folder are registered in app.js. They include auth.js for authentication routes and api.js for api routes.
-Routing in the front end is done using components, as Repo Overflow uses Angular 2

# H3 Repositories Route:
-Displays repositories related to the most popular Stack Overflow tags
-Routes: front-end: http://localhost:4200/repositories, linked to back-end (routes/api.js): http://localhost:3000/api/repositories
-Step 1. Call to Stack Overflow API to get top tag to query in Github
-Step 2. Display Github repository query results as list of Repo objects on front end

# H3 Archive Route (Protected)
-The archive displays popular Github repositories from previous days from the database.
-You must be logged in to view this route; it is protected by ensureAuthenticated function
-Routes: front-end: http://localhost:4200/archive, linked to back-end (routes/api.js): http://localhost:3000/api/archive
-Step 1. Call Mongo database to get list of all repositories in database
-Step 2. Display all repositories as list of Repo objects on front end

# H3 Other Routes
-There are many helper functions used for the above routes
-Feel free to ignore the test routes in the bottom of the routes/api.js file

# H2 Authentication
-Authentication code lives in routes/auth.js
-Handled using passport and passport-github modules
-Users log in via their Github accounts
-User profile info is collected and stored in database collection repo_overflow.users

# H2 Database
-MongoDB for database, titled repo_overflow
-There are three schemas, Repo, Tag, and User, stored in collections repos, tags, and users respectively
-Repo is a Github repository object, Tag is a Stack Overflow topic, and User is a Github user profile object.
-Database stores repos and tags to load in /archive
