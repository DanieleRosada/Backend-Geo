const Bus = require("../classes/Bus");
const busesController = require("../controllers/buses");
const dataController = require("../controllers/data");
const rabbit = require('../structure/rabbit');


var lastRs = [];
var buses = [];
inizializate();

function inizializate() {
    busesController.getBuses((err, data) => {
        if (err) throw err;
        let rs = data;
        if (buses.length == 0 || lastRs != rs) {
            buses = [];

            rs.forEach(bus => {
                dataController.getLastData(bus.busCode, (err, data) => {
                    if (err) throw err;
                    let lastPoint = data;
                    buses.push(new Bus(
                        bus.busCode,
                        bus.countsPassengers,
                        lastPoint.length > 0 ? lastPoint[0].passengers : 0,
                        lastPoint.length > 0 ? lastPoint[0].latlng : bus.headquarters
                    ));
                });
            });
            lastRs = rs;
        }
    });
}

function sendState() {
    buses.forEach((bus) => {
        bus.stateDoors(bus);
        state(bus);
    });
}

function sendStateWhenDoorIsOpen() {
    buses.forEach((bus) => {
        if (bus.stateDoors()) state(bus);
    });
}
async function state(bus) {
    let payload = await bus.generatePayload();
    if (payload){
        payload.forEach(e => {
            rabbit.sendToQueue('busesQueue', JSON.stringify(e));
        });
    }
}

setInterval(inizializate, 60000);

setInterval(sendState, 10000);

setInterval(sendStateWhenDoorIsOpen, 1000);