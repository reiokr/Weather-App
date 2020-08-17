const request = require("postman-request");
require("dotenv").config();

// get weather function
const getWeather = (lat, lon, callback) => {
  const url = "http://api.weatherstack.com/forecast";
  // fetch current weather
  request(
    {
      url: `${url}?access_key=${process.env.KEY}&query=${lon},${lat}&units=m`,
      json: true,
    },
    (error, response) => {
      const { error: err, current } = response.body;
      if (error) {
        callback("Unable to connect to weather service!");
      } else if (err) {
        callback("Unable to find location!");
      } else {
        const {
          weather_descriptions,
          temperature,
          feelslike,
          precip,
          uv_index,
          cloudcover,
          humidity,
          weather_icons,
          wind_speed,
          wind_dir,
        } = current;
        callback(
          null,
          {
            description: weather_descriptions[0],
            icon: weather_icons[0],
            temperature,
            feelslike,
            precip,
            uv_index,
            cloudcover,
            humidity,
            wind_speed,
            wind_dir,
          }
        );
      }
    }
  );
};

module.exports = getWeather;
