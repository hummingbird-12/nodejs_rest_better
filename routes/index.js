"use strict";

const express = require('express');
const router = express.Router();

const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    res.redirect('/login');
  }
  else {
    let userList = null;
    User.getUsersList(function(err, list) {
      if(err) {
        res.send("Error fetching user list");
        res.end();
      }
      else {
        console.log(list);
        userList = list;
        res.render('index', { user: req.user, userList: userList });
      }
    });
  }
});

module.exports = router;
