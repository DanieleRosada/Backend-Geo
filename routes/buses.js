const router = require('express').Router();
const busesController = require('../controllers/buses');
const verifyToken = require("../auth/verifyToken");

router.get('/', verifyToken, function (req, res){
    busesController.select(req.token, function(err, rows){
        if(err) res.send(err);
        res.send(rows);
    });
});

router.post('/', verifyToken, function (req, res) {
    let bus = req.body.bus;
    busesController.create(bus, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.put('/', verifyToken, function (req, res) {
    let bus = req.body.bus;
    busesController.update(bus, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

router.delete('/', verifyToken, function (req, res) {
    let bus = req.body.bus;
    busesController.delete(bus, req.token, (rs) => {
        res.status(rs.status).json(rs);
    });
});

module.exports = router;