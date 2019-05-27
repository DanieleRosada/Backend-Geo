const dataController = require('../controllers/data');
const rabbit = require('../structure/rabbit');

rabbit.reciveToQueue('busesQueue', function (data) {
    let buses = JSON.parse(data.content.toString());
    buses.forEach(bus => {
        dataController.insertData(bus, function(err, rows) {
            if(err) throw err;
            console.log(result);
        });
    });
    
}, { noAck: true });