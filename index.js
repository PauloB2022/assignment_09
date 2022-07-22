const apiKey = "9066e9d0bae33df580e2d1dc52d963dd";
const searchForm = document.querySelector("#weather-app form");
const weatherEl = document.getElementById("weather");

const getLatLon = async (query) => {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${apiKey}`
  );
  const body = await response.json();
  const latitude = body[0].lat;
  const longitude = body[0].lon;
  return {
    latitude: latitude,
    longitude: longitude
  };
};

const getWeatherData = async (latitude, longitude) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
  );
  const body = await response.json();
  return body;
};

const displayWeatherNotFound = () => {
  weatherEl.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.innerText = "Location not found";
  weatherEl.appendChild(h2);
};

const displayWeather = ({
  name,
  sys: { country },
  coord: { lat, lon },
  weather: [{ icon, description }],
  main: { feels_like, temp },
  dt
}) => {
  weatherEl.innerHTML = "";

  const locationName = document.createElement("h2");
  locationName.innerText = `${name}, ${country}`;
  weatherEl.appendChild(locationName);

  const viewMapLink = document.createElement("a");
  viewMapLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  viewMapLink.setAttribute("target", "_BLANK");
  viewMapLink.innerText = "Click to view map";
  weatherEl.appendChild(viewMapLink);

  const weatherIcon = document.createElement("img");
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherEl.appendChild(weatherIcon);

  const weatherDescription = document.createElement("p");
  weatherDescription.style.textTransform = "capitalize";
  weatherDescription.innerText = description;
  weatherEl.appendChild(weatherDescription);

  weatherEl.appendChild(document.createElement("br"));

  const weatherCurrent = document.createElement("p");
  weatherCurrent.innerText = `Current: ${temp}º F`;
  weatherEl.appendChild(weatherCurrent);

  const weatherFeelsLike = document.createElement("p");
  weatherFeelsLike.innerText = `Feels like: ${feels_like}º F`;
  weatherEl.appendChild(weatherFeelsLike);

  weatherEl.appendChild(document.createElement("br"));

  const weatherLastUpdated = document.createElement("p");
  weatherLastUpdated.innerText = `Last updated: ${new Date(
    dt * 1000
  ).toLocaleTimeString("en-US", {
    timeStyle: "short"
  })}`;
  weatherEl.appendChild(weatherLastUpdated);
};

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    let coords;
    try {
      coords = await getLatLon(searchForm.search.value);
    } catch (error) {
      coords = {};
    }
    const { latitude, longitude } = coords;
    // const latitude = coords.latitude;
    // const longitude = coords.longitude;
    const weatherInfo = await getWeatherData(latitude, longitude);
    console.log(weatherInfo);
    displayWeather(weatherInfo);
  } catch (error) {
    console.log(error);
    displayWeatherNotFound();
  }

  searchForm.search.value = "";
});
