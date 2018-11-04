// Map style file have been moved to app/.js file
// auxiliary resource: https://tomchentw.github.io/react-google-maps/#/basics/styled-map?_k=5el6q8

import React, { Component } from 'react';

// The problem of mapping the card on the user side solved.
// API key changed to new  (my "old" key from 10.06.2018)
const apiKey = 'AIzaSyBkeAepbP2rO6fU9cVtERbHIOVNWbgjRQY';
const mapUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3&callback=initMap`;

class Map extends Component {
  loadError(error) {
    alert("An error occurred");
    console.error(`An error occurred while opening ${mapUrl}`);
  }

// The code is added in accordance with the recommendations in the review
  gm_authFailure() {
    window.alert("Google Maps error!")
  }

// The code is changed in accordance with the recommendations in the review
  componentWillMount() {
      window.gm_authFailure = this.gm_authFailure;
      
//Google Maps query added in accordance with Google Maps Developer Guide 
      const bodyRef = document.querySelector('body');
      let mapRef = document.createElement('script');
      mapRef.src = mapUrl;
      mapRef.onerror = this.loadError;
      mapRef.async = true;
      mapRef.defer = true;
      bodyRef.appendChild(mapRef);
  }

//ARIA roles for the HTML tags is defined 
  render() {
      return ( 
        <div id = "map" role = "application" tabIndex = "-1" > Loading, please wait... </div>
      );
  }
  }
  
  export default Map;