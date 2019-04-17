"use strict";

module.exports = function(app) {
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
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
      console.log(newUser);
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
};
