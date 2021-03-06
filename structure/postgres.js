const { Pool } = require('pg');
const cfg = require("../config/postgres");

const pool = new Pool(cfg.postgres);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
}