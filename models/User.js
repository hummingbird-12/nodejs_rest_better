"use strict";

const pool = require('../psql').fetchPool();

const User = function(user) {
  this.id = user.id;
  this.username = user.name;
  this.email = user.email;
  this.password = user.pass;
};

User.findById = function(id, result) {
  pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id],
    (error, results) => {
      if (error) {
        return result(error, null);
      }
      result(null, results.rows[0]);
    }
  );
};

User.findByUsername = function(user, result) {
  pool.query(
    'SELECT * FROM users WHERE username=$1',
    [user.username],
    (err, res) => {
      if(err) {
        console.log("Error while making query.");
        return result(err, null);
      }
      result(null, res.rows[0]);
    });
};

User.findByEmail = function(user, result) {
  pool.query(
    'SELECT * FROM users WHERE email=$1',
    [user.email],
    (err, res) => {
      if(err) {
        console.log("Error while making query.");
        return result(err, null);
      }
      result(null, res.rows[0]);
    });
};

User.getUsersList = function(result) {
  pool.query(
    'SELECT * FROM users',
    (err, res) => {
      if(err) {
        console.log("Error while making query.");
        return result(err, null);
      }
      result(null, res.rows);
    }
  );
};

User.createUser = function(user, result) {
  pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
    [user.username, user.email, user.password],
    (err, res) => {
      if(err) {
        console.log("Error while making query.");
        return result(err, null);
      }
      result(null, res.rows[0].id);
    }
  );
};

module.exports = User;
