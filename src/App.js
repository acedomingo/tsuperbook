// packages
import React, { useState, useEffect } from 'react';
import { Map, NavigationControl, Marker } from 'react-map-gl';
import { useLazyQuery } from '@apollo/client';
import { NEARBY_ROUTES } from './graphql/Queries';
import Popup from 'reactjs-popup';
// -----------------------------

// Main Website

const App = () => {

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
