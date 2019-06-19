const router = require('express').Router();
const busesController = require('../controllers/buses');
const verifyToken = require("../auth/verifyToken");

router.get('/menu', verifyToken, function (req, res){
   let company = req.token.company;
    busesController.getBusesByCompany(company, function(err, rows){
        if(err) res.send(err);
        res.send(rows);
    });
});

module.exports = router;