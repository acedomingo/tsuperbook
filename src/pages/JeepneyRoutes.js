import React, { useState } from 'react';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tile from "../components/Tile";
import TileGrid from "../components/TileGrid";
import RouteData from "../components/RouteData";
import { useNavigate } from 'react-router-dom';

const JeepneyRoutes = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Filter the routes with type "Jeepney" and create tiles for each of them
    const jeepneyRoutes = RouteData.filter(route => route.type === "Jeepney");
    const tiles = jeepneyRoutes.map(route => ({
        title: route.name,
    }));

    return (
        <div className="Display">
           
            <Navbar onSidebarToggle={handleSidebarToggle} />
            <div className={`Content ${isSidebarOpen ? 'shifted' : ''}`}>
                {isSidebarOpen && <Sidebar onClose={handleSidebarToggle} />}
                <TileGrid tiles={tiles} />
            </div>
        
        </div>
    );
}

export default JeepneyRoutes;
