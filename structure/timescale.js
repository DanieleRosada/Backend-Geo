const { Pool } = require('pg');
const cfg = require("../config/timescale");

const pool = new Pool(cfg.timescale);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
}