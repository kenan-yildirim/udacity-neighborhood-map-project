import React, {
	Component
} from 'react';
import Map from './components/myMap';
import LocationList from './components/locations'
import './App.css';

/*The resource for search was changed from Wikipedia to Foursquare. It turned out that this resource
contains a detailed guide with examples of code, it is very convenient for novice developers, 
if you need to provide the user with information about the object.*/
const Foursquare_clientID = 'OPUEFNWGSIU2UJ0HI50SNFMSAQPMGP31PMB2PIALQCFFJ1M0';
const Foursquare_clientSecret = '5Q1UEJIZTIEOVLVACM0QA4ALEI5IROWHQ2QVQHADYNAQPR24';
const Foursquare_venueUrl = 'https://api.foursquare.com/v2/venues/';


/* Map style and location files have been moved here from individual files.
Helpful links: 
https://stackoverflow.com/questions/34991638/google-map-react-custom-skins
https://stackoverflow.com/questions/51420031/how-to-add-snazzy-maps-javascript-style-array-in-react
*/
const center = {
	lat: 55.751244,
	lng: 37.618423
};
const zoom = 15;

// Map style resource: https://snazzymaps.com/style/42/apple-maps-esque
const mapStyle = [{
		"featureType": "landscape.man_made",
		"elementType": "geometry",
		"stylers": [{
			"color": "#f7f1df"
		}]
	},
	{
		"featureType": "landscape.natural",
		"elementType": "geometry",
		"stylers": [{
			"color": "#d0e3b4"
		}]
	},
	{
		"featureType": "landscape.natural.terrain",
		"elementType": "geometry",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "poi",
		"elementType": "labels",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "poi.business",
		"elementType": "all",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "poi.medical",
		"elementType": "geometry",
		"stylers": [{
			"color": "#fbd3da"
		}]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [{
			"color": "#bde6ab"
		}]
	},
	{
		"featureType": "road",
		"elementType": "geometry.stroke",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "road",
		"elementType": "labels",
		"stylers": [{
			"visibility": "off"
		}]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "#ffe15f"
		}]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [{
			"color": "#efd151"
		}]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "#ffffff"
		}]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "black"
		}]
	},
	{
		"featureType": "transit.station.airport",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "#cfb2db"
		}]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [{
			"color": "#a2daf2"
		}]
	}
];

// Coordinates and names of locations. 
//The descriptions of the objects were removed, instead of them were added id to Foursquare
const sightLocations = [{
		title: 'Red Square',
		location: {
			lat: 55.753930,
			lng: 37.620795
		},
		id: '4bb3345942959c74d79d212c',
	}, {
		title: 'Sparrow Hills',
		location: {
			lat: 55.706164,
			lng: 37.536617
		},
		id: '4da955c81e72c1ab9bd8e322'
	}, {
		title: 'Arbat Street',
		location: {
			lat: 55.748944,
			lng: 37.589673
		},
		id: '4bc09d91461576b055617a32'
	}, {
		title: 'Luzhniki Stadium',
		location: {
			lat: 55.715762,
			lng: 37.553716
		},
		id: '4bb733c646d4a593732cc7c0'
	}, {
		title: 'Moscow Circus on Tsvetnoy Boulevard',
		location: {
			lat: 55.770636,
			lng: 37.619666
		},
		id: '4c10fa5cce57c92894ac82d2'
	}, {
		title: 'Moscow International Business Center',
		location: {
			lat: 55.747100,
			lng: 37.536697
		},
		id: '4c889aef0f3c236a3a1ff45c'
	}, {
		title: 'Tretyakov Gallery',
		location: {
			lat: 55.741389,
			lng: 37.620864
		},
		id: '4beee1dcd355a593e87e0b60'
	}, {
		title: 'Memorial Museum of Cosmonautics',
		location: {
			lat: 55.822993,
			lng: 37.639837
		},
		id: '4d849dc337ddba7acdb9afe4'
	},


];

class App extends Component {

	constructor(props) {
		super(props);
		this.initMap = this.initMap.bind(this);
		this.showingLocations = this.showingLocations.bind(this);
		this.clearMarkers = this.clearMarkers.bind(this);
		this.locationFiltered = this.locationFiltered.bind(this);
	}

	state = {
		map: null,
		currentOne: [],
		sightData: {}
	}

