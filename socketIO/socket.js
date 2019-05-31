const cfg = require('../config/socket');
var io = require('socket.io').listen(cfg.port);
const rabbit = require('../structure/rabbit');

io.on('connection', function (socket) {
  console.log("Socket connected.");
});

io.on('connect', () => {
  rabbit.reciveToQueue('dataQueue', (value) => {
    let data = JSON.parse(value.content.toString());
    io.to(data.buscode).emit('data', data);
  }, { noAck: true }); 
});

io.on('disconnect', function () {
  console.log("Socket disconnected.");
  io.reconnect();
});