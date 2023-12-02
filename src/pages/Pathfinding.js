// packages
import React, { useState, useEffect  } from 'react';
import { Map, Layer, Source, Marker } from 'react-map-gl';
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
    const [currentLegIndex, setCurrentLegIndex] = useState(0);
    const [legGeometries, setLegGeometries] = useState([]);
    const [noItineraries, setNoItineraries] = useState(false);

    const [showError, setShowError] = useState(false);

    const [tripPlan, { loading, error, data }] = useLazyQuery(TRIP_PLANNING, {
        onCompleted: (data) => {
            console.log("Query result:", data);
            setItineraryOpen(true);
            setAskOpen(false);

            if (data.plan.itineraries[0].legs.length <= 1)
              setNoItineraries(true);

            console.log("No Itineraries? ", noItineraries);

        }
    });

    useEffect(() => {
      // Process leg geometries when data is available
      if (data && data.plan && data.plan.itineraries) {
        const legs = data.plan.itineraries[0].legs || [];

        if (legs.length > 1) {

        const newLegGeometries = [];
  
        legs.forEach((leg, index) => {
          const geometryPoints = leg.legGeometry.points;
          const coordinates = polyline.decode(geometryPoints).map((point) => [point[1], point[0]]);
          const originCoords = [leg.from.lon, leg.from.lat];
          const destinationCoords = [leg.to.lon, leg.to.lat];
  
          newLegGeometries.push({
            coordinates,
            highlighted: index === currentLegIndex,
            originCoords,
            destinationCoords,
          });
        });
  
        setLegGeometries(newLegGeometries);
        }
      }
    }, [data, currentLegIndex]);
  

    function findPath() {
        if (origin && destination) {
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

    const handleNextLeg = () => {
        setCurrentLegIndex((prevIndex) => (prevIndex < data.plan.itineraries[0].legs.length - 1 ? prevIndex + 1 : prevIndex));
    };

    const handlePreviousLeg = () => {
        setCurrentLegIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    function refreshPage(){ 
      window.location.reload(); 
    }

    function clickHandler(e){
      e.preventDefault()
    }

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
           {legGeometries.map(({ coordinates, highlighted, originCoords, destinationCoords }, index) => (
              <React.Fragment key={index}>
                <Source
                  type="geojson"
                  data={{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } }}
                >
                  <Layer
                    id={`leg-geometry-${index}`}
                    type="line"
                    paint={{
                      'line-color': highlighted ? '#800080' : '#088',
                      'line-width': highlighted ? 4 : 2,
                    }}
                  />
                </Source>

                {/* Conditional rendering of markers only for the highlighted leg */}
                {highlighted && (
                  <>
                    <Marker
                      latitude={originCoords[1]}
                      longitude={originCoords[0]}
                    >
                      <div className="marker start-marker">Start</div>
                    </Marker>

                    <Marker
                      latitude={destinationCoords[1]}
                      longitude={destinationCoords[0]}

                    >
                      <div className="marker end-marker">End</div>
                    </Marker>
                  </>
                )}
              </React.Fragment>
            ))}
            </Map>
        </div>
        
        { askOpen && (
            <>
            <div style={{width: window.innerWidth, height: window.innerHeight, zIndex: 5, backgroundColor: '#FFE133', opacity: 0.5, position:'absolute'}}></div>
            <div className="origDest" style={{zIndex: 10}}>
            {!loading ? (
                <>
                    <h1><center>Plan your Itinerary</center></h1>
                    <Link to="/" className="close-button" style={{textDecoration: 'none', right:'0px'}}> X </Link>
                    <h3>From:</h3>
                    <InputField onLocationSelected={handleOriginSelected} placeholder="Origin"/>
                    <h3>To:</h3>
                    <InputField onLocationSelected={handleDestinationSelected} placeholder="Destination" />
                    <h3></h3>
                    <button onClick={findPath} className='findButton'>Find Path</button>
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

        {itineraryOpen && (
          <div className="itinerary">
            <Link to="/" className="close-button" style={{textDecoration: 'none', right:'0px'}}> X </Link>
            <div>
              {data.plan.itineraries.map((itinerary, index) => (
                <div key={index}>
                  <h2>Your Trip</h2>
                  {itinerary.legs.length <= 1 ? (
                    <>
                    <p>No itineraries found</p>
                   
                    </>
                  ) : (
                    <>
                      {itinerary.legs.map((leg, legIndex) => (
                        <>
                          {/* Only display the current leg */}
                          {legIndex === currentLegIndex && (
                            <>
                              {leg.mode === 'WALK' ? (
                                <p>Mode: WALK</p>
                              ) : (
                                <>
                                  <Link className='routeName' to={`/?selectRoute=${String(leg.route.longName)}`}>
                                    <p>Route: {leg.route.longName}</p>
                                  </Link>
                                  <p>Mode: {leg.route.gtfsId.includes('PUJ') ? 'Jeepney' : 'Bus'}</p>
                                </>
                              )}

                              <p>Distance: {leg.distance}</p>
                              <p>From: {leg.from.name === 'Origin' ? origin.place_name : leg.from.name}</p>
                              <p>To: {leg.to.name === 'Destination' ? destination.place_name : leg.to.name}</p>
                            </>
                          )}
                        </>
                      ))}
                      {/* Navigation buttons */}
                      <button className='arrow' onClick={handlePreviousLeg} disabled={currentLegIndex === 0}>
                        ←
                      </button>
                      <p style={{position: 'absolute', left:'125px', bottom: '1px'}}>Page {currentLegIndex+1} out of {itinerary.legs.length}</p>
                      <button className='arrow' onClick={handleNextLeg} disabled={currentLegIndex === itinerary.legs.length - 1} style={{position: 'absolute', right:'15px'}}>
                        →
                      </button>
                    </>
                  )}
                </div>
              ))}
               <button onClick={refreshPage} className='findButton' style={{textDecoration: 'none', position: 'relative', top: 100 }}> Plan another trip </button>
            </div>
          </div>
        )}

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
