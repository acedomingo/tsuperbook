import React from 'react'
import "../App.css";
import {SidebarData} from './SidebarData';

const Sidebar = ({ onClose }) => {
    const handleClose = () => {
      onClose();
    }
    return (
        <div className="Sidebar">
            <div style={{ height: 46 }} />
            <ul className="SidebarList">
            {SidebarData.map((val,key)=> {
                return (
                <li key={key} 
                    className="Row"
                    id={window.location.pathname == val.link ? "active" : ""}
                    onClick={()=> {
                        window.location.pathname = val.link
                    }}
                > 
                    <div id="icon">
                        {val.icon}
                    </div>
                    <div id="title">
                        {val.title}
                    </div>
                </li>
                )
            })}
            </ul>
        </div>
        
    )
}

export default Sidebar