import { gql } from "@apollo/client";

export const GET_ROUTES = gql `
# Gets the information on all transit routes from OTP
    query getRoutes {
        routes {
            gtfsId
            longName
        }
    }
`

export const ROUTE_DETAILS = gql `
# Gets more details on each transit route
query Route($route_id: String!){
    route(id:$route_id) {
        longName
        stops {
            name
            routes {
                gtfsId
                longName
            }
        }
        trips {
            tripGeometry {
                length
                points
            }
        }
    }
}
`

export const NEARBY_ROUTES = gql `
query nearbyRoutes($lat: Float!, $lon: Float!) {
    stopsByRadius(lat: $lat, lon: $lon, radius: 500){
        edges {
            node {
                stop {
                    routes {
                        longName
                        gtfsId
                    }
                }
            }
        }
    }
}
`

export const TRIP_PLANNING = gql `
query planTrip($from: String, $to: String){
    plan(
        fromPlace: $from
        toPlace: $to
        waitReluctance: 0
        arriveBy: false
        transportModes: [{mode: BUS}]
        time: "00:00:00"
        numItineraries: 3
        walkReluctance: 4
    ) {
        itineraries {
            walkDistance
            legs {
                mode
                distance
                from {
                    lat
                    lon
                    name
                    stop {
                        code
                        name
                    }
                }
                to {
                    lat
                    lon
                    name
                }
                route {
                    longName
                    gtfsId
                }
                distance
                legGeometry {
                    length
                    points
                }
            }
        }
    }
}
`