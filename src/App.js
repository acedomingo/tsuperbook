// packages
import React from 'react';
import Home from "./pages/Home";
import PathFinding from "./pages/Pathfinding";
import BusRoutes from "./pages/BusRoutes";
import JeepneyRoutes from "./pages/JeepneyRoutes";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pathfinding" element={<PathFinding />} />
        <Route path="/busroutes" element={<BusRoutes/>} />
        <Route path="/jeepneyroutes" element={<JeepneyRoutes/>} />
      </Routes>
    </Router>
  );
}

export default App
