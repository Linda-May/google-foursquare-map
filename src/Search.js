import React, { Component } from 'react';

class Search extends Component {

  // Constructor and state 
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      map: {},
      infowindow: {},
      venues: [],
      currentVenues: []
    }

    // Binding functions
    this.openSearch = this.openSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
    this.searchResults = this.searchResults.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
  }

  // Updating states and mounting
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        map: this.props.map,
        venues: this.props.venues,
        infowindow: this.props.infowindow,
        currentVenues: this.props.venues
      });
    }, 800);
  }

  // Opening the search menu
  openSearch() {
    const filter = document.querySelector('.search');
    filter.classList.add('search_open');
    this.props.infowindow.close();
  }

  // Closing the search menu
  closeSearch() {
    const filter = document.querySelector('.search');
    filter.classList.remove('search_open');
    this.setState({
      search: '',
      venues: this.state.currentVenues
    });
    this.state.currentVenues.forEach((venue) => venue.setVisible(true));
  }

  // Searching and receiving results
  searchResults(event) {
    const results = [];
    const venues = this.state.currentVenues;
    const search = event.target.value.toLowerCase();

    this.setState({
      search: search
    });

    if (search) {
      this.props.infowindow.close();
      venues.forEach((venue) => {
        if (venue.title.toLowerCase().indexOf(search) !== -1) {
          venue.setVisible(true);
          results.push(venue);
        } else {
          venue.setVisible(false);
        }
      });
      results.sort(this.sortName);
      this.setState({
        venues: results
      });
    } else {
      this.setState({
        venues: this.state.currentVenues
      });
      venues.forEach((venue) => venue.setVisible(true));
    }
  }

  // Opening window with short info about the place
  openInfoWindow = (event) => {
    console.log(event);
    this.state.venues.forEach((venue) => {
      if (event.name === venue.name) {
          this.state.infowindow.setContent(
            '<div class="window-wrap">'+
            '<h2 class="name">'+event.name+'</h2><br>'+
            '<p class="position">Latitude: '+event.lat+'</p><br>'+
            '<p class="position">Longitude: '+event.lng+'</p><br>'+
            '<p class="address">Address: '+event.address+'</p><br>'+
            '</div>'
        );    
        this.state.infowindow.open(this.props.map, event);


        if (event.getAnimation() !== null) {
          event.setAnimation(null);
        } else {
          event.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(() => {
            event.setAnimation(null);
          }, 1000);
        }

      }
    });
  }

  // Rendering the search results
  render() {
    const { search, venues } = this.state;
    const { openSearch, closeSearch, searchResults, openInfoWindow } = this;
    return (
      <nav className='wrap'>
        <div onClick={ openSearch } onKeyPress={ openSearch } title='Open search' tabIndex="0" className='button open_button' role='button'>
        Search
        </div>
        <h3 className='title'> Good Places Map </h3>
        <div id='filter' className='search'>
          <div className='search-block'>
            <div onClick={ closeSearch } onKeyPress={ closeSearch } title='Close search' tabIndex="0" className='button close_button' role='button'>
            Close
            </div>
          </div>
          <input onChange={ searchResults } placeholder='Search by name' tabIndex="0" className='input' type='text' role='form' aria-labelledby='filter' value={ search }/>
          <ul className='list'>
            {Object.keys(venues).map(i => (
              <li className='item' key={ i }>
                <p onClick={ () => openInfoWindow(venues[i]) } onKeyPress={ () => openInfoWindow(venues[i]) } onBlur={this.handleBlur} tabIndex="0" className='item-action' role='button'>
                { venues[i].name }
                </p>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}
export default Search;