const producerRMQ = require('./rabbitMQ/producer');
const consumerRMQ = require('./rabbitMQ/consumer');
const socketIO = require('./socketIO/socket');

const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.json());

app.use('/buses', require('./routes/buses'));
app.use('/data', require('./routes/data'));
app.use('/users', require('./routes/users'));
app.use('/companies', require('./routes/companies'));

app.listen(3000);