// Tile.js
import React from 'react';

const Tile = ({ title, content }) => {
    return (
        <div className="Tile">
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}

export default Tile;