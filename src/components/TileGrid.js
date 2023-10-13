// TileGrid.js
import React from 'react';
import Tile from './Tile'; // Import the Tile component

const TileGrid = ({ tiles }) => {
    return (
        <div className="TileGrid">
            {tiles.map((tile, index) => (
                <Tile key={index} title={tile.title} content={tile.content} />
            ))}
        </div>
    );
}

export default TileGrid;