const path = require("path");
const express = require("express");
const hbs = require("hbs");
const getLocation = require("./utils/getLocation");
const getWeather = require("./utils/getWeather");

const app = express();

// Define paths hor Express config
const publicDir = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars(hbs)-(this is Express ) engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDir));
const author = "R Kr";

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: author,
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About this App",
    name: author,
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided",
    });
  }
  getLocation(req.query.address, (error, { lat, lon, location } = {}) => {
    if (error)
      return res.send({error});

    getWeather(lat, lon, (error, weatherData) => {
      if (error)
        return res.send({ error });
      res.send({ location, weatherData, address: req.query.address});
    });
    
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    helpText: "Some helpful text",
    name: author,
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Error 404",
    name: author,
    errMsg: "Help article not found...",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "Error 404",
    name: author,
    errMsg: "We cant find this page...",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at localhost:${PORT}`);
});

module.exports = app;
