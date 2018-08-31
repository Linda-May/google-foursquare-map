import React, { Component } from 'react';
import './App.css';
import scriptLoader from 'react-async-script-loader';
import Search from './Search';
import { locations } from './locations';

let createMap = {};

class App extends Component {
  // Constructor and initial states
  constructor(props) {
    super(props);
    this.state = {
      map: {},
      infowindow: {},
      venues: []
    }
    // Binding venueData function
    this.venueData = this.venueData.bind(this);
  }  

  // Initialization of the map when the script loads
  componentWillReceiveProps({isScriptLoadSucceed}) {
    if (isScriptLoadSucceed) {

  // Calling the Foursquare function    
    this.venueData();

    // Creating a new Map
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
    let myLocations = [];
    const moreInfo = new window.google.maps.InfoWindow({maxWidth: 320});
    // Adding keypress click  
    const clicking = 'click keypress'.split(' ');

    // If the Foursquare data aren't received, we take the data from locations file
    setTimeout(() => {
    if (this.state.venues.length === 12) {
      myLocations = this.state.venues;
      console.log(myLocations);
    } else {
      myLocations = locations;
      console.log(myLocations);
    }

    // Variables with data about locations
    for (let i = 0; i < myLocations.length; i++) {
      let position = {lat: myLocations[i].location.lat, lng: myLocations[i].location.lng};
      let name = myLocations[i].name;
      let lat = myLocations[i].location.lat;
      let lng = myLocations[i].location.lng;
      let address = myLocations[i].location.address;
      let rating = myLocations[i].rating;
      let vlink = myLocations[i].canonicalUrl;

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
        title: name,
        rating: rating,
        vlink: vlink
      });
      createMarkers.push(marker);

      // Adding event listeners to markers and animation    
      for (let i = 0; i < clicking.length; i++) {
        marker.addListener(clicking[i], function() {
          addInfoWindow(this, moreInfo);
          this.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function () {
             marker.setAnimation(null);
          }, 800);
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
  }, 800);
   } else {
      alert('There is some Google Maps error');
    }
  }

  // Getting Foursquare information about venues
  venueData () {
    let places = [];
    const clientId = "U0GGE1TLAFLYFPMXYBEZ4YLJA3LE5OYFPQPQDPXF2TY1FG5K";
    const clientSecret = "SYBO1ANVUPEIOASYYCTVR302QCPXO05YHBRUBCYBSWQIZ1YP"; 
    const version = "20180821"; 
    const startUrl = "https://api.foursquare.com/v2/venues/";

    // Creating request with fetch
    locations.map((location) =>
      fetch(startUrl + `${location.venueId}?&client_id=` + clientId + `&client_secret=` + clientSecret + `&v=` + version)
        .then(response => response.json())
        .then(data => {
          if (data.meta.code === 200) {
             places.push(data.response.venue); 
          }
        }).catch(error => {
          console.log(error);
          alert('Sorry, there is an error with Foursquare API');
        })
   );

    // Updating venues state
    this.setState({
      venues: places
    });
    console.log(this.state.venues);
  }

  // Alert if there is an authorization failure
  gm_authFailure = () => { 
        alert("Sorry, there is problem with an authorization at Google Maps"); //
    }

  // Rendering the App
  render() {
    return (
      <main>
        <Search role='main' map={ this.state.map } venues={ this.state.venues } infowindow={ this.state.infowindow }/>
        <div id="map" role='application'></div>
      </main>
    );
  }
}

// Adding info window
const addInfoWindow = (marker, infowindow) => {
  infowindow = new window.google.maps.InfoWindow();
  infowindow.setContent(
    '<div class="window-wrap">'+
    '<h2 class="name">'+marker.name+'</h2><br>'+
    '<p class="address">Latitude: '+marker.lat+'</p><br>'+
    '<p class"address">Longitude: '+marker.lng+'</p><br>'+
    '<p class="address">Address: '+marker.address+'</p><br>'+
      '<p class="info-rating">Rating: '+marker.rating+'</p><br>'+
      '<a class="link" href='+marker.vlink+' target="_blank"><span>For more information<span></a><br>'+
    '</div>'
  );
  infowindow.open(createMap, marker);
}

// Google Maps script 
export default scriptLoader(
 [`https://maps.googleapis.com/maps/api/js?key=AIzaSyAVhr2i8ORiLZ8NSaIq6OtYnnE5eghEtlo`]
)(App);