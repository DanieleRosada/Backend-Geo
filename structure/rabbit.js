const cfg = require("../config/rabbit");
const open = require('amqplib').connect(cfg.rabbit);

module.exports = {
    sendToQueue: (q, param) => {
        open.then((conn) => {
            return conn.createChannel();
        }).then((ch) => {
            return ch.assertQueue(q).then((ok) => {
                return ch.sendToQueue(q, new Buffer(JSON.stringify(param)));
            });
        }).catch(console.warn);
    },
    reciveToQueue: (q, callback) => {
        open.then((conn) => {
            return conn.createChannel();
        }).then((ch) => {
            return ch.assertQueue(q).then((ok) => {
                return ch.consume(q, (msg) => {
                    if (msg !== null) {
                        callback(JSON.parse(msg.content.toString()));
                        ch.ack(msg);
                    }
                });
            });
        }).catch(console.warn);
    }
}
