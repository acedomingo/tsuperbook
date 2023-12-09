import React, { useState } from 'react';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tile from "../components/Tile";
import TileGrid from "../components/TileGrid";
import RouteData from "../components/RouteData";

const BusRoutes = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => { // toggles sidebar
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Filter the routes with type "Bus" and create tiles for each of them
    const busRoutes = RouteData.filter(route => route.type === "Bus");
    const tiles = busRoutes.map(route => ({
        title: route.name,
    }));

    return (
        <div className="Display">

            <Navbar onSidebarToggle={handleSidebarToggle} />
            <div className={`Content ${isSidebarOpen ? 'shifted' : ''}`} style={{backgroundColor: 'rgba(247,201,110, 0.5)'}}>
                {isSidebarOpen && <Sidebar onClose={handleSidebarToggle} />}
                <TileGrid tiles={tiles} />
            </div>

        </div>
    );
}

export default BusRoutes;
