// const url = "http://localhost:3333/weather";
const url = "/weather";
const weatherForm = document.querySelector("form");
const weatherContent = document.querySelector(".content");
const locationInput = document.querySelector("#weather");
const loader = document.createElement('h2')
loader.textContent ="Loading...";
loader.className =('loader')
const defaultLocation = "London";
// weather location is provided from local storage or default location
let weatherLocation =
  localStorage.getItem("weatherLocation") || defaultLocation;

// get weather information from server
async function getData(loc) {
  try {
    const response = await fetch(`${url}?address=${loc}`);
    let data = await response.json();
    if (data.error) {
      showMsg(data.error, "red", 3000);
      // if data error then set location in local storage equal to weatherLocation value to prevent storing not foud location
      localStorage.setItem("weatherLocation", weatherLocation);
      loader.remove()
      return;
    }
    // if no errors call showWeather function
    showWeather(data);
    // set weatherlocation value equal to value in local storage to prevent replacing local storage value with old searched location value
    return (weatherLocation = localStorage.getItem("weatherLocation"));
  } catch (error) {
    console.log(error);
  }
}

// fill the browser with weather information
getData(weatherLocation);

// get submitted location from user and show in browser
weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = locationInput.value;

  weatherContent.appendChild(loader)
  // fetch weather data using user provided location
  getData(input);

  // save locationInput in local storage
  localStorage.setItem("weatherLocation", input);
  // clear input field
  locationInput.value = "";
});

// weather information in browser
function showWeather(data) {
  // destruct weather data
  const {
    cloudcover,
    description,
    feelslike,
    humidity,
    precip,
    temperature,
    uv_index,
    icon,
    wind_speed,
    wind_dir,
  } = data.weatherData;

  loader.remove();
  // create output html with dynamic weater data
  weatherContent.innerHTML = `
    <img src=${icon} alt=""/>
    <h2>${data.location}</h2>
    <h3>${description}</h3>
    <h3>Temperature: ${temperature}&#176; C</h3>
    <h3>Feels like: ${feelslike}&#176; C</h3>
    <h3>Clouds ${cloudcover} %</h3>
    <h3>Rain possibility: ${precip} %</h3>
    <h3>Wind Speed: ${((wind_speed / 3600) * 1000).toFixed(1)} m/s</h3>
    <h3>Wind Direction: ${wind_dir}</h3>
    <h3>Humidity: ${humidity} %</h3>
    <h3>Uv index: ${uv_index}</h3>
    `;
}

// show message function
function showMsg(str, color, time) {
  const msg = document.createElement("p");

  msg.textContent = str;
  msg.style.color = color;
  msg.classList.add("msg");
  weatherForm.appendChild(msg);

  // set timeout for message
  setTimeout(() => {
    msg.remove();
  }, time);
}
