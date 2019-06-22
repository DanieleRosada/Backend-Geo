const queryController = require('./query');
const rolesController = require('./roles');
const statusController = require('./status');
const uuidv4 = require('uuid/v4');

module.exports = {
    getBuses(callback) {
        let query = `SELECT * FROM public.buses b JOIN public.companies c ON (b.company = c."VAT") ORDER BY b.line`;
        let params = [];
        queryController.postgres(query, params, callback);
    },
    getBusesByCompany(company, callback) {
        let query = `SELECT * FROM public.buses b JOIN public.companies c ON (b.company = c."VAT") WHERE b.company = $1`;
        let params = [company];
        queryController.postgres(query, params, callback);
    },
    insertBus(bus, callback) {
        let query = `INSERT INTO public.buses ("busCode", "countsPassengers", companies, line, color) VALUES ($1, $2, $3, $4, $5);`;
        let params = [uuidv4(), bus.countsPassengers, bus.company, bus.busLine, bus.color];
        queryController.postgres(query, params, callback);
    },
    updateBus(bus, callback) {
        let query = `UPDATE public.buses SET "countsPassengers"=$1, company=$2, line=$3, color=$4 WHERE "busCode"= $5`;
        let params = [bus.countsPassengers, bus.company, bus.busLine, bus.color, bus.busCode];
        queryController.postgres(query, params, callback);
    },
    deleteBus(busCode, callback) {
        let query = `DELETE FROM public.buses WHERE "busCode"=$1`;
        let params = [busCode];
        queryController.postgres(query, params, callback);
    },
    select(token, callback) {
        if (rolesController.isOwner(token.role)) this.getBuses(callback);
        else this.getBusesByCompany(token.company, callback);
    },
    create(bus, token, callback) {
        if (!rolesController.canDoOperation(token, bus.company)) callback(statusController.forbidden());

        const func = () => {
            return new Promise((resolve, reject) => {
                this.getBusesByCompany(bus.company, (err, rows) => {
                    if (err) reject(statusController.internalServerError());

                    this.insertBus(bus, (err, rows) => {
                        if (err) reject(statusController.internalServerError());
                        resolve();
                    });
                })
            });
        }

        queryController.transaction(func, callback);
    },
    update(bus, token, callback) {
        if (!rolesController.canDoOperation(token, bus.company)) callback(statusController.forbidden());

        const func = () => {
            return new Promise((resolve, reject) => {
                this.getBusesByCompany(company.VAT, (err, rows) => {
                    if (err) reject(statusController.internalServerError());

                    this.updateBus(company, (err, rows) => {
                        if (err) reject(statusController.internalServerError());
                        resolve();
                    });
                })
            });
        }

        queryController.transaction(func, callback);
    },
    delete(bus, token, callback) {
        if (!rolesController.canDoOperation(token, bus.company)) callback(statusController.forbidden());

        this.deleteBus(bus.busCode, (err, rows) => {
            if (err) callback(statusController.internalServerError())
            callback(statusController.ok())
        });
    }
}

