const genericController = require('./generic');
const statusController = require('./status');
const cfg = require('../config/bcrypt-password');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports = {
    getUsers(callback) {
        let query = `SELECT * FROM public.users`;
        let params = [];
        genericController.queryPostgres(query, params, callback);
    },
    getUser(email, callback) {
        let query = `SELECT * FROM public.users WHERE email = $1`;
        let params = [email];
        genericController.queryPostgres(query, params, callback);
    },
    insertuser(user, callback) {
        let query = `INSERT INTO public.users (email, username, password, company, role) VALUES ($1, $2, $3, $4, $5);`;
        let params = [user.email, user.username, user.bcryptPassword, user.company, user.role];
        genericController.queryPostgres(query, params, callback);
    },
    updateUser(user, callback) {
        let query = `UPDATE public.users SET username=$1, password=$2, role=$3 WHERE email= $4`;
        let params = [user.username, user.password, user.role, user.email];
        genericController.queryPostgres(query, params, callback);
    },
    deleteUser(email, callback) {
        let query = `DELETE FROM UPDATE public.users WHERE email=$1`;
        let params = [email];
        genericController.queryPostgres(query, params, callback);
    },
    login(email, password, callback) {
        this.getUser(email, (err, rows) => {
            if (err) return callback(statusController.internalServerError());
            if (!rows[0] || !bcrypt.compareSync(password, rows[0].password)) return callback(statusController.unauthorized());

            let token = jwt.sign({ email: rows[0].email, company: rows[0].company, role: rows[0].role }, cfg.secret, { expiresIn: 4 * 60 * 60 }); //duration 4 hours

            return callback({
                status: 200,
                token: token
            });
        });
    },
    sigup(user, callback) {
        const func = () => {
            return new Promise((resolve, reject) => {
                this.getUser(user.email, (err, rows) => {
                    if (err) return reject(statusController.internalServerError());
                    if (rows.length > 0) return reject(statusController.conflict());
                    if (user.password.length < 3) return reject(statusController.notacceptable());

                    user.bcryptPassword = bcrypt.hashSync(user.password, null, null);
                    this.insertuser(user, (err, rows) => {
                        if (err) return reject(statusController.internalServerError());
                        resolve();
                    });
                })
            });
        }

        genericController.moreQuery(func, callback);
    },
    roles(role) {
       if (role == "owner") return [{"value": "owner"}, {"value": "administartor"}, {"value": "employee"}];
       else if(role == "administartor") return [{"value": "employee"}];
       else return [];
    }
}
