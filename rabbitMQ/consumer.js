const dataController = require('../controllers/data');
const rabbit = require('../structure/rabbit');

rabbit.reciveToQueue('busesQueue', function (bus) {
    dataController.insertData(bus, (err, rows) => {
        if (err) throw err;
        rabbit.sendToQueue('dataQueue', rows[0]);
    });

});