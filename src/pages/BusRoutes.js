import React, { useState } from 'react';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tile from "../components/Tile";
import TileGrid from "../components/TileGrid";

const BusRoutes = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => { // toggles sidebar
        setIsSidebarOpen(!isSidebarOpen);
      };

      const tiles = [
        { title: "Tile 1", content: "This is the content for Tile 1." },
        { title: "Tile 2", content: "This is the content for Tile 2." },
        // Add more tiles as needed
    ];

    return(

        <div className="Display">

            <Navbar onSidebarToggle={handleSidebarToggle} />
            <div className={`Content ${isSidebarOpen ? 'shifted' : ''}`}>
                
                {isSidebarOpen && <Sidebar onClose={handleSidebarToggle}/>}

                <h1>Hi aizel</h1>

                <TileGrid tiles={tiles} />
            </div>

        </div>

    )
}

export default BusRoutes
