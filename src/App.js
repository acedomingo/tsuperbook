// packages
import React, { useState } from 'react';
import { Map, NavigationControl, Marker } from 'react-map-gl';
import { useLazyQuery } from '@apollo/client';
import { NEARBY_ROUTES } from './graphql/Queries';
import GetRoutes from './components/GetRoutes';
// -----------------------------

// Main Website

function App() {

  // initial settings
  const [settings, setsettings] = useState({
    touchZoom: false,
    doubleClickZoom: false
    });
  
  // Nearby routes function
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  
  const [getNearbyRoutes, { loading, error, data }] = useLazyQuery(NEARBY_ROUTES);
  console.log(data)

  function handleClick(event) {
    const coords = event.lngLat; // get coordinates
    console.log('Clicked coordinates:', coords.lng, coords.lat);
    setLongitude(coords.lng);
    setLatitude(coords.lat);
    getNearbyRoutes({variables: {lat: latitude, lon: longitude}})

    return (
      <Marker longitude={coords.lng} latitude={coords.lat}>
      </Marker>
    )
  }

  return (
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
    </Map>
  );
}

export default App