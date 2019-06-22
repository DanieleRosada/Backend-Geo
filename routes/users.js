const router = require('express').Router();
const usersController = require('../controllers/users');
const rolesController = require('../controllers/roles');
const verifyToken = require("../auth/verifyToken");

router.post('/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    usersController.login(email, password, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.get('/me', verifyToken, function (req, res) {
    let email = req.token.email;
    usersController.getUserByEmail(email, (err, rows) => {
        if (err) res.send(err)
        res.send(rows);
    });
});

router.get('/roles', verifyToken, function (req, res) {
    let role = req.token.role;
    let rs = rolesController.roles(role);
    res.send(rs);
});

router.get('/', verifyToken, function (req, res) {
    usersController.select(req.token, (err, rows) => {
        if (err) res.send(err)
        res.send(rows);
    });
});

router.post('/', verifyToken, function (req, res) {
    let user = req.body.user;
    usersController.create(user, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.put('/', verifyToken, function (req, res) {
    let user = req.body.user;
    usersController.update(user, req.token, (err, rows) => {
        if (err) res.send(err)
        res.send(rows);
    });
});

router.delete('/', verifyToken, function (req, res) {
    let user = req.body.user;
    usersController.delete(user, req.token, (err, rows) => {
        if (err) res.send(err)
        res.send(rows);
    });
});

module.exports = router;