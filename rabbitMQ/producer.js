const Bus = require("../classes/bus");
const busesController = require("../controllers/buses");
const dataController = require("../controllers/data");
const rabbit = require('../structure/rabbit');

var LastBuses = [];
var Buses = [];

inizializate();
setInterval(inizializate, 60000);
setInterval(position, 10000);
setInterval(door, 5000);

function inizializate() {
    busesController.getBuses((err, listBuses) => {
        if (err) throw err;

        if (Buses.length == 0 || LastBuses != listBuses) {
            LastBuses = listBuses;
            Buses = [];

            dataController.getLastData((err, lastData) => {
                if (err) throw err;

                listBuses.forEach(b => {
                    let target = lastData.find(d => d.buscode == listBuses.busCode);
                    Buses.push(new Bus(
                        b.busCode,
                        b.countsPassengers,
                        target ? target.passengers : 0,
                        target ? target.latlng : b.headquarters
                    ));
                });
            });
        }
    });
}

function position() {
    Buses.forEach((bus) => {
        sendState(bus.positionEvent());
    });
}

function door() {
    Buses.forEach((bus) => {
        sendState(bus.doorEvent());
    });
}
function sendState(payload) {
    if (payload) {
        payload.forEach(e => {
            rabbit.sendToQueue('busesQueue', e);
        });
    }
}

