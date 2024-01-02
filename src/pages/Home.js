// packages
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Map, Marker, Layer, Source } from 'react-map-gl';
import { useLazyQuery, useQuery } from '@apollo/client';
import { NEARBY_ROUTES, GET_STOPS } from '../graphql/Queries';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RouteData from "../components/RouteData";
import RouteInfo from '../components/RouteInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import GpsFixed from '@mui/icons-material/GpsFixed';
import Place from '@mui/icons-material/Place';
import { FeatureCollection, Point } from 'geojson';


// -----------------------------

// importing routes
import PUB1 from '../routes/LTFRB_PUB0001.geojson';
import PUB2 from '../routes/LTFRB_PUB0002.geojson';
import PUB3 from '../routes/LTFRB_PUB0003.geojson';
import PUB4 from '../routes/LTFRB_PUB0004.geojson';
import PUJ1 from '../routes/LTFRB_PUJ0001.geojson';
import PUJ2 from '../routes/LTFRB_PUJ0002.geojson';
import PUJ3 from '../routes/LTFRB_PUJ0003.geojson';
import PUJ4 from '../routes/LTFRB_PUJ0004.geojson';
import PUJ5 from '../routes/LTFRB_PUJ0005.geojson';
import PUJ6 from '../routes/LTFRB_PUJ0006.geojson';

