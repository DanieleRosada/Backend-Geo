const cfg = require('../config/socket');
var io = require('socket.io').listen(cfg.port);
const rabbit = require('../structure/rabbit');

io.sockets.on('connection', function (socket) {
  console.log("connected");
});


io.sockets.on('connect', () => {
  console.log("connesso")
  rabbit.reciveToQueue('dataQueue', function (value) {
    let data = value.content.toString();
    io.sockets.to(data.buscode).emit("data", data);
  }, { noAck: true });
});


io.sockets.on('join', function (code) {
  console.log("join", data)
  io.sockets.join(code);
});

io.sockets.on('leave', function (code) {
  console.log("leave", code)
  io.sockets.leave(code);
});

io.sockets.on('disconnect', () => {
  console.log("disconnect")
  io.sockets.connect();
});
