import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

class App extends Component {
  constructor() {
    super();
    this.state = {
      cityData: ""
    };
  }

  getCity = position => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${
          position.coords.longitude
        }&key=AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0`
      )
      .then(response => {
        this.setState({ cityData: response.data });
      }).catch = err => {
      console.log(err);
    };
  };

  locateMe = () => {
    navigator.geolocation.getCurrentPosition(this.getCity);
  };

  render() {
    let today = new Date();
    let month = today.toLocaleString("en-us", { month: "long" });
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    console.log(this.state.cityData);
    return (
      <div className="App">
        <button onClick={this.locateMe}>Locate Me</button>
        {this.state.cityData ? (
          <div>{this.state.cityData.results[4].formatted_address}</div>
        ) : (
          <div>Houston, TX</div>
        )}
        <div>
          {days[today.getDay()]} {month} {today.getDate()}, {today.getFullYear()}
        </div>
      </div>
    );
  }
}

export default App;

// AIzaSyDNqPVVL6FhkDqru_Ve70lZkkH-JqX5tvA
// AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0
// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0
