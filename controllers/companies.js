const genericController = require('./generic');

module.exports = {
    getCompanies(callback) {
        let query = `SELECT * FROM public.companies`;
        let params = [];
        genericController.queryPostgres(query, params, callback);
    },
    getCompany(VAT, callback) {
        let query = `SELECT * FROM public.companies WHERE "VAT"=$1`;
        let params = [VAT];
        genericController.queryPostgres(query, params, callback);
    },
    insertCompany(company, callback) {
        let query = `INSERT INTO public.companies("VAT", name, headquarters) VALUES ($1, $2, $3);`;
        let params = [company.VAT, company.name, company.headquarters];
        genericController.queryPostgres(query, params, callback);
    },
    updateCompany(company, callback) {
        let query = `UPDATE public.companies SET name=$1, headquarters=$2 WHERE "VAT"=$3;`;
        let params = [company.name, company.headquarters, company.VAT];
        genericController.queryPostgres(query, params, callback);
    },
    deleteCompany(VAT, callback) {
        let query = `DELETE FROM public.companies WHERE "VAT"=$1`;
        let params = [VAT];
        genericController.queryPostgres(query, params, callback);
    },
    getCompaniesByRole(role, company, callback){
        if (role == "owner") {
            this.getCompanies(callback);
        }       
        else if(role == "administartor"){
            this.getCompany(company, callback);
        }
        else return [];
    }
}

