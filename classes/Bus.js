const uuidv4 = require('uuid/v4');

module.exports = class Bus {

    constructor(busCode, countsPassengers, passengers, latlng) {
        this.BusCode = busCode;
        this.CountsPassengers = countsPassengers;
        this.Passengers = passengers;
        this.Latlng = latlng;

        this.StopCode = null;
        this.DoorIsOpen = null;
        this.Online = null;
        this.SaveData = [];
    }

    randomCoordinate(radius) {
        let y0 = +this.Latlng[0];
        let x0 = +this.Latlng[1];
        let rd = radius / 111300;

        let u = Math.random();
        let v = Math.random();

        let w = rd * Math.sqrt(u);
        let t = 2 * Math.PI * v;
        let x = w * Math.cos(t);
        let y = w * Math.sin(t);

        let newlat = y + y0;
        let newlon = x + x0;

        return this.Latlng = [newlat.toFixed(6), newlon.toFixed(6)];
    }

    statePassengers() {
        if (!this.CountsPassengers || this.DoorIsOpen) return null;
        return this.Passengers = Math.floor(Math.random() * 61); //0-60 Passengers
    }

    stateDoors() {
        let changeState;
        if (this.DoorIsOpen == true) {
            changeState = Math.random() >= 0.30;
            if (changeState) return null;

            return this.DoorIsOpen = false;
        }
        changeState = Math.random() >= 0.95;
        if (!changeState) return this.DoorIsOpen = null;
      
        this.StopCode = uuidv4();
        return this.DoorIsOpen = true;
    }

    stateConnection(obj) {
        this.Online = Math.random() >= 0.1;
        if (!this.Online) {
            this.SaveData.push(obj);
            return null;
        }
        this.SaveData.push(obj);
        let data = JSON.parse(JSON.stringify(this.SaveData));
        this.SaveData = [];
        return data;
    }

    payload() {
        if(this.DoorIsOpen != true) this.randomCoordinate(2000);
    

        let data = {
            timestamp: new Date(),
            buscode: this.BusCode,
            latlng: this.Latlng,
            doorisopen: null,
            passengers: null
        };

        return data;
    }

    positionEvent() {
        return this.stateConnection(this.payload());
    }

    doorEvent() {
        let data = this.payload();
        if (this.stateDoors() == null) return null;
        data.doorisopen = this.DoorIsOpen;
        data.passengers = this.statePassengers();
        data.stopcode = this.StopCode;
        return this.stateConnection(data);
    }
}
