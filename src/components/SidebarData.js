import React from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import HelpIcon from '@mui/icons-material/Help';

export const SidebarData = [
    {
        title: "Froutey",
        icon: <MenuIcon />,
        link: "/home",
    },
    {
        title: "Bus Routes",
        icon: <DirectionsBusIcon />,
        link: "/busroutes",
    },
    {
        title: "Jeepney Routes",
        icon: <AirportShuttleIcon />,
        link: "/jeepneyroutes",
    },
    {
        title: "Landmarks",
        icon: <EmojiTransportationIcon />,
        link: "/landmarks",
    },
    {
        title: "Give Feedback",
        icon: <HelpIcon />,
        link: "/helpstack",
    },
]