	//The definition, selection and display of locations was created in accordance with 
	//Foursquare Developer Guide 
	getsightData() {
		let sightData = {};
		let venueURL = ''

		sightLocations.map((pin) => {
			venueURL = `${Foursquare_venueUrl}${pin.id}?client_id=${Foursquare_clientID}&client_secret=${Foursquare_clientSecret}&v=20180523`;
			fetch(venueURL)
				.then((response) => {
					if (response.ok) {
						return response.json();
					}
					throw new Error('Network response error');
				}).then((jsonData) => {

					sightData[pin.id] = jsonData.response.venue;
					return jsonData;
				}).catch((error) => {
					alert.error(error);
				})
			return true;
		});
		this.setState({
			sightData: sightData
		});
	}

	componentWillMount() {
		window.initMap = this.initMap;
		this.setState({
			currentOne: sightLocations
		});
		this.getsightData();
	}

	initMap() {
		let map = new window.google.maps.Map(document.querySelector('#map'), {
			center: center,
			zoom: zoom,
			mapTypeControl: false,
			styles: mapStyle
		});

		map = this.setPins(map, sightLocations);
		this.setState({
			map: map
		});
	}

	/*I was not sure if the name of the variable "pin" was suitable. I met this in discussions,
	for example, here: // https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
	and after reflection decided that it was suitable for definition and would be clear for understanding
	the meaning*/
	setPins(map, pins) {
		let newPins = [];
		let bounds = new window.google.maps.LatLngBounds();

		//Define and install markers
		pins.forEach((pin) => {
			let marker = new window.google.maps.Marker({
				position: pin.location,
				title: pin.title,
				map: map,
				animation: window.google.maps.Animation.DROP,
				id: pin.id
			});
			marker.addListener('click', () => {
				this.openInfoWindow(pin.id, marker);
			});
			bounds.extend(marker.position);
			newPins.push(marker);
		});
		map.fitBounds(bounds);
		this.setState({
			currentOne: newPins
		});
		return map;
	}

	//Remove markers when they are not needed
	clearMarkers() {
		this.setState({
			currentOne: this.state.currentOne.map((marker) => {
				marker.setMap(null);
				return true;
			})
		});
	}


	openInfoWindow(locationId, marker) {
		let locationInfo = {};
		let infoWindow = new window.google.maps.InfoWindow();
		let infoContent = '';
		if (this.state.sightData[locationId] !== undefined) {

			//n accordance with Foursquare Developer Guide 
			let thisVenue = this.state.sightData[locationId];
			locationInfo.title = thisVenue.name ? thisVenue.name : marker.title;
			locationInfo.website = thisVenue.url ? `<a href=${thisVenue.url} target="_blank">${thisVenue.url}</a>` : 'Not Available';

			// Information that is displayed when the marker is clicked
			//ARIA roles for the HTML tags is defined 
			infoContent = `
        <div tabindex="0">
        <h3 role="heading">${locationInfo.title}</h3>
        <p><a href="https://foursquare.com/v/${marker.id}/" target="_blank">Find More on FourSquare</a></p>
        </div>`
		} else {
			infoContent = 'Error. Unable to find data';
		}
		infoWindow.setContent(infoContent);
		infoWindow.open(this.state.map, marker);
	}

	showingLocations(event) {
		this.clearMarkers();
		let currentOne = sightLocations;
		if (event.target.value !== "") {
			currentOne = sightLocations.filter(function (pin) {
				return (
					pin.title.toLowerCase().search(event.target.value.toLowerCase()) !== -1);
			});
		}


		let map = this.state.map;
		map = this.setPins(map, currentOne);
		this.setState({
			map: map
		});
	}

	//Adding the settings of the selected location (+ animation)
	locationFiltered(locationId) {
		for (let pin of this.state.currentOne) {
			if (pin.id === locationId) {
				pin.setAnimation(window.google.maps.Animation.BOUNCE);
				pin.setAnimation(null);
				this.openInfoWindow(locationId, pin);
			}
		}
	}

	render() {
		return ( <
			div className = "App" >
			<
			Map / >
			<
			LocationList currentOne = {
				this.state.currentOne
			}
			locationFiltered = {
				this.locationFiltered
			}
			showingLocations = {
				this.showingLocations
			}
			/> <
			/div>
		);
	}
}

export default App;
