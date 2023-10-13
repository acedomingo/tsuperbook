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
        { title: "Tile 3", content: "This is the content for Tile 3." },
        { title: "Tile 4", content: "This is the content for Tile 4." },
        { title: "Tile 5", content: "This is the content for Tile 5." },
        { title: "Tile 6", content: "This is the content for Tile 6." },
        
        // Add more tiles as needed
    ];

    return(

        <div className="Display">

            <Navbar onSidebarToggle={handleSidebarToggle} />
            <div className={`Content ${isSidebarOpen ? 'shifted' : ''}`}>
                
                {isSidebarOpen && <Sidebar onClose={handleSidebarToggle}/>}

                <TileGrid tiles={tiles} />
            </div>

        </div>

    )
}

export default BusRoutes
