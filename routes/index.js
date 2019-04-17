"use strict";

const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', function(req, res, next) {
  // [GET] login page
  if(!req.user) {
    res.redirect('/login');
  }
  // [GET] user list page
  else {
    let userList = null;
    User.getUsersList(function(err, list) {
      if(err) {
        res.send("Error fetching user list");
        res.end();
      }
      else {
        userList = list;
        res.render('index', { user: req.user, userList: userList });
      }
    });
  }
});

module.exports = router;
