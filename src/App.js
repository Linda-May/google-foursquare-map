import React, { Component } from 'react';
import './App.css';
import Search from './Search';

let createMap = {};

// New array with favourite locations
const locations = [
 {
  name: 'Coffee Room',
  location: {
    lat: 59.9653723,
    lng: 30.3127224,
    address: 'Lva Tolstogo Str 1'
  },
  venueId: '500d888ae4b0647ba615b612'
 },
 {
  name: 'Jean-Jacques',
  location: {
    lat: 59.9605738,
    lng: 30.3026711,
    address: 'Gatchinskaya Str, 2/54'
  },
  venueId: '4baf5daaf964a5208dfa3be3'
 },
 {
  name: 'Mozarella Bar',
  location: {
    lat: 59.9552484,
    lng: 30.2955789,
    address: 'Bolshoy Prospekt, 13/4'
  },
  venueId: '4bb9fe4bcf2fc9b6cffba002'
 },
  {
  name: 'Yasli',
  location: {
    lat: 59.956109,
    lng: 30.3071579,
    address: 'Markina Str, 1'
  },
  venueId: '548215f7498e432bb993b784'
 },
   {
  name: 'Manneken Pis',
  location: {
    lat: 59.958953,
    lng: 30.317816,
    address: 'Kamennoostrovsky avenue, 12'
  },
  venueId: '557314c9498e82a42318049b'
 },
    {
  name: 'Koryushka',
  location: {
    lat: 59.9480567,
    lng: 30.3116536,
    address: 'Peter and Paul Fortress, 3'
  },
  venueId: '518117bf90e7ce79962d9496'
 },   
 {
  name: 'More Coffee',
  location: {
    lat: 59.9545527,
    lng: 30.3204663,
    address: 'Aleksandrovskiy Park, 3G'
  },
  venueId: '4fd46098e4b0ba0232874a55'
 }
]  

class App extends Component {
  // Constructor and initial states
  constructor(props) {
    super(props);
    this.state = {
      map: {},
      venues: [],
      infowindow: {}
    }
    // Binding venueData function
    this.venueData = this.venueData.bind(this);
  }

  // Loading the Google Map with the API Key
  loadMap = () => {
    googleMap("https://maps.googleapis.com/maps/api/js?key=AIzaSyAVhr2i8ORiLZ8NSaIq6OtYnnE5eghEtlo&callback=initMap")
    window.initMap = this.initMap
  }

  // Mounting the loadMap
  componentDidMount() {
    this.loadMap()
  }

  // Creating a map
  initMap = () => {
    createMap = new window.google.maps.Map(document.getElementById('map'), {
        center: { lat: 59.9566134, lng: 30.318653 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: true,
        fullscreenControl: false
    });
    
    // Map variables
    const bounds = new window.google.maps.LatLngBounds(); 
    let createMarkers = [];
    const moreInfo = new window.google.maps.InfoWindow({maxWidth: 320});

    // Adding keypress click  
    const clicking = 'click keypress'.split(' ');

    // Variables with data about locations
    for (let i = 0; i < locations.length; i++) {
      let position = {lat: locations[i].location.lat, lng: locations[i].location.lng};
      let name = locations[i].name;
      let lat = locations[i].location.lat;
      let lng = locations[i].location.lng;
      let address = locations[i].location.address;

      // Creating markers and adding animation
      let marker = new window.google.maps.Marker({
        animation: window.google.maps.Animation.DROP,
        map: createMap,
        id: i,
        name: name,
        position: position,
        lat: lat,
        lng: lng,
        address: address,  
        title: name
      });
      createMarkers.push(marker);

      // Adding event listeners to markers and animation    
      for (let i = 0; i < clicking.length; i++) {
        marker.addListener(clicking[i], function() {
          addInfoWindow(this, moreInfo);
          this.setAnimation(window.google.maps.Animation.BOUNCE);
        });
      }
      bounds.extend(createMarkers[i].position);
    }
    
    // Fitting map to bounds   
    createMap.fitBounds(bounds);

    // Updating states with received data  
    this.setState({
      map: createMap,
      venues: createMarkers,
      infowindow: moreInfo
    });
  }

  // Getting Foursquare information about venues
  venueData() {
    let places = [];
    const clientId = "U0GGE1TLAFLYFPMXYBEZ4YLJA3LE5OYFPQPQDPXF2TY1FG5K";
    const clientSecret = "SYBO1ANVUPEIOASYYCTVR302QCPXO05YHBRUBCYBSWQIZ1YP"; 
    const version = "20180821"; 
    const startUrl = "https://api.foursquare.com/v2/venues/";

    // Creating request with fetch
    locations.map((location) =>
      fetch(startUrl + `${location.venueId}?client_id=` + clientId + `&client_secret=` + clientSecret + `&v=` + version)
        .then(response => response.json())
        .then(data => {
          if (data.meta.code === 200) {
            places.push(data.response.venue);
          }
        }).catch(error => {
          console.log(error);
        })
    );

    // Updating venues state
    this.setState({
      venues: places
    });
  }
  
  // Rendering the App
  render() {
    return (
      <main>
        <Search role='main' map={ this.state.map } venues={ this.state.venues } infowindow={ this.state.infowindow }/>
        <div id="map" role='application' tabIndex='-1'></div>
      </main>
    );
  }
}

// Creating google Map script
const googleMap = (url) => {
  const ref = window.document.getElementsByTagName("script")[0]
  const script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  ref.parentNode.insertBefore(script, ref)
}

// Adding info window
const addInfoWindow = (marker, infowindow) => {
  infowindow.setContent(
    '<div class="window-wrap">'+
    '<h2 class="name">'+marker.name+'</h2><br>'+
    '<p class="address">Latitude: '+marker.lat+'</p><br>'+
    '<p class"address">Longitude: '+marker.lng+'</p><br>'+
    '<p class="address">Address: '+marker.address+'</p><br>'+
    '</div>'
  );
  infowindow.open(createMap, marker);
}

export default App;