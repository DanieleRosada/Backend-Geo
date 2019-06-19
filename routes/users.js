const router = require('express').Router();
const usersController = require('../controllers/users');
const verifyToken = require("../auth/verifyToken");

router.post('/login', function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    usersController.login(email, password, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.post('/sigup', verifyToken, function (req, res) {
    let user = req.body.user;
    usersController.sigup(user, (rs) => {
        console.log(rs)
        res.status(rs.status).json(rs);
    });
});

router.get('/roles', verifyToken, function (req, res) {
    let role = req.token.role;
    res.send(usersController.roles(role));
});

module.exports = router;