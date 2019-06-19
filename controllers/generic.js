const postgres = require('../structure/postgres');
const timescale = require('../structure/timescale');
const statusController = require('./status');

module.exports = {
    queryPostgres(query, params, callback) {
        postgres.query(query, params)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    },
    queryTimescale(query, params, callback) {
        timescale.query(query, params)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    },
    moreQuery(action, callback) {
        postgres.query('BEGIN', async (err) => {
            if (err) return callback(statusController.internalServerError());
            await action()
                .then(() => {
                    postgres.query('COMMIT', (err) => {
                        if (err) return callback(statusController.internalServerError());
                        return callback(statusController.ok());
                    });
                })
                .catch(err => callback(err));
        });
    }
}