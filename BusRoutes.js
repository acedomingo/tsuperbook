import React, { useState } from 'react';
import '../App.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const BusRoutes = () => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = () => { // toggles sidebar
        setIsSidebarOpen(!isSidebarOpen);
      };

    return(
       <>
        <div className="Display">

            <div className="App">
                <Navbar onSidebarToggle={handleSidebarToggle} />
                {isSidebarOpen && <Sidebar onClose={handleSidebarToggle}/>}
            </div>

</div>
       </>
    )
}

export default BusRoutes