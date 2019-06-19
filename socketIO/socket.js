const cfg = require('../config/socket');
var io = require('socket.io').listen(cfg.port);
const rabbit = require('../structure/rabbit');

io.on('connection', (socket) => {
  rabbit.reciveToQueue('dataQueue', function (data) {
    let position = JSON.parse(data.content.toString());
    socket.to(position.buscode).emit("data", position);
  }, { noAck: true });

  socket.on('join', function (data) {
    socket.join(data.code);
  });

  socket.on('leave', function (data) {
    socket.leave(data.code);
  });
});


io.on('disconnect', () => {
  io.connect();
});
