// const producerRMQ = require('./rabbitMQ/producer');
// const consumerRMQ = require('./rabbitMQ/consumer');

const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');

const busesController = require('./controllers/buses');
const dataController = require('./controllers/data');

app.use(cors())
app.use(bodyParser.json());

app.get('/busesMenu', function (req, res){
    busesController.getBuses( function(err, rows){
        if(err) res.send(err);
        res.send(rows)
    });
});

app.post('/busData', function (req, res) {
    let busCode = req.body.buscode;
    dataController.getData(busCode, function(err, rows){
        if(err) res.send(err);
        res.send(rows);
    });
});

app.listen(3000);