const panorama = require('google-panorama-by-location');
const uuidv4 = require('uuid/v4');

class Bus {

    constructor(busCode, countsPassengers, passengers, latlng) {
        this.BusCode = busCode;
        this.CountsPassengers = countsPassengers;
        this.Passengers = passengers;
        this.Latlng = latlng;

        this.DoorIsOpen = false;
        this.saveData = [];

        this.configuration = { radius: +2000 }; //radius in meters
    }

    randomCoordinate() {
        var y0 = +this.Latlng[0];
        var x0 = +this.Latlng[1];
        var rd = this.configuration.radius / 111300;

        var u = Math.random();
        var v = Math.random();

        var w = rd * Math.sqrt(u);
        var t = 2 * Math.PI * v;
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        var newlat = y + y0;
        var newlon = x + x0;
        return [newlat, newlon];
    }

    coordinateOnStreet() {
        return new Promise((resolve, reject) => {
            panorama(this.randomCoordinate(), this.configuration, (err, result) => {
                if (err) this.coordinateOnStreet();
                this.Latlng = [result.latitude.toFixed(6), result.longitude.toFixed(6)];
                resolve(this.Latlng);
            });
        });
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

    async generatePayload() {
        let obj = {
            id: uuidv4(),
            buscode: this.BusCode,
            doorisopen: this.DoorIsOpen,
            passengers: this.updatePassengers(),
            latlng: await this.coordinateOnStreet(),
            timestamp: new Date()
        };
        return this.stateConnection(obj);
    }

    stateConnection(obj) {
        if (Math.random() >= 0.1) //online
        {
            this.saveData.push(obj);
            let Data = JSON.parse(JSON.stringify(this.saveData));
            this.saveData = [];
            return Data;
        }
        this.saveData.push(obj); //offline
        return null;
    }

}

module.exports = Bus;