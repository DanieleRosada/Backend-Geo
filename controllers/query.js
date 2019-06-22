const postgres = require('../structure/postgres');
const timescale = require('../structure/timescale');
const statusController = require('./status');

module.exports = {
    postgres(query, params, callback) {
        postgres.query(query, params)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    },
    timescale(query, params, callback) {
        timescale.query(query, params)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    },
    transaction(action, callback) {
        postgres.query('BEGIN', (err) => {
            if (err) callback(statusController.internalServerError());
            action()
                .then(() => {
                    postgres.query('COMMIT', (err) => {
                        if (err) callback(statusController.internalServerError());
                        callback(statusController.ok());
                    });
                })
                .catch(err => callback(err));
        });
    }
}