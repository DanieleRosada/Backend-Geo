const genericController = require('./generic');
const uuidv4 = require('uuid/v4');

module.exports = {
    getBuses(callback) {
        let query = `SELECT * FROM public.buses b JOIN public.companies c ON (b.company = c."VAT") ORDER BY b."busLine"`;
        let params = [];
        genericController.queryPostgres(query, params, callback);
    },
    getBusesByCompany(company, callback) {
        let query = `SELECT * FROM public.buses b JOIN public.companies c ON (b.company = c."VAT") WHERE b.company = $1`;
        let params = [company];
        genericController.queryPostgres(query, params, callback);
    },
    insertBus(bus, callback) {
        let query = `INSERT INTO public.buses ("busCode", "countsPassengers", companies, "busLine", color) VALUES ($1, $2, $3, $4, $5);`;
        let params = [uuidv4(), bus.countsPassengers, bus.company, bus.busLine, bus.color];
        genericController.queryPostgres(query, params, callback);
    },
    updateBus(bus, callback) {
        let query = `UPDATE public.buses SET "countsPassengers"=$1, company=$2, "busLine"=$3, color=$4 WHERE "busCode"= $5`;
        let params = [bus.countsPassengers, bus.company, bus.busLine, bus.color, bus.busCode];
        genericController.queryPostgres(query, params, callback);
    },
    deleteBus(busCode, callback) {
        let query = `DELETE FROM public.buses WHERE "busCode"=$1`;
        let params = [busCode];
        genericController.queryPostgres(query, params, callback);
    }
}

