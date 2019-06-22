const router = require('express').Router();
const dataController = require('../controllers/data');
const verifyToken = require("../auth/verifyToken");

router.post('/bus', verifyToken, function (req, res) {
   
    let busCode = req.body.buscode;
    let date = req.body.date;
    console.log(busCode, date)
    dataController.getData(busCode, date, function(err, rows){
        if(err) res.send(err);
        res.send(rows);
    });
});

module.exports = router;