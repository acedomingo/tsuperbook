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
        dragRotate: false
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

            if (data.plan.itineraries[0].legs.length <= 1 || !data)
              setNoItineraries(true);

            console.log("No Itineraries? ", noItineraries);

        }
    });

    useEffect(() => {
      // Process leg geometries when data is available
      if (data && data.plan && data.plan.itineraries  && data.plan.itineraries.length > 0) {
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
        }
    };

    const closeError = () => {
        setShowError(false);
    }

    const planAnotherTrip = () => {
      setItineraryOpen(false);
      setAskOpen(true);
      setCurrentLegIndex(0);
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
            style={{ width: '100vw', height: '100vh', zIndex: 0 }}
            initialViewState={{
                longitude: 121.04042520880047,
                latitude: 14.649743779882588,
                zoom: 14
            }}
            mapboxAccessToken="pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q"
            mapStyle="mapbox://styles/mapbox/streets-v12"
            maxBounds={quezonCityBoundingBox}
            >
           {itineraryOpen && (
            <>
              {/* Your existing components and code */}
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
                        'line-color': highlighted ? '#8A2BE2' : '#088',
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
            </>
          )}

            </Map>
        </div>
        
        {askOpen && (
          <>
            <div style={{ width: '100vw', height: '100vh', zIndex: 5, backgroundColor: '#FFE133', opacity: 0.5, position: 'absolute' }}></div>
            <div className="origDest" style={{ zIndex: 10 }}>
              {!loading ? (
                <>
                  <h1><center>Plan your Itinerary</center></h1>
                  <Link to="/" className="close-button" style={{ textDecoration: 'none', right: '0px' }}> X </Link>
                  <div className="input-field-container">
                    <div>
                      <h3>From:</h3>
                      <InputField onLocationSelected={handleOriginSelected} placeholder="Origin" />
                    </div>
                    <div>
                      <h3>To:</h3>
                      <InputField onLocationSelected={handleDestinationSelected} placeholder="Destination" />
                    </div>
                    <div>
                      <button onClick={findPath} className='findButton'>Find Path</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p>Planning your Trip...</p>
                </>
              )}
            </div>
          </>
        )}

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
                                  <Link className='routeName' to={`/?selectRoute=${encodeURIComponent(String(leg.route.longName))}`}>
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
                     <div className="page-info">
                      <button className='arrow' onClick={handlePreviousLeg} disabled={currentLegIndex === 0}>
                        ←
                      </button>
                      <p>Page {currentLegIndex + 1} out of {itinerary.legs.length}</p>
                      <button className='arrow' onClick={handleNextLeg} disabled={currentLegIndex === itinerary.legs.length - 1}>
                        →
                      </button>
                    </div>
                    </>
                  )}
                </div>
              ))}
               <button onClick={planAnotherTrip} className='findButton' style={{textDecoration: 'none', position: 'relative', top: 5 }}> Plan another trip </button>
            </div>
          </div>
        )}

        { (showError || error) && (
            <div className="popup" style={{ zIndex: 1000, width: 'fit-content', height: 300, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <button className="close-button" onClick={closeError} style={{zIndex:10000}}> X </button>
              <div style={{ textAlign: 'center', marginTop: 100, maxWidth: 500 }}>
                {error ? `Error: ${error.message}` : 'Failed to fetch itineraries...'}
              </div>
            </div>
        )
        }
        
    </div>
    </>
    );
};

export default PathFinding;
