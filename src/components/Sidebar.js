import React from 'react';
import "../App.css";
import { SidebarData } from './SidebarData';

const Sidebar = ({ onClose }) => {
    const handleClose = () => {
        onClose();
    };

    return (
        <div className="Sidebar">
            <div style={{ height: 46 }} />
            <ul className="SidebarList">
                {SidebarData.map((val, key) => {
                    return (
                        <li key={key}
                            className="Row"
                            id={window.location.pathname === val.link ? "active" : ""}
                            onClick={() => {
                                if (val.externalLink === true) {
                                    // Open external link in a new window
                                    window.open(val.link, '_blank');
                                } else {
                                    // Use window.location.href to set the whole URL
                                    window.location.href = val.link;
                                }
                            }}
                        >
                            <div id="icon">
                                {val.icon}
                            </div>
                            <div id="title">
                                {val.title}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Sidebar;
