// packages
import React, { useState } from 'react';
import { Map, Layer, Source } from 'react-map-gl';
import { useLazyQuery } from '@apollo/client';
import { TRIP_PLANNING } from '../graphql/Queries';
import { Link } from 'react-router-dom';
import InputField from '../components/inputField';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


// -----------------------------


const PathFinding = () => {

    // initial settings
    const [settings] = useState({
        touchZoom: false,
        doubleClickZoom: false,
        minZoom: 14,
        maxZoom: 17,
    });

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

    const [showError, setShowError] = useState(false);

    const [tripPlan, { loading, error, data }] = useLazyQuery(TRIP_PLANNING);
    const [tripPlan2, { data2 }] = useLazyQuery(TRIP_PLANNING, {variables: {origin: "14.650262,121.040416", destination: "14.654916,121.064408"}});


    function findPath() {
        if (origin != null && destination != null) {
            setAskOpen(false);
            setItineraryOpen(true);
            console.log("From:", origin.coordinates, "\nTo:", destination.coordinates);

             tripPlan({
                variables: {
                  origin: "14.650262,121.040416",
                  destination: "14.654916,121.064408",
                },
                onCompleted: (result) => {
                  // Access data here when the query is completed
                  console.log("Query result:", data);
                },
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
            style={{ width: window.innerWidth, height: window.innerHeight }}
            initialViewState={{
                longitude: 121.04042520880047,
                latitude: 14.649743779882588,
                zoom: 14
            }}
            mapboxAccessToken="pk.eyJ1IjoiYWNlZG9taW5nbyIsImEiOiJjbGpvOTB3ZjMwMWFiM2dxbDc5cjU0Y2FvIn0.aJC6z1-KjLBiG15MUfzO4Q"
            mapStyle="mapbox://styles/mapbox/light-v11"
            >
            
            </Map>
        </div>
        
        { askOpen && (
            <div className="origDest">
                <h1>Plan your Itinerary</h1>
                <Link to="/" className="close-button" style={{textDecoration: 'none', right:'0px'}}> X </Link>
                <h3>From:</h3>
                <InputField onLocationSelected={handleOriginSelected} placeholder="Origin"/>
                <h3>To:</h3>
                <InputField onLocationSelected={handleDestinationSelected} placeholder="Destination" />
                <h3></h3>
                <button onClick={findPath}>Find Path</button>
            </div>
        )
        }

        { itineraryOpen && (
            <div class="origDest">
                <h1>Itinerary</h1>
                <Link to="/" className="close-button" style={{textDecoration: 'none', right:'0px'}}> X </Link>
            </div>
        )
        }

        { showError && (
            <div class="pop-up">
            </div>
        )
        }

        
    </div>
    </>
    );
};

export default PathFinding;
