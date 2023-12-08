// inputField.js

import React from "react";
import styled from "styled-components";
import useInput from "./useInput";

const InputField = ({ onLocationSelected, placeholder }) => {
  const address = useInput("");
  const mapboxToken = "pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q";

  const fetchCoordinates = async (addressName) => {
      const forFetching = addressName.replace(/ /g,"%20");
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${forFetching}.json?access_token=${mapboxToken}`
      );
  
      if (response.ok) {
        const data = await response.json();
        console.log(response);
        const coordinates = data.features[0].geometry.coordinates; // Extract coordinates
        const swappedCoordinates = coordinates[1] + ", " + coordinates[0];
        onLocationSelected({ place_name: addressName, coordinates: swappedCoordinates });
        address.setSuggestions([]);
      } 
  };

  const handleLocationSelected = (location) => {
    onLocationSelected(location);
    address.setValue(location);
    address.setSuggestions([]);
    fetchCoordinates(location);
  };


  return (
    <Wrapper>
      <Input
        placeholder={placeholder}
        value={address.value}
        onChange={address.onChange}
        isTyping={address.value !== ""}
      />
      {address.suggestions?.length > 0 && (
        <SuggestionWrapper>
          {address.suggestions
            .sort((a, b) => a.place_name.localeCompare(b.place_name))
            .map((suggestion, index) => {
            return (
              <Suggestion
                key={index}
                onClick={() => handleLocationSelected(suggestion.place_name)}
              >
                {suggestion.place_name}
              </Suggestion>
            );
          })}
        </SuggestionWrapper>
      )}
    </Wrapper>
  );
};

export default InputField;

const Wrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  margin: 0 auto;
`;

const Input = styled.input`
  width: 1100px;
  background: #FFFCF4;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  position: relative;
  display: grid;
  justify-self: center;
  &:focus {
    outline: none;
    border-radius: ${(props) => props.isTyping && "10px 10px 0px 0px"};
  }
}`;

const SuggestionWrapper = styled.div`
  background: white;
  position: absolute;
  width: 1100px;
  padding: 10px 20px;
  border-radius: 0px 0px 10px 10px;
  z-index: 1000;
`;

const Suggestion = styled.p`
  cursor: pointer;
  max-width: 1100px;
`;
