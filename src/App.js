import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

class App extends Component {
  constructor() {
    super();
    this.state = {
      cityData: "",
      weatherData: "",
      threeDay: true
    };
  }

  componentDidMount() {
    axios
      .all([
        axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=29.7604,-95.3698&key=AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0`
        ),
        axios.get(
          `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/1ea2d54ed66f54e9be6e30f638711be9/29.7604,-95.3698`
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
          `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/1ea2d54ed66f54e9be6e30f638711be9/${latitude},${longitude}`
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

  getIcon = descriptor => {
    switch (descriptor) {
      case "partly-cloudy-night":
        return "PARTLY_CLOUDY_NIGHT";
    }
  };
  to_getDay = time => {
    console.log("time is: ", time);
    let unixDate;
    let short_days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    // This below is wrong, shouldn't be passing unix time into Date.
    unixDate = new Date(time);
    console.log("unixDate is: ", unixDate);
    return short_days[unixDate.getDay()];
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
          <div>
            <ReactAnimatedWeather
              icon={this.getIcon(this.state.weatherData.currently.icon)}
              color={defaults.color}
              size={200}
              animate={defaults.animate}
            />
            <div>{this.state.weatherData.currently.temperature.toFixed(0)}°</div>
            <div>{this.state.weatherData.currently.summary}</div>
          </div>
        ) : (
          <div>
            <ReactAnimatedWeather
              icon="RAIN"
              color={defaults.color}
              size={200}
              animate={defaults.animate}
            />
            <div>59°</div>
          </div>
        )}
        <div className="bottom">
          <div className="buttons">
            <button>3 Day</button>
            <span> | </span>
            <button>5 Day</button>
          </div>
          <div className="forecast">
            {this.state.weatherData ? (
              <div>
                {this.state.threeDay ? (
                  <div className="threeday">
                    <div>{this.to_getDay(this.state.weatherData.daily.data[0].time)}</div>
                    <div>{this.to_getDay(this.state.weatherData.daily.data[1].time)}</div>
                    <div>{this.to_getDay(this.state.weatherData.daily.data[2].time)}</div>
                  </div>
                ) : (
                  <div className="five-day">Five Day Forecast</div>
                )}{" "}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

// AIzaSyDNqPVVL6FhkDqru_Ve70lZkkH-JqX5tvA
// AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0
// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDEPcm9glqHYP2SkAubicuE9A4pPlsZjI0
