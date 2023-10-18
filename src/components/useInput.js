import { useState } from "react";

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

  const handleChange = async (event) => {
    setValue(event.target.value);

    try {
      const quezonCityBoundingBox = "121.01869583129883,14.604514925547997,121.090736203863,14.694524072088583";
      const mapboxToken = "pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q";
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${event.target.value}.json?access_token=${mapboxToken}&autocomplete=true&bbox=${quezonCityBoundingBox}`;      
      const response = await fetch(endpoint);
      const results = await response.json();
      setSuggestions(results?.features);

      if (results?.features.length > 0) {
        const firstFeature = results.features[0];
        const [longitude, latitude] = firstFeature.geometry.coordinates;
        setCoordinates({ longitude, latitude });
      } else {
        setCoordinates(null); 
      }
    } catch (error) {
      console.log("Error fetching data, ", error);
    }
  };

  return {
    value,
    onChange: handleChange,
    setValue,
    suggestions,
    setSuggestions,
    coordinates
  };
};

export default useInput;
