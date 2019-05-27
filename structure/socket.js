const cfg = require('../config/socket');
var io = require('socket.io').listen(cfg.port);

io.on('connection', socket => {
	console.log("connected")

	socket.on('disconnect', () => { console.log("disconnect"); clearInterval(interval) });
});