function Home() {

  // initializing routes
  const routeDataMap = {
    LTFRB_PUB0001: PUB1, // QC Hall - Munoz
    LTFRB_PUB0002: PUB2, // QC Hall - Cubao
    LTFRB_PUB0003: PUB3, // QC Hall - Robinsons Magnolia
    LTFRB_PUB0004: PUB4, // Welcome Rotonda - Aurora/Katipunan
    LTFRB_PUJ0001: PUJ1, // Aurora/Lauan - QMC
    LTFRB_PUJ0002: PUJ2, // EDSA/North Ave. - Project 6
    LTFRB_PUJ0003: PUJ3, // Marcos Ave. - Quirino Highway via T. Sora
    LTFRB_PUJ0004: PUJ4, // Proj 2&3 - Welcome Rotonda
    LTFRB_PUJ0005: PUJ5, // EDSA North - UP
    LTFRB_PUJ0006: PUJ6, // Tandang Sora - Visayas Ave. via QC Hall
  };

  // initial settings
  const [settings] = useState({
    touchZoom: false,
    doubleClickZoom: false,
    minZoom: 14,
    maxZoom: 17,
    dragRotate: false
  });

  const [viewport, setViewport] = useState({
    longitude: 121.04042520880047,
    latitude: 14.649743779882588,
    zoom: 14,
  });

  const handleViewportChange = (newViewport) => {
    // Access the updated coordinates and zoom
    console.log('Longitude:', newViewport.longitude);
    console.log('Latitude:', newViewport.latitude);
    console.log('Zoom:', newViewport.zoom);

    // Update the state with the new viewport
    setViewport(newViewport);
  };
  
  const mapRef = useRef(null);
  const quezonCityBoundingBox = [[121.01869583129883,14.604514925547997],[121.090736203863,14.694524072088583]];
  const [enableStops, setEnableStops] = useState(false);
  
  // ---------------- Nearby routes function -------------------------

  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [highlightedRouteGeoJson, setHighlightedRouteGeoJson] = useState(null); // hover over a route
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Route Information
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectRouteParam = searchParams.get('selectRoute');
  const [showInfo, setShowInfo] = useState(false);
  const [selectGeometry, setSelectGeometry] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedStopId, setSelectedStopId] = useState(null);

  useEffect(() => {
    setShowInfo(false);

    if (selectedRoute) {
      console.log("New Route:", selectedRoute)
      setShowPopup(false);
      setSelectGeometry(routeDataMap["LTFRB_"+selectedRoute.id]);      
      setShowInfo(false);
      setSelectedStop(null);
      setSelectedStopId(null);
      setShowInfo(true);
    } 
    else {
      setSelectGeometry(null);
    }
    setHighlightedRouteGeoJson(null);
  }, [selectedRoute]);
  
  useEffect(() => {
    console.log("Pathfinding Route:", selectRouteParam)

    if (selectRouteParam) {
      const selectRoute = RouteData.find((item) => item.name === selectRouteParam);
      console.log("Pathfinding Route Data Item:", selectRoute);
      setSelectedRoute(selectRoute);
      console.log("Pathfinding Route Data Item:", selectedRoute);
    } else {
      console.log("Select route is null.");
    }
  }, [selectRouteParam])

  const { loading: stopsLoading, error: stopsError, data: stopsData } = useQuery(GET_STOPS);

  const getStopsGeoJson = (stopsData) => {
    const features = stopsData?.stopsByBbox?.map((stop) => ({
      type: 'Feature',
      geometry: stop.geometries.geoJson,
      properties: {
        gtfsId: stop.gtfsId,
        name: stop.name,
        routes: stop.routes.map((route) => route.longName),
      },
    }));

    return {
      type: 'FeatureCollection',
      features: features || [],
    };
  };

  const [getNearbyRoutes, { loading, error, data }] = useLazyQuery(NEARBY_ROUTES, {variables: {lat: latitude, lon: longitude}});
  
  const allRoutes = data?.stopsByRadius?.edges?.flatMap((edge) => edge?.node?.stop?.routes) || [];   
  const uniqueRoutesSet = new Set();
  
  const routes = allRoutes.filter((route) => {   // filter out duplicates using the 'longName' property as the identifier
    if (!uniqueRoutesSet.has(route.longName)) {
      uniqueRoutesSet.add(route.longName);
      return true;
    }
    return false;
  });

  async function handleClick(event) { // on double click
    setShowPopup(true);
    setSelectedRoute(null);
    setSelectedStop(null);
    setSelectedStopId(null);

    const coords = event.lngLat; // gets the coordinates of clicked location
    setLongitude(coords.lng);
    setLatitude(coords.lat);
    await getNearbyRoutes() // requests query

    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [coords.lng, coords.lat],
        zoom: 15,
        duration: 2000,
      });
    }
  }

  const handleListItemClick = (route) => { // Get the RouteData item that matches the route name.
    console.log("Select Route:", route)
    try{
      const routeDataItem = RouteData.find((item) => item.name === route.longName);
      setSelectedRoute(routeDataItem);
      console.log("Route Data Item:", selectedRoute);
      console.log("LTFRB_" + routeDataItem.id, selectGeometry);
    }
    catch {
      const routeDataItem = RouteData.find((item) => item.name === route.name);
      setSelectedRoute(routeDataItem);
      console.log("Route Data Item:", selectedRoute);
      console.log("LTFRB_" + routeDataItem.id, selectGeometry);
    }

  };
  
  // -----------------------------------------------------------

  const handleStopClick = (event) => {
    setShowPopup(false);
    setShowInfo(false);
    setSelectedRoute(null);
    const features = event.features;
  
    if (features && features.length > 0) {
      const selectedStop = features[0].properties;
  
      // Update the viewport to fly to the clicked stop
      if (mapRef.current) {
        mapRef.current.getMap().flyTo({
          center: [
            selectedStop.geometries.geoJson.coordinates[0],
            selectedStop.geometries.geoJson.coordinates[1],
          ],
          zoom: 15,
          duration: 2000,
        });
      }
  
      setSelectedStop(selectedStop);
      setSelectedStopId(selectedStop.gtfsId); 
    }
  };

  
  const handleRouteNameMouseEnter = (route) => { // when a nearby route is hovered, the route is highlighted on the map
    try {
      const cleanGtfsId = route.gtfsId.slice(2);
      const geojsonData = routeDataMap[cleanGtfsId];
      setHighlightedRouteGeoJson(geojsonData);
    }
    catch {
      const cleanGtfsId = route.id.slice(2);
      const geojsonData = routeDataMap[cleanGtfsId];
      setHighlightedRouteGeoJson(geojsonData);
    }
  };

  const handleRouteNameMouseLeave = () => { // removes highlighted route
    setHighlightedRouteGeoJson(null);
  };

  const handleClosePopup = () => { // close nearby route popup
    setShowPopup(false);
    setShowInfo(false);
    setSelectedRoute(null);
    setSelectedStop(null);
    setSelectedStopId(null);

    const newSearch = new URLSearchParams(location.search);
    newSearch.delete('selectRoute');
    navigate(`?${newSearch.toString()}`);
  };

  const handleSidebarToggle = () => { // toggles sidebar
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStopToggle = () => {
    setEnableStops(!enableStops);
  }

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [121.04042520880047, 14.649743779882588],
        zoom: 14,
        duration: 2000, // Set the duration of the flyTo animation in milliseconds
      });
    }
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
      ref={mapRef}
      style={{ width: '100vw', height: '100vh' }}
      initialViewState={viewport}
      onViewportChange={handleViewportChange}
      mapboxAccessToken="pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q"
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onDblClick={handleClick}
      maxBounds={quezonCityBoundingBox}
    >

      {showPopup && (
        <Marker latitude={latitude} longitude={longitude}></Marker>
      )}

       {/* Displaying nearby routes as polylines using Layers */}
       {routes.map((route) => {
        const cleanGtfsId = route.gtfsId.slice(2);
        const geojsonData = routeDataMap[cleanGtfsId];
        
        if (showPopup) {
          return (
            <Source key={cleanGtfsId} type="geojson" data={geojsonData}>
              <Layer 
                type="line" 
                paint={{
                  'line-color': cleanGtfsId.includes("PUJ") ? "#DC143C" : "#003366",
                  'line-width': 2,
                  'line-opacity':  highlightedRouteGeoJson && highlightedRouteGeoJson !== geojsonData ? 0.3 : 0.7,
                }} />
            </Source>
          );
        } else {
          return null;
        }
      })}

      {highlightedRouteGeoJson && (
        <Source type="geojson" data={highlightedRouteGeoJson}>
          <Layer
            type="line"
            paint={{
              'line-color': '#9370DB', // #C8A2C8 #9400D3 #8B008B
              'line-width': 4,
              'line-opacity': 1,
            }}
          />
        </Source>
      )}

      {showInfo && selectedRoute && (
        <Source type="geojson" data={selectGeometry}>
            <Layer 
              type="line" 
              paint={{
                'line-color': selectedRoute.type == "Jeepney" ? '#DC143C' : '#003366', // #FF2400
                'line-width': 4,
                'line-opacity': 1,
                }} />
        </Source>
      )}

      {enableStops && stopsData && (
        <>
          {stopsData.stopsByBbox.map((stop) => (
            <Marker
              key={stop.gtfsId}
              longitude={stop.geometries.geoJson.coordinates[0]}
              latitude={stop.geometries.geoJson.coordinates[1]}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: selectedStopId === stop.gtfsId ? '#FF2400' : '#FFC133',
                  cursor: 'pointer',
                  border: '2px solid #000',
                  transition: 'background-color 0.3s ease', // Add transition for smooth color change
                }}
                onClick={() => handleStopClick({ features: [{ properties: stop }] })}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#FF2400'; // Change background color on hover
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor =
                    selectedStopId === stop.gtfsId ? '#FF2400' : '#FFC133'; // Change back to original color on hover out
                }}
              />
            </Marker>
          ))}
        </>
      )}
      
    </Map>
    </div>
    </div>

    {/* List of nearby routes (Popup) */}
    {showPopup && (
      <div className="popup">
        <button className="close-button" onClick={handleClosePopup}> X </button>
        { loading ? (<p>Fetching nearby routes....</p>) : (
          <>
            <h1>Nearby Routes:</h1>
            { error ? (<p>Failed to fetch routes...</p>) : (
              <>
                {routes.length <= 0 && !loading ? (
                  <p>There are no nearby routes.</p>
                ) : (
                  <ul>         
                    {routes.map((route) => (
                      <li
                        key={route.gtfsId}
                        className="routeName"
                        onClick={() => handleListItemClick(route)}
                        onMouseEnter={() => handleRouteNameMouseEnter(route)}
                        onMouseLeave={handleRouteNameMouseLeave}
                      >
                      {route.longName}
                      </li>
                  ))}
                  </ul>  
                  )}
                </>
              )}
          </> 
        )}                         
      </div>
    )} 

    <button className='recenter-button' onClick={recenterMap}><GpsFixed /></button>
    <button className='recenter-button' style={{left: '5vw'}} onClick={handleStopToggle}><Place /></button>

    {showInfo && (
      <RouteInfo
      selectRoute={selectedRoute}
      onClosePopup={handleClosePopup}
      differentRoute={handleListItemClick}
      enterHighlight={handleRouteNameMouseEnter}
      exitHighlight={handleRouteNameMouseLeave}
      />)}

      {selectedStop && (
        <div className="popup">
          <button className="close-button" onClick={handleClosePopup}> X </button>
          <h2>{selectedStop.name}</h2>
          {selectedStop.routes && selectedStop.routes.length > 0 ? (
            <>
              <h3>Routes:</h3>
              <ul>
                {selectedStop.routes.map((route) => (
                  <li
                  key={route.gtfsId}
                  className="routeName"
                  onClick={() => handleListItemClick(route)}
                  onMouseEnter={() => handleRouteNameMouseEnter(route)}
                  onMouseLeave={handleRouteNameMouseLeave}
                  >
                  {route.longName}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>No routes pass through this stop.</p>
          )}
        </div>
      )}

    </>
  );
}

export default Home
