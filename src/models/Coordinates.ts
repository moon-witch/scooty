import type { Scooter } from "./Scooter";

export class Coordinates{
    lat: number
    lng: number

    constructor(lat: number, lng: number){
        this.lat = lat;
        this.lng = lng;
    }

    static fromScooter(s: Scooter){
        return new Coordinates(s.latitude as number, s.longitude as number)
    }
}