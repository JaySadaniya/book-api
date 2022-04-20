const express = require('express');
const passport = require('passport');
const session = require('express-session');
const logger = require('morgan');
const path = require('path');
const port = 2000;
const env = require('./config/environment');
const db = require('./config/mongoose');

const passportGoogle = require('./config/passport-google-oauth-strategy');

const usersController = require('./controllers/users_controller');

const app = express();

require('./config/view-helpers')(app);

app.use(logger(env.morgan.mode, env.morgan.options));

// set view engine in app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// set different properties of session-cookie 
app.use(session({
    name: 'cookie-session',
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: { 
        maxAge: (1000 * 60 * 100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Tell app to use assets upon different request
app.use("/", express.static(env.assets_path));
app.use("/users", express.static(env.assets_path));
app.use("/users/bookdetail", express.static(env.assets_path));

app.get('/', usersController.home);

// Directing user requests to users_routes
app.use('/users', require('./routes/users_routes'));

app.listen(port, function(err){
    if (err) {
        console.log("error in listening on port", err);
        return;
    }
    console.log('server is running!!');
});