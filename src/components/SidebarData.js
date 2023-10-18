import React from 'react'
import MapIcon from '@mui/icons-material/Map';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import HelpIcon from '@mui/icons-material/Help';
import RouteIcon from '@mui/icons-material/Route';

export const SidebarData = [
    {
        title: "Home",
        icon: <MapIcon />,
        link: "/",
    },
    {
        title: "Path Finding",
        icon: <RouteIcon />,
        link: "/pathfinding",
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
        title: "Feedback Form",
        icon: <HelpIcon />,
        link: "https://forms.gle/hsQ11bMd9VJ2NNX96",
    }
]