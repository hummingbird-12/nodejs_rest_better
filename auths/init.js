"use strict";

module.exports = function(app) {

  // initialize passportJS module
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const GitHubStrategy = require('passport-github').Strategy;
  const crypto = require('crypto');
  const User = require('../models/User');

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, next) {
    next(null, user.id);
  });

  passport.deserializeUser(function (id, next) {
    User.findById(id, function (err, user) {
      if(err) {
        return next(err);
      }
      next(null, user);
    });
  });

  // set-up for local-strategy
  passport.use('local', new LocalStrategy(
    {
      username: 'username',
      password: 'password'
    },
    (username, password, done) => {
      const newUser = new User({
        name: username,
        pass: password
      });

      // find existing user
      User.findByUsername(newUser, function(err, user) {
        if(err) {
          return done(err);
        }
        if(!user || newUser.password !== user.password) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  ));

  // set-up for github-strategy
  passport.use('github', new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/login/redirect'
    },
    (accessToken, refreshToken, profile, done) => {
      const newUser = new User({
        email: profile._json.email,
      });

      // try finding existing user
      User.findByEmail(newUser, function(err, user) {
        if(err) {
          return done(err);
        }
        if(!user) {
          // create new user in database
          newUser.username = profile._json.email.split("@")[0];
          newUser.password =
            crypto.createHmac('sha256', process.env.CRYPTO_SECRET)
              .update(accessToken)
              .digest('hex');
          User.createUser(newUser, function(err, newUserID) {
            if(err) {
              return done(err);
            }
            if(!newUserID) {
              return done(null, false);
            }
            else {
              newUser.id = newUserID;
              return done(null, newUser);
            }
          });
        }
        else {
          return done(null, user);
        }
      });
    }));
};
