// packages
import React, { useState } from 'react';
import { Map, Layer, Source } from 'react-map-gl';
import { useLazyQuery } from '@apollo/client';
import { TRIP_PLANNING } from '../graphql/Queries';
import { Link } from 'react-router-dom';
import InputField from '../components/inputField';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import polyline from '@mapbox/polyline';

// -----------------------------


const PathFinding = () => {

    // initial settings
    const [settings] = useState({
        touchZoom: false,
        doubleClickZoom: false,
        minZoom: 14,
        maxZoom: 17,
    });

    const quezonCityBoundingBox = [[121.01869583129883,14.604514925547997],[121.090736203863,14.694524072088583]];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleSidebarToggle = () => { // toggles sidebar
        setIsSidebarOpen(!isSidebarOpen);
      };
      
    // Initial Screen
    const [askOpen, setAskOpen] = useState(true); 
    const [origin, setOrigin] = useState();
    const [destination, setDestination] = useState();
    
    // Planned Itinerary
    const [itineraryOpen, setItineraryOpen] = useState(false);
    const [polylineCoords, setPolylineCoords] = useState(null);

    const [showError, setShowError] = useState(false);

    const [tripPlan, { loading, error, data }] = useLazyQuery(TRIP_PLANNING, {
        onCompleted: (data) => {
            console.log("Query result:", data);
            setItineraryOpen(true);
            setAskOpen(false);

        }
    });

    function findPath() {
        if (origin != null && destination != null) {
            console.log("From:", origin.coordinates, "\nTo:", destination.coordinates);

             tripPlan({
                variables: {
                  origin: origin.coordinates,
                  destination: destination.coordinates,
                }
              });

        }
        else  {
            setShowError(true);
            console.log("An error occured");
        }
    };

    const closeError = () => {
        setShowError(false);
    }

    const handleOriginSelected = (location) => {
        setOrigin(location);
    };

    const handleDestinationSelected = (location) => {
        setDestination(location);
    };

    return (
    <>
    <div className="Display">

        <div className="App">
            <Navbar onSidebarToggle={handleSidebarToggle} />
            {isSidebarOpen && <Sidebar onClose={handleSidebarToggle}/>}
        </div>

        <div id="mapbox">
            <Map
            id="map"
            {...settings}
            style={{ width: window.innerWidth, height: window.innerHeight, zIndex: 0 }}
            initialViewState={{
                longitude: 121.04042520880047,
                latitude: 14.649743779882588,
                zoom: 14
            }}
            mapboxAccessToken="pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q"
            mapStyle="mapbox://styles/mapbox/light-v11"
            maxBounds={quezonCityBoundingBox}
            >
            {itineraryOpen && data.plan.itineraries.map((itinerary, index) => (
                <Source
                type="geojson"
                data={{
                    type: 'FeatureCollection',
                    features: itinerary.legs.map(leg => ({
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: polyline.decode(leg.legGeometry.points) 
                    }
                    }))
                }}
                key={index}
                >
                <Layer
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                    'line-color': 'blue',
                    'line-width': 2
                }}
                />
                </Source>
            ))}
            </Map>
        </div>
        
        { askOpen && (
            <>
            <div style={{width: window.innerWidth, height: window.innerHeight, zIndex: 5, backgroundColor: '#FFE133', opacity: 0.5, position:'absolute'}}></div>
            <div className="origDest" style={{zIndex: 10}}>
            {!loading ? (
                <>
                    <h1>Plan your Itinerary</h1>
                    <Link to="/" className="close-button" style={{textDecoration: 'none', right:'0px'}}> X </Link>
                    <h3>From:</h3>
                    <InputField onLocationSelected={handleOriginSelected} placeholder="Origin"/>
                    <h3>To:</h3>
                    <InputField onLocationSelected={handleDestinationSelected} placeholder="Destination" />
                    <h3></h3>
                    <button onClick={findPath}>Find Path</button>
                </>
                
            ) : (
                <>
                    <p>Planning your Trip...</p>
                </>
            )}
            </div>
            </>
        )
        }

        { itineraryOpen && (
            <div className="itinerary">
                <Link to="/" className="close-button" style={{textDecoration: 'none', right:'0px'}}> X </Link>
                <div>
                {data.plan.itineraries.map((itinerary, index) => (
                <div key={index}>
                    <h2>Your Trip</h2>
                    {itinerary.legs.map((leg, legIndex) => (
                        <>
                        { leg.mode == "WALK" ? (<p>Mode: WALK</p>) : 
                         (
                         <>
                            <p>Route: {leg.route.longName} </p>
                            <p>Mode: {leg.route.gtfsId.includes("PUJ") ? "Jeepney" : "Bus"}</p>
                         </>
                         )
                        }
                        
                        <p>Distance: {leg.distance}</p>
                        <p>From: {leg.from.name == "Origin" ? (origin.place_name) : (leg.from.name)}</p>
                        <p>To: {leg.to.name == "Destination" ? (destination.place_name) : leg.to.name}</p>
                        <p>__________________________________________________</p>
                        </>
                    ))}
                </div>
                ))}
            </div>
            </div>
        )
        }

        { showError && (
            <div className="pop-up">
            </div>
        )
        }

        
    </div>
    </>
    );
};

export default PathFinding;
