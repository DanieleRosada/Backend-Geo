const router = require('express').Router();
const companiesController = require('../controllers/companies');
const verifyToken = require("../auth/verifyToken");

router.get('/', verifyToken, function (req, res) {
    companiesController.select(req.token, function (err, rows){
        if(err) res.send(err);
        res.send(rows);
    });
});

router.post('/', verifyToken, function (req, res) {
    let company = req.body.company;
    companiesController.create(company, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.put('/', verifyToken, function (req, res) {
    let company = req.body.company;
    companiesController.update(company, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.delete('/', verifyToken, function (req, res) {
    let company = req.body.company;
    companiesController.delete(company, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

module.exports = router;