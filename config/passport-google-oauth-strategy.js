const env = require('./environment');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;

const Users = require('../models/users');

passport.use(new googleStrategy({
        clientID: env.google_clientID,
        clientSecret: env.google_clientSecret,
        callbackURL: env.google_callbackURL,
        scope: ['profile', 'email']
    },

    function (accessToken, refreshToken, profile, done){
        
        Users.findOne({email: profile.emails[0].value}, function(err, user){
            if (err){
                console.log('err in google strategy-passport', err);
                return done(err);
            }
            if (user){
                return done(null, user);
            } else {
                Users.create({
                    name: profile.displayName,
                    email: profile.emails[0].value
                }, function(err, user){
                    if (err) { 
                        console.log('err in creating user - google strategy', err); 
                        return done(err); 
                    }
                    return done(null, user);
                });
            }

        } );
        
    }

));

// serializing the user to decide which key is to be kept in cookies
passport.serializeUser(function(user, done){
    done(null, user._id);

});

// deserializing user from the key in the cookies
passport.deserializeUser(function(id, done){
    Users.findById(id, function(err,user){
        if (err){
            console.log('Error finding user in deserialize user');
            return done(err);
        }
        
        return done(null, user);
    });
});

// check if user is authenticated
passport.checkAuthentication = function(req, res, next){
    if (req.isAuthenticated()){
        next();
    } else {
        return res.redirect('/');
    }
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;