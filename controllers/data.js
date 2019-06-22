const queryController = require('./query');
const moment = require('moment');
module.exports = {
    insertData(bus, callback) {
        let query = `INSERT INTO public.data("time", id, buscode, latlng, doorisopen, passengers) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        let params = [bus.timestamp, bus.id, bus.buscode, bus.latlng, bus.doorisopen, bus.passengers];
        queryController.timescale(query, params, callback);
    },
    getData(busCode, date, callback) {
        let query = `SELECT * FROM public.data WHERE buscode = $1 AND "time" BETWEEN $2 AND $3 ORDER BY "time"`;
        let params = [busCode, moment(date).startOf('day'), moment(date).endOf('day')];
        queryController.timescale(query, params, callback);
    },
    getLastData(busCode, callback) {
        let query = `SELECT latlng, passengers FROM public.data WHERE buscode = $1 AND "time" > $2 ORDER BY "time" DESC LIMIT 1`;
        let params = [busCode, new Date(new Date().setHours(0, 0, 0, 0))];
        queryController.timescale(query, params, callback);
    }
}