const socket = require('../config/socket');
const cfg = require('../config/bcrypt-password');
var io = require('socket.io').listen(socket.port);
const rabbit = require('../structure/rabbit');
const jwt = require('jsonwebtoken');

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, cfg.secret, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      next();
    });
  }
  else next(new Error('Authentication error'));
})
.on('connection', (socket) => {
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