"use strict";

const { Pool } = require('pg');

let pool = null;

function init() {
  try {
    pool = new Pool();
  } catch(err) {
    console.log("Error fetching DB client pool.");
    throw err;
  }
}

function fetchPool() {
  if(!pool) {
    init();
  }
  return pool;
}

module.exports = {
  fetchPool
};
