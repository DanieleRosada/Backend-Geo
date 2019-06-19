const Bus = require("../classes/bus");
const busesController = require("../controllers/buses");
const dataController = require("../controllers/data");
const rabbit = require('../structure/rabbit');


var lastRs = [];
var buses = [];
inizializate();

function inizializate() {
    busesController.getBuses((err, rs) => {
        if (err) throw err;
        if (buses.length == 0 || lastRs != rs) {
            buses = [];

            rs.forEach(bus => {
                dataController.getLastData(bus.busCode, (err, lastPosition) => {
                    if (err) throw err;
                    buses.push(new Bus(
                        bus.busCode,
                        bus.countsPassengers,
                        lastPosition.length > 0 ? lastPosition[0].passengers : 0,
                        lastPosition.length > 0 ? lastPosition[0].latlng : bus.headquarters
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
function state(bus) {
    let payload = bus.generatePayload();
    if (payload){
        payload.forEach(e => {
            rabbit.sendToQueue('busesQueue', JSON.stringify(e));
        });
    }
}

setInterval(inizializate, 60000);

setInterval(sendState, 10000);

setInterval(sendStateWhenDoorIsOpen, 1000);