import React from 'react'
import "../App.css";
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ onSidebarToggle, handleSidebarToggle }) => {
    return (
      <nav className ="Navbar">
        <ul>
            <li>
                <button className="MenuButton" onClick={onSidebarToggle} onClose={handleSidebarToggle}><MenuIcon></MenuIcon></button>
            </li>
            <li className="NavbarTitle">Tsuperbook</li>
        </ul>        
    </nav>
    );
  };

export default Navbar