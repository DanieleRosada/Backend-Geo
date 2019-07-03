const queryController = require('./query');
const moment = require('moment');
module.exports = {
    insertData(bus, callback) {
        let query = `INSERT INTO public.data("time", buscode, latlng, doorisopen, passengers, stopcode) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        let params = [bus.timestamp, bus.buscode, bus.latlng, bus.doorisopen, bus.passengers, bus.stopcode];
        queryController.timescale(query, params, callback);
    },
    getData(busCode, date, callback) {
        let query = `SELECT * FROM public.data WHERE buscode = $1 AND "time" BETWEEN $2 AND $3 ORDER BY "time"`;
        let params = [busCode, moment(date).startOf('day'), moment(date).endOf('day')];
        queryController.timescale(query, params, callback);
    },
    getLastData(callback) {
        let query = `SELECT * FROM public.data WHERE (buscode,"time") in (select buscode, max("time") from public.data group by buscode)`;
        let params = [];
        queryController.timescale(query, params, callback);
    }
}