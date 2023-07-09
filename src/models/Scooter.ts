export class Scooter {
    id: any;
    latitude?: number;
    longitude?: number;
    available?: boolean;
    
    constructor(data: Partial<Scooter>){
        Object.assign(this, data)
    }
}