const uuidv4 = require('uuid/v4');

module.exports = class Bus {

    constructor(busCode, countsPassengers, passengers, latlng) {
        this.BusCode = busCode;
        this.CountsPassengers = countsPassengers;
        this.Passengers = passengers;
        this.Latlng = latlng;

        this.DoorIsOpen = false;
        this.saveData = [];
    }

    randomCoordinate(radius) {
        var y0 = +this.Latlng[0];
        var x0 = +this.Latlng[1];
        var rd = radius / 111300;

        var u = Math.random();
        var v = Math.random();

        var w = rd * Math.sqrt(u);
        var t = 2 * Math.PI * v;
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        var newlat = y + y0;
        var newlon = x + x0;

        this.latlng = [newlat.toFixed(6), newlon.toFixed(6)];
        return this.latlng;
    }

    updatePassengers() {
        if (!this.CountsPassengers) return -1;
        if (this.DoorIsOpen) this.Passengers = Math.floor(Math.random() * 61); //0-60 Passengers

        return this.Passengers;
    }

    stateDoors() {
        this.DoorIsOpen = Math.random() >= 0.99;
        return this.DoorIsOpen;
    }

    generatePayload() {
        let obj = {
            id: uuidv4(),
            buscode: this.BusCode,
            doorisopen: this.DoorIsOpen,
            passengers: this.updatePassengers(),
            latlng: this.randomCoordinate(2000),
            timestamp: new Date()
        };

        return this.stateConnection(obj);
    }

    stateConnection(obj) {
        if (this.IsOnline()) {
            this.saveData.push(obj);
            let Data = JSON.parse(JSON.stringify(this.saveData));
            this.saveData = [];
            return Data;
        }
        this.saveData.push(obj);
        return null;
    }

    IsOnline() {
        return Math.random() >= 0.1;
    }

}
