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
      case "partly-cloudy-day":
        return "PARTLY_CLOUDY_DAY";
      case "clear-day":
        return "CLEAR_DAY";
      case "clear-night":
        return "CLEAR_NIGHT";
      case "wind":
        return "WIND";
      case "rain":
        return "RAIN";
      case "cloudy":
        return "CLOUDY";
      case "sleet":
        return "SLEET";
      case "snow":
        return "SNOW";
      case "fog":
        return "FOG";
      default:
        return "";
    }
  };

  to_getDay = time => {
    let unixDate;
    let short_days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    unixDate = new Date(time * 1000);
    return short_days[unixDate.getDay()];
  };
  toggleThreeDay = amount => {
    if (amount === "five") {
      this.setState({ threeDay: false });
    } else {
      this.setState({ threeDay: true });
    }
  };

  render() {
    console.log("this.cityData is: ", this.state.cityData);
    const defaults = {
      icon: "CLEAR_DAY",
      color: "goldenrod",
      size: 512,
      animate: true
    };
    let today = new Date();
    let month = today.toLocaleString("en-us", { month: "long" });
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let daily, currently, cityState;
    if (this.state.weatherData) {
      currently = this.state.weatherData.currently;
      daily = this.state.weatherData.daily.data;
      cityState = this.state.cityData.results[6].formatted_address
        .split(",")
        .splice(0, 2)
        .join(",");
    }

    return (
      <div className="App">
        <i onClick={this.locateMe} className="iframe fas fa-location-arrow" />
        {this.state.cityData ? <div className="city">{cityState}</div> : <div>Houston, TX</div>}
        <div className="date">
          {days[today.getDay()]} {month} {today.getDate()}, {today.getFullYear()}
        </div>

        {this.state.weatherData ? (
          <div>
            <ReactAnimatedWeather
              icon={this.getIcon(currently.icon)}
              color="yellow"
              size={200}
              animate={defaults.animate}
            />
            <div className="main-temp">{currently.temperature.toFixed(0)}°</div>
            <div className="main-summary">{currently.summary}</div>
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
            <button
              type="button"
              className="days-button btn btn-light"
              onClick={() => this.toggleThreeDay("three")}
            >
              3 Day
            </button>
            <span className="vert-line"> | </span>
            <button
              type="button"
              className="days-button btn btn-light"
              onClick={() => this.toggleThreeDay("five")}
            >
              5 Day
            </button>
          </div>
          <div className="forecast">
            {this.state.weatherData ? (
              <div>
                {this.state.threeDay ? (
                  <div className="threedays">
                    <div className="threeday">
                      <div className="bottom-date">{this.to_getDay(daily[1].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[1].icon)}
                        color="yellow"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div className="bottom-summary">{daily[1].summary}</div>
                      <div className="bottom-temp">
                        {daily[1].temperatureMax.toFixed(0)}° | {daily[1].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                    <div className="threeday">
                      <div className="bottom-date">{this.to_getDay(daily[2].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[2].icon)}
                        color="yellow"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[2].summary}</div>
                      <div className="bottom-temp">
                        {daily[2].temperatureMax.toFixed(0)}° | {daily[2].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                    <div className="threeday">
                      <div className="bottom-date">{this.to_getDay(daily[3].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[3].icon)}
                        color="yellow"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[3].summary}</div>
                      <div className="bottom-temp">
                        {daily[3].temperatureMax.toFixed(0)}° | {daily[3].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="fivedays">
                    {" "}
                    <div className="fiveday">
                      {" "}
                      <div className="bottom-date">{this.to_getDay(daily[1].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[1].icon)}
                        color="white"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[1].summary}</div>
                      <div className="bottom-temp">
                        {daily[1].temperatureMax.toFixed(0)}° | {daily[1].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                    <div className="fiveday">
                      <div className="bottom-date">{this.to_getDay(daily[2].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[2].icon)}
                        color="black"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[2].summary}</div>
                      <div className="bottom-temp">
                        {daily[2].temperatureMax.toFixed(0)}° | {daily[2].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                    <div className="fiveday">
                      {" "}
                      <div className="bottom-date">{this.to_getDay(daily[3].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[3].icon)}
                        color="black"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[3].summary}</div>
                      <div className="bottom-temp">
                        {daily[3].temperatureMax.toFixed(0)}° | {daily[3].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                    <div className="fiveday">
                      {" "}
                      <div className="bottom-date">{this.to_getDay(daily[4].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[4].icon)}
                        color="black"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[4].summary}</div>
                      <div className="bottom-temp">
                        {daily[4].temperatureMax.toFixed(0)}° | {daily[4].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                    <div className="fiveday">
                      {" "}
                      <div className="bottom-date">{this.to_getDay(daily[5].time)}</div>
                      <ReactAnimatedWeather
                        icon={this.getIcon(daily[5].icon)}
                        color="black"
                        size={100}
                        animate={defaults.animate}
                      />
                      <div>{daily[5].summary}</div>
                      <div className="bottom-temp">
                        {daily[5].temperatureMax.toFixed(0)}° | {daily[5].temperatureMin.toFixed(0)}
                        °
                      </div>
                    </div>
                  </div>
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
