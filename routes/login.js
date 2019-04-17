"use strict";

const express = require('express');
const router = new express.Router();
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;

// URL for GitHub application
let login_github = 'https://github.com/login/oauth/authorize?client_id=';
login_github += process.env.GITHUB_CLIENT_ID;

// [GET] log-in page
// [POST] authenticate
router.route('/')
  .get( function(req, res, next) {
    res.render('login', { link: login_github });
  })
  .post(
    passport.authenticate(
      'local',
      { failureRedirect: '/failure' }
      ),
    function(req, res) {
      res.redirect("/");
  });

module.exports = router;
