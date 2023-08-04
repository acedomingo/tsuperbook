// packages
import React, { useState, useEffect } from 'react';
import { Map, NavigationControl, Marker, Layer, Source  } from 'react-map-gl';
import { useLazyQuery } from '@apollo/client';
import { NEARBY_ROUTES } from './graphql/Queries';
import Popup from 'reactjs-popup';
import polyline from '@mapbox/polyline';
import * as turf from '@turf/turf';
// -----------------------------

// importing routes
import PUB1 from './routes/LTFRB_PUB0001.geojson';
import PUB2 from './routes/LTFRB_PUB0002.geojson';
import PUB3 from './routes/LTFRB_PUB0003.geojson';
import PUB4 from './routes/LTFRB_PUB0004.geojson';
import PUJ1 from './routes/LTFRB_PUJ0001.geojson';
import PUJ2 from './routes/LTFRB_PUJ0002.geojson';
import PUJ3 from './routes/LTFRB_PUJ0003.geojson';
import PUJ4 from './routes/LTFRB_PUJ0004.geojson';
import PUJ5 from './routes/LTFRB_PUJ0005.geojson';
import PUJ6 from './routes/LTFRB_PUJ0006.geojson';

const App = () => {

  // initializing routes
  const routeDataMap = {
    LTFRB_PUB0001: PUB1,
    LTFRB_PUB0002: PUB2,
    LTFRB_PUB0003: PUB3,
    LTFRB_PUB0004: PUB4,
    LTFRB_PUJ0001: PUJ1,
    LTFRB_PUJ0002: PUJ2,
    LTFRB_PUJ0003: PUJ3,
    LTFRB_PUJ0004: PUJ4,
    LTFRB_PUJ0005: PUJ5,
    LTFRB_PUJ0006: PUJ6,
  };

  // initial settings
  const [settings, setsettings] = useState({
    touchZoom: false,
    doubleClickZoom: false
    });
  
  // ---------------- Nearby routes function -------------------------

  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [showPopup, setShowPopup] = useState(false);
  const [noRoutes, setNoRoutes] = useState(false);
  const [getNearbyRoutes, { error, data }] = useLazyQuery(NEARBY_ROUTES, {variables: {lat: latitude, lon: longitude}});

  if (error) return <p>Error: {error.message}</p>;

  const allRoutes = data?.stopsByRadius?.edges?.flatMap((edge) => edge?.node?.stop?.routes) || []; // all of the routes
  
  console.log(allRoutes);

  const uniqueRoutesSet = new Set();

  // Filter out duplicates using the 'longName' property as the identifier
  const routes = allRoutes.filter((route) => {
    if (!uniqueRoutesSet.has(route.longName)) {
      uniqueRoutesSet.add(route.longName);
      return true;
    }
    return false;
  });
  
  console.log(routes);

  async function handleClick(event) { // on double click
    const coords = event.lngLat; // gets the coordinates of clicked location
    setLongitude(coords.lng);
    setLatitude(coords.lat);
    await getNearbyRoutes() // requests query
    console.log(coords);

    if (routes.length <= 0)
      setNoRoutes(true);
    else
      setNoRoutes(false);

    setShowPopup(true);
  }
  
  // -----------------------------------------------------------
  return (
    <>
    <Map
      {...settings}
      style={{ width: window.innerWidth, height: window.innerHeight }}
      initialViewState={{
        longitude: 121.04042520880047,
        latitude: 14.649743779882588,
        zoom: 14
      }}
      mapboxAccessToken="pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q"
      mapStyle="mapbox://styles/mapbox/light-v11"
      onDblClick={handleClick}
    >
      <NavigationControl showCompass={false} />
      <Marker latitude={latitude} longitude={longitude}></Marker>

       {/* Displaying nearby routes as polylines using Layers */}
       {routes.map((route) => {
        const cleanGtfsId = route.gtfsId.slice(2);
        const geojsonData = routeDataMap[cleanGtfsId];
        
        return (
          <Source key={cleanGtfsId} type="geojson" data={geojsonData}>
            <Layer 
              type="line" 
              source={cleanGtfsId} 
              paint={{
                'line-color': `#${route.color}`,
                'line-width': 2,
                'line-opacity': 0.7,
              }} />
          </Source>
        );
      })}
      
    </Map>
  
    {/* Popup that displays the nearby routes */}
    <Popup
      open={showPopup}
      onClose={() => setShowPopup(false)}
      position="bottom left"
      contentStyle={{
        background: 'white',
        width: '400px',
        padding: '20px',
        borderRadius: '4px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        textAlign: 'left',
        position: 'fixed',
        left: '20px',
        bottom: '20px'
      }}
    >
      <div>
        <h1>Nearby Routes:</h1>
        { noRoutes ? (
            <p>There are no nearby routes.</p>
            ) : (
              <ul>
              {routes.map((route) => (
                <li key={route.gtfsId}>{route.longName}</li>
              ))}
              </ul> 
            )
        }
      </div>
    </Popup> 
    </>
  );
}

export default App
