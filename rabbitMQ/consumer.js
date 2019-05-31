const dataController = require('../controllers/data');
const rabbit = require('../structure/rabbit');

rabbit.reciveToQueue('busesQueue', function (value) {
    let bus = JSON.parse(value.content.toString());
    dataController.insertData(bus, (err, rows) => {
        if (err) throw err;
        rabbit.sendToQueue('dataQueue', rows);
    });

}, { noAck: true });