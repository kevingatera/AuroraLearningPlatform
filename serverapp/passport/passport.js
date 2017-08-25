var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Call user model
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret = 'testingSecretFormula' ;

module.exports = function(app, passport){


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false /* set it t false as we don't need it*/ }
    }));

    passport.serializeUser(function(user, done) {
        // Create a token for the user
        token = jwt.sign({
            username: user.username,
            email: user.email
        }, secret, { expiresIn: '1h' } );
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // ================================= FACEBOOK ========================================
    passport.use(new FacebookStrategy({
    clientID: '121670535131854',
    clientSecret: 'd61dc463df86253e47efed41af88d133',
    callbackURL: "https://kevingatera.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
    },

    function(accessToken, refreshToken, profile, done) {
        console.log(profile._json.email);
        /* The following is our query ie find the one user in the database
            if found then execute the (err, user) => ... */
            User.findOne({
                email: profile._json.email
            }).select('username password email').exec(function(err, user){
                if(err){
                    // If there is an error
                    done(err);
                }
                if (user && user != null) {
                    // The user exists and is not null
                    done(null, user)
                }
                else {
                    // If the user doens't exist then
                    done(err);
                }
            })
        }
    ));


      app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/fberror' }), function(req, res){
          res.redirect('/facebook/' + token);
      });

        app.get('/auth/facebook', passport.authenticate('facebook', {
            // If your application needs extended permissions, they can be requested by setting the scope option.
             scope: 'email'
         }));

    // ======================================= TWITTER =============================================================================

    passport.use(new TwitterStrategy({
        consumerKey: 'RWliHLWSdFP801wkmN69u6E5i',
        consumerSecret: '1TflQoqx47PqIb3BeueobYgJWj0jajltARZTC51vqeTkkldyKd',
        callbackURL: "https://kevingatera.com/auth/twitter/callback",
        userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"﻿
      },
      function(token, tokenSecret, profile, done) {
          // console.log(profile._json.email);
          /* The following is our query ie find the one user in the database
              if found then execute the (err, user) => ... */
              User.findOne({
                  email: profile._json.email
              }).select('username password email').exec(function(err, user){
                  if(err){
                      // If there is an error
                      done(err);
                  }
                  if (user && user != null) {
                      // The user exists and is not null
                      done(null, user)
                  }
                  else {
                      // If the user doens't exist then
                      done(err);
                  }
              })
          }
    ));
    // Redirect to and from the Twitter authentication page
    app.get('/auth/twitter', passport.authenticate('twitter'));

    // Guide the user to a success or failure land page
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }), function(req, res){
        res.redirect('/twitter/' + token);
    });


    // ================================= GOOGLE ====================================================
    passport.use(new GoogleStrategy({
        clientID: '464700628127-um2r681t50cr8mi5nji4m97euvlu3d52.apps.googleusercontent.com',
        clientSecret: 'sNz6cwWJHtJ208CyQrxA5XzT',
        callbackURL: "https://kevingatera.com/auth/google/callback"
    }, function(token, tokenSecret, profile, done) {
            // console.log(profile._json.emails[0].value);
            // console.log(profile);
            User.findOne({
                email: profile._json.emails[0].value
            }).select('username password email').exec(function(err, user){
                if(err){
                    // If there is an error
                    done(err);
                }
                if (user && user != null) {
                    // The user exists and is not null
                    done(null, user)
                }
                else {
                    // If the user doens't exist then
                    done(err);
                }
            })
        }));

        app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email', 'profile'] }));

        app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
            console.log('The google token is ' + token);
            res.redirect('/google/' + token);
        });

        return passport;
}
