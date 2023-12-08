import React, { useState, useEffect } from 'react';
import '../App.css';
import { ROUTE_DETAILS } from '../graphql/Queries';
import { useQuery } from '@apollo/client';

const RouteInfo = ({ selectRoute, onClosePopup, differentRoute, enterHighlight, exitHighlight }) => {
  console.log('Route Info:', selectRoute);

  const handleClick = (val) => {
    console.log("Route:", val)
  }

  // Use optional chaining to prevent errors when selectRoute is null
  const { loading, error, data } = useQuery(ROUTE_DETAILS, {
    variables: { route_id: selectRoute?.id ? `1:LTFRB_${selectRoute.id}` : null },
  });

  const [stops, setStops] = useState([]);
  const [landmarks, setLandmarks] = useState(selectRoute?.landmarks || []);
  const [nearbyRoutes, setNearbyRoutes] = useState(null);

  useEffect(() => {
    if (data) {
      console.log('Query:', data);
  
      // Use optional chaining to safely access properties
      const stopsData = data.route?.stops || [];
      setStops(stopsData);
  
      // Extract nearby routes from each stop and remove duplicates
      console.log("Overlapping routes:", nearbyRoutes);
      const uniqueRoutesSet = new Set();
      const allNearbyRoutes = stopsData.flatMap((stop) =>
        stop.routes?.map((route) => {
          const routeObject = { name: route.longName, id: route.gtfsId };
          if (!uniqueRoutesSet.has(routeObject.id)) {
            uniqueRoutesSet.add(routeObject.id);
            return routeObject;
          }
          return null;
        }) || []
      );
  
      // Filter out routes with the same name as selectRoute.name
      const filteredNearbyRoutes = allNearbyRoutes.filter(
        (route) => route && route.name !== selectRoute.name
      );
  
      setNearbyRoutes(filteredNearbyRoutes);
      console.log('Nearby Routes:', filteredNearbyRoutes);
    }
  }, [data, selectRoute]);
  // If selectRoute is null, return null or an empty fragment
  if (!selectRoute) {
    return null;
  }

  return (
    <div className="routeInfo">
      <button className="close-button" onClick={onClosePopup}>
      X
      </button>
      <h1>{selectRoute.name}</h1>
      <h2>{`(${selectRoute.type})`}</h2>
      <h3>Stops</h3>
      <ul>
        {stops.map((stop) => (
          <li key={stop.name}>{stop.name}</li>
        ))}
      </ul>
      <h3>Landmarks</h3>
      <ul>
        {landmarks.length > 0 ? (
          landmarks.map((landmark) => <li key={landmark.id}>{landmark.name}</li>)
        ) : (
          <p>No landmarks found for {selectRoute.name}.</p>
        )}
      </ul>
      <h3>Overlapping Routes</h3>
      <ul>
        {nearbyRoutes?.map((route) => (
          <li
          key={route.id}
          onClick={() => differentRoute(route)}
          onMouseEnter={() => enterHighlight(route)} 
          onMouseLeave={exitHighlight}
          className="routeName"
          >
            {route.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteInfo;
