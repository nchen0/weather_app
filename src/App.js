import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

class App extends Component {
  constructor() {
    super();
    this.state = {
      cityData: "",
      weatherData: ""
    };
  }

  getCity = position => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    axios
      .all([
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0`
        ),
        axios.get(
          `https://api.darksky.net/forecast/1ea2d54ed66f54e9be6e30f638711be9/${latitude},${longitude}`
        )
      ])
      .then(
        axios.spread((cityResponse, weatherResponse) => {
          console.log("weatherResponse is: ", weatherResponse);
          this.setState({ cityData: cityResponse.data, weatherData: weatherResponse.data });
        })
      )
      .catch(err => {
        console.log(err.message);
      });
  };

  locateMe = () => {
    navigator.geolocation.getCurrentPosition(this.getCity);
  };

  render() {
    const defaults = {
      icon: "CLEAR_DAY",
      color: "goldenrod",
      size: 512,
      animate: true
    };
    let today = new Date();
    let month = today.toLocaleString("en-us", { month: "long" });
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    console.log("this.state.cityData");
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
        {this.state.weatherData ? (
          <div>{this.state.weatherData.currently.temperature.toFixed(0)}</div>
        ) : (
          <div>59</div>
        )}
        <ReactAnimatedWeather
          icon={defaults.icon}
          color={defaults.color}
          size={100}
          animate={defaults.animate}
        />
      </div>
    );
  }
}

export default App;

// AIzaSyDNqPVVL6FhkDqru_Ve70lZkkH-JqX5tvA
// AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0
// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0

// To fix:
// Set componentDidMount and do the axios spread and use Berkeley's lat & longitude's hardcoded in, until locate me is clicked.
// Fix cors without using browser extension trick.
