const request = require("postman-request");
require("dotenv").config();

const getLocation = (locationName, callback) => {
  const mapurl = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  // location search text (loc) is provaided in terminal using yargs command
  const url = `${mapurl}${encodeURIComponent(locationName)}.json?access_token=${process.env.TOKEN}&limit=1`;
  // Fetch geolocation info
  request(
    {
      url,
      json: true,
    },
    (error, response) => {
      if (error) {
        callback("Unable to connect services!", undefined);
      } else if (response.body.features.length < 1) {
        callback("Unable to find location.", undefined);
      } else {
        const { center, place_name } = response.body.features[0]; // destruct response.body.features
        const [lat, lon] = center; // destruct latitude and longitude
        callback(null, {
          lat,
          lon,
          location: place_name,
        });
      }
    }
  );
};

module.exports = getLocation;
