const timescale = require('../structure/timescale')

module.exports = {
    insertData(bus) {
            let query = `INSERT INTO public.data("time", id, buscode, latlng, doorisopen, passengers) VALUES ($1, $2, $3, $4, $5, $6);`;
            let params = [bus.timestamp, bus.id, bus.buscode, bus.latlng, bus.doorisopen, bus.passengers];

            timescale.query(query, params)
                .then()
                .catch(err => {throw err});
    },

    getData(busCode, callback) {
        let query = `SELECT * FROM public.data WHERE buscode = $1 AND "time" > $2 ORDER BY "time"`;
        let params = [busCode, new Date(new Date().setHours(0, 0, 0, 0))];

        timescale.query(query, params)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    },

    getLastData(busCode, callback) {
        let query = `SELECT latlng, passengers FROM public.data WHERE buscode = $1 AND "time" > $2 ORDER BY "time" DESC LIMIT 1`;
        let params = [busCode, new Date(new Date().setHours(0, 0, 0, 0))];

        timescale.query(query, params)
            .then(result => callback(null, result.rows))
            .catch(err => callback(err, null));
    }
}