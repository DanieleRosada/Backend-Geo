const queryController = require('./query');
const statusController = require('./status');
const roles = require('./roles');
const cfg = require('../config/bcrypt-password');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

module.exports = {
    getUsers(callback) {
        let query = `SELECT * FROM public.users u JOIN public.companies c ON (u.company = c."VAT")`;
        let params = [];
        queryController.postgres(query, params, callback);
    },
    getUserByEmail(email, callback) {
        let query = `SELECT * FROM public.users WHERE email = $1`;
        let params = [email];
        queryController.postgres(query, params, callback);
    },
    getUsersByCompany(company, callback) {
        let query = `SELECT * FROM public.users u  JOIN public.companies c ON (u.company = c."VAT") WHERE company = $1`;
        let params = [company];
        queryController.postgres(query, params, callback);
    },
    insertuser(user, callback) {
        let query = `INSERT INTO public.users (email, username, password, company, role) VALUES ($1, $2, $3, $4, $5);`;
        let params = [user.email, user.username, user.bcryptPassword, user.company, user.role];
        queryController.postgres(query, params, callback);
    },
    updateUser(user, callback) {
        let query = `UPDATE public.users SET email=$1, username=$2, password=$3, company=$4, role=$5 WHERE email= $6`;
        let params = [user.email, user.username, user.bcryptPassword, user.company, user.role, user.previousEmail];
        queryController.postgres(query, params, callback);
    },
    updateUserNoPassword(user, callback) {
        let query = `UPDATE public.users SET email=$1, username=$2, company=$3, role=$4 WHERE email= $5`;
        let params = [user.email, user.username, user.company, user.role, user.previousEmail];
        queryController.postgres(query, params, callback);
    },
    deleteUser(email, callback) {
        let query = `DELETE FROM public.users WHERE email=$1`;
        let params = [email];
        queryController.postgres(query, params, callback);
    },
    login(email, password, callback) {
        this.getUserByEmail(email, (err, rows) => {
            if (err) callback(statusController.internalServerError());
            if (!rows[0] || !bcrypt.compareSync(password, rows[0].password)) callback(statusController.unauthorized());

            let token = jwt.sign({ email: rows[0].email, company: rows[0].company, role: rows[0].role }, cfg.secret, { expiresIn: 4 * 60 * 60 }); //duration 4 hours

            callback({
                status: 200,
                role: rows[0].role,
                token: token
            });
        });
    },

    select(token, callback) {
        if (token.role == roles.owner) this.getUsers(callback);
        else if (token.role == roles.admin) this.getUsersByCompany(token.company, callback);
        else callback(statusController.forbidden(), []);
    },
    create(user, token, callback) {
        if (roles.canDoOperation(token, user.company) < 1) callback(statusController.forbidden());

        const func = () => {
            return new Promise((resolve, reject) => {
                this.getUserByEmail(user.email, (err, rows) => {
                    if (err) reject(statusController.internalServerError());
                    if (rows.length > 0) reject(statusController.conflictEmail());
                    if (user.password.length < 3) reject(statusController.notacceptable());

                    user.bcryptPassword = bcrypt.hashSync(user.password, null, null);
                    this.insertuser(user, (err, rows) => {
                        if (err) reject(statusController.internalServerError());
                        resolve();
                    });
                })
            });
        }
        queryController.transaction(func, callback);
    },

    update(user, token, callback) {
        if (roles.canDoOperation(token, user.company) < 1) callback(statusController.forbidden());

        const func = () => {
            return new Promise((resolve, reject) => {
                this.getUserByEmail(user.email, (err, rows) => {
                    if (err) reject(statusController.internalServerError());
                    if (rows.length > 0 && user.email != user.previousEmail) reject(statusController.conflictEmail());

                    if (!user.password || user.password == "") {
                        this.updateUserNoPassword(user, (err, rows) => {
                            if (err) reject(statusController.internalServerError());
                            resolve();
                        });
                    }
                    else {
                        if (user.password.length < 3) reject(statusController.notacceptable());

                        user.bcryptPassword = bcrypt.hashSync(user.password, null, null);
                        this.updateUser(user, (err, rows) => {
                            if (err) reject(statusController.internalServerError());
                            resolve();
                        });
                    }
                });
            });
        }

        queryController.transaction(func, callback);
    },
    delete(user, token, callback) {
        if (roles.canDoOperation(token, user.company) < 1) callback(statusController.forbidden());

        this.deleteUser(user.email, (err, rows) => {
            if (err) callback(statusController.internalServerError())
            callback(statusController.ok())
        });
    }
}
