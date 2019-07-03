const queryController = require('./query');
const rolesController = require('./roles');
const statusController = require('./status');

module.exports = {
    getCompanies(callback) {
        let query = `SELECT * FROM public.companies`;
        let params = [];
        queryController.postgres(query, params, callback);
    },
    getCompanyByVAT(VAT, callback) {
        let query = `SELECT * FROM public.companies WHERE "VAT"=$1`;
        let params = [VAT];
        queryController.postgres(query, params, callback);
    },
    insertCompany(company, callback) {
        let query = `INSERT INTO public.companies("VAT", name, headquarters) VALUES ($1, $2, $3);`;
        let params = [company.VAT, company.name, company.headquarters];
        queryController.postgres(query, params, callback);
    },
    updateCompany(company, callback) {
        let query = `UPDATE public.companies SET "VAT"=$1, name=$2, headquarters=$3 WHERE "VAT"=$4;`;
        let params = [company.VAT, company.name, company.headquarters, company.previousVAT];
        queryController.postgres(query, params, callback);
    },
    deleteCompany(VAT, callback) {
        let query = `DELETE FROM public.companies WHERE "VAT"=$1`;
        let params = [VAT];
        queryController.postgres(query, params, callback);
    },
    select(token, callback){
        if (token.role == rolesController.owner) this.getCompanies(callback);      
        else if(token.role == rolesController.admin) this.getCompanyByVAT(token.company, callback);
        else callback(statusController.forbidden(), []);
    },
    create(company, token, callback){
        if (rolesController.canDoOperation(token, company.VAT) != 2) callback(statusController.forbidden());

        const func = () => {
            return new Promise((resolve, reject) => {
                this.getCompanyByVAT(company.VAT, (err, rows) => {
                    if (err) reject(statusController.internalServerError());
                    if (rows.length > 0) reject(statusController.conflictCompanies());

                    this.insertCompany(company, (err, rows) => {
                        if (err) reject(statusController.internalServerError());
                        resolve();
                    });
                })
            });
        }

        queryController.transaction(func, callback);
    },
    update(company, token, callback){
        if (rolesController.canDoOperation(token, company.VAT) < 1) callback(statusController.forbidden());

        const func = () => {
            return new Promise((resolve, reject) => {
                this.getCompanyByVAT(company.VAT, (err, rows) => {
                    if (err) reject(statusController.internalServerError());
                    if (rows.length > 0 && company.VAT != company.previousVAT) reject(statusController.conflictCompanies());

                    this.updateCompany(company, (err, rows) => {
                        if (err) reject(statusController.internalServerError());
                        resolve();
                    });
                })
            });
        }

        queryController.transaction(func, callback);
    },
    delete(company, token, callback){
        if (rolesController.canDoOperation(token, company.VAT) != 2) callback(statusController.forbidden());

        this.deleteCompany(company.VAT, (err, rows)=> {
            if (err) callback(statusController.internalServerError())
            callback(statusController.ok())
        });
    }
}

