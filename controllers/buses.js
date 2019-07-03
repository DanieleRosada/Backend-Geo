const queryController = require('./query');
const rolesController = require('./roles');
const statusController = require('./status');
const uuidv4 = require('uuid/v4');

module.exports = {
    getBuses(callback) {
        let query = `SELECT * FROM public.buses b JOIN public.companies c ON (b.company = c."VAT") ORDER BY b.company, b.line`;
        let params = [];
        queryController.postgres(query, params, callback);
    },
    getBusesByCompany(company, callback) {
        let query = `SELECT * FROM public.buses b JOIN public.companies c ON (b.company = c."VAT") WHERE b.company = $1 ORDER BY b.line`;
        let params = [company];
        queryController.postgres(query, params, callback);
    },
    insertBus(bus, callback) {
        let query = `INSERT INTO public.buses ("busCode", "countsPassengers", company, line, color) VALUES ($1, $2, $3, $4, $5);`;
        let params = [uuidv4(), bus.countsPassengers, bus.company, bus.line, bus.color];
        queryController.postgres(query, params, callback);
    },
    updateBus(bus, callback) {
        let query = `UPDATE public.buses SET "countsPassengers"=$2, company=$3, line=$4, color=$5 WHERE "busCode"= $1`;
        let params = [bus.busCode, bus.countsPassengers, bus.company, bus.line, bus.color];
        queryController.postgres(query, params, callback);
    },
    deleteBus(busCode, callback) {
        let query = `DELETE FROM public.buses WHERE "busCode"=$1`;
        let params = [busCode];
        queryController.postgres(query, params, callback);
    },

    select(token, callback) {
        if (token.role == rolesController.owner)  this.getBuses(callback);
        else this.getBusesByCompany(token.company, callback);
    },
    create(bus, token, callback) {
        if (rolesController.canDoOperation(token, bus.company) < 1) callback(statusController.forbidden());
    
        this.insertBus(bus, (err, rows) => {
            if (err) callback(statusController.internalServerError());
            callback(statusController.ok());
        });
    },
    update(bus, token, callback) {
        if (rolesController.canDoOperation(token, bus.company) < 1) callback(statusController.forbidden());

        this.updateBus(bus, (err, rows) => {
            if (err) callback(statusController.internalServerError());
            callback(statusController.ok());
        });

    },
    delete(bus, token, callback) {
        if (rolesController.canDoOperation(token, bus.company) < 1) callback(statusController.forbidden());

        this.deleteBus(bus.busCode, (err, rows) => {
            if (err) callback(statusController.internalServerError())
            callback(statusController.ok())
        });
    }
}

