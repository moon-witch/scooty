class Step{
    distance!: number
    duration!: number
    type!: number
    instruction!: string
    name!: string
    way_points!: number[]
}
class Segment{
    distance!: number
    duration!: number
    steps!: Step[]
}
class feature{
    // Bounding box | smallest rectangle sorrounding the entire path
    // southwest_lng,southwest_lat,northeast_lng,northeast_lat
    bbox?: [number, number,number,number]
    type!: string // expected "Feature"
    properties!: {
        transfers: number,
        fare: number,
        segments: Segment[],
        way_points: number[], // @Todo 2 Zahlen?
        summary: {
            distance: number,
            duration: number
        }
    }
    geometry!: {
        coordinates: [number, number][],
        type: string // "LineString"
    }
}
export class RoutingResponse{
        type: string = "FeatureCollection"
        metadata!: {
            attribution: string
            service: string
            timestamp: number
            query: {
                coordinates: [[number, number], [number, number]],
                profile: string, // expected: "cycling-electric"
                format: string // expected: "json"
            }
            engine: {
                version: string, // example "7.1.0"
                build_date: string,  // example "2023-06-27T12:02:26Z",
                graph_date: string, // example "2023-06-22T19:42:58Z"
            }
        }
        // Bounding box | smallest rectangle sorrounding the entire path
        // southwest_lng,southwest_lat,northeast_lng,northeast_lat
        bbox?: [number, number,number,number]
        features!: feature[]

    constructor(data: Partial<RoutingResponse>){
        Object.assign(this, data);
    }
}