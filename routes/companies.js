const router = require('express').Router();
const companiesController = require('../controllers/companies');
const verifyToken = require("../auth/verifyToken");

router.get('/roles', verifyToken, function (req, res) {
    let role = req.token.role;
    let company = req.token.company;
    companiesController.getCompaniesByRole(role, company, function (err, rows){
        if(err) res.send(err);
        res.send(rows);
    });
});

module.exports = router;