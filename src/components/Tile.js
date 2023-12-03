import React from 'react';
import { useNavigate } from 'react-router-dom';

const Tile = ({ title, content }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/?selectRoute=${title}`);
    console.log("Clicked:", title);
  };

  return (
    <div className="Tile" onClick={handleClick}>
        <h2>{title}</h2>
        <p>{content}</p>
    </div>
  );
};

export default Tile;
