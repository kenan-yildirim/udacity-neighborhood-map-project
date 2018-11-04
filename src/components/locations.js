// Map style file have been moved to app/.js file
// auxiliary resource: https://tomchentw.github.io/react-google-maps/#/basics/styled-map?_k=5el6q8
import React from 'react';

function LocationList({
    showingLocations,
    currentOne,
    locationFiltered
}) {
//ARIA roles for the HTML tags is defined 
  return (

<div className="listSights">
    <nav className="nav_bar">
        <span id="subject">Sights of Moscow</span></nav>
    <input className="search_box" type="text" placeholder="Start typing the name of the object" onChange={showingLocations}/> {currentOne.map((pin)=> (
    <div className="location" key={pin.id} onClick={()=> (locationFiltered(pin.id))} tabIndex='0' role='link'>
        <p>{pin.title}</p>
    </div>
    ))}
</div>
  );
}

export default LocationList;
