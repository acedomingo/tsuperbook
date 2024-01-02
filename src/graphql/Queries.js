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
    }
}
`

export const NEARBY_ROUTES = gql `
query nearbyRoutes($lat: Float!, $lon: Float!) {
    stopsByRadius(lat: $lat, lon: $lon, radius: 750){
        edges {
            node {
                stop {
                    routes {
                        longName
                        gtfsId
                        color
                    }
                }
            }
        }
    }
}
`

export const GET_STOPS = gql `
query {
  stopsByBbox(
    minLat:14.604514925547997, 
    minLon:121.01869583129883, 
    maxLat:14.694524072088583, 
    maxLon:121.090736203863,) {
    gtfsId
    name
    geometries {
      geoJson
    }
    routes{
      longName
      gtfsId
    }
  }
}
`

export const TRIP_PLANNING = gql `
query planTrip($origin: String, $destination: String){
  plan(
    fromPlace: $origin
    toPlace: $destination
    waitReluctance: 0
    arriveBy: false
    transportModes: [{mode: BUS}]
    time: "00:00:00"
    numItineraries: 1
    walkReluctance: 4
    maxWalkDistance:500
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
