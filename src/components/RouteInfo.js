import React, { useState, useEffect } from 'react';
import '../App.css';
import { ROUTE_DETAILS } from '../graphql/Queries';
import { useQuery } from '@apollo/client';

const RouteInfo = ({ selectRoute, onClosePopup, differentRoute, enterHighlight, exitHighlight, selectStop, hoverStop, leaveStop }) => {
  // Use optional chaining to prevent errors when selectRoute is null
  const { loading, error, data } = useQuery(ROUTE_DETAILS, {
    variables: { route_id: selectRoute?.id ? `1:LTFRB_${selectRoute.id}` : null },
  });

  const [forwardStops, setForwardStops] = useState([]);
  const [returnStops, setReturnStops] = useState([]);
  const [landmarks, setLandmarks] = useState(selectRoute?.landmarks || []);
  const [nearbyRoutes, setNearbyRoutes] = useState(null);

  useEffect(() => {
    if (data) {
      const forwardStopsData = data.route?.trips
        ?.find((trip) => trip.directionId == "1")
        ?.stops || [];
      setForwardStops(forwardStopsData);

      const returnStopsData = data.route?.trips
        ?.find((trip) => trip.directionId == "0")
        ?.stops || [];
      setReturnStops(returnStopsData);

      const allNearbyRoutes = extractNearbyRoutes(forwardStopsData.concat(returnStopsData));
      setNearbyRoutes(allNearbyRoutes);
      console.log("Nearby Routes:", allNearbyRoutes);
    }
  }, [data, selectRoute]);
  
  const extractNearbyRoutes = (stopsData) => {
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

    return allNearbyRoutes.filter(
      (route) => route && route.name !== selectRoute.name
    );
  };
  
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
      <h3>Forward Trip Stops</h3>
      <ul>
        {forwardStops.map((stop) => (
          <li
            key={stop.name}
            onClick={() => selectStop(stop)}
            onMouseEnter={() => hoverStop(stop)}
            onMouseLeave={leaveStop}
            className="routeName"
          >
            {stop.name}
          </li>
        ))}
      </ul>
      <h3>Return Trip Stops</h3>
      <ul>
        {returnStops.map((stop) => (
          <li
            key={stop.name}
            onClick={() => selectStop(stop)}
            onMouseEnter={() => hoverStop(stop)}
            onMouseLeave={leaveStop}
            className="routeName"
          >
            {stop.name}
          </li>
        ))}
      </ul>
      <h3>Visitable Landmarks</h3>
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
