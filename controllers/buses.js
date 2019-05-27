const postgres = require('../structure/postgres');

module.exports = {
    getBuses(callback) {
        let query = `SELECT * FROM public.buses b JOIN public.company c ON (b.company = c."VAT") ORDER BY b."busLine"`;
        postgres.query(query)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    }
}

