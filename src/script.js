function currentDate(timestamp) {
  let date = new Date(timestamp);

  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let currentDay = days[date.getDay()];
  let presentDate = date.getDate();
  let currentMonth = months[date.getMonth()];
  let currentYear = date.getFullYear();

  return `${currentDay}, ${currentMonth} ${presentDate}, ${currentYear} | ${currentHour(
    timestamp
  )}`;
}

function currentHour(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hour}:${minutes}`;
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#current-temp");
  let locationElement = document.querySelector("#location");
  let cityElement = response.data.name;
  let countryElement = response.data.sys.country;
  let feelTempElement = document.querySelector("#current-feel-temp");
  let humidity = Math.round(response.data.main.humidity);
  let humidityElement = document.querySelector("#humidity");
  let windSpeed = Math.round(response.data.wind.speed);
  let windElement = document.querySelector("#wind-speed");
  let descriptionElement = document.querySelector("#weather-description");
  let dateElement = document.querySelector("#date");
  let weatherIconElement = document.querySelector("#weather-icon");

  celsiusTemperature = response.data.main.temp;
  feelLikeCelsiusTemperature = response.data.main.feels_like;

  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  locationElement.innerHTML = `${cityElement}, ${countryElement}`;
  feelTempElement.innerHTML = `Feels like ${Math.round(
    response.data.main.feels_like
  )}`;
  humidityElement.innerHTML = `Humidity: ${humidity}%`;
  windElement.innerHTML = `Wind: ${windSpeed}km/h`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  dateElement.innerHTML = currentDate(response.data.dt * 1000);
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconElement.setAttribute("alt", response.data.weather[0].description);
}

function showForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];

    forecastElement.innerHTML += `<div class="col-2">
      <h3>${currentHour(forecast.dt * 1000)}</h3>
      <img
        src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"
      />
      <div>
      <span class="max-temp" id="max-temp"> ${Math.round(
        forecast.main.temp_max
      )}</span>°
      |
      <span class="min-temp" id="min-temp">${Math.round(
        forecast.main.temp_min
      )}</span>°
      </div>
    </div>`;
  }
}

function searchCity(city) {
  let apiKey = "fe9166a2542aaa38d4bef618206979ca";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-name").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "fe9166a2542aaa38d4bef618206979ca";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(showTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function changeToFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temp");
  let feelLikeElement = document.querySelector("#current-feel-temp");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let feelLikeTemperature = (feelLikeCelsiusTemperature * 9) / 5 + 32;

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  feelLikeElement.innerHTML = `Feels like ${Math.round(feelLikeTemperature)}`;

  let forecastMax = document.querySelectorAll(".max-temp");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  let forecastMin = document.querySelectorAll(".min-temp");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
  });

  fahrenheitLink.removeEventListener("click", changeToFahrenheit);
  celsiusLink.addEventListener("click", changeToCelsius);
}

function changeToCelsius(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#current-temp");
  let feelLikeElement = document.querySelector("#current-feel-temp");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  feelLikeElement.innerHTML = `Feels like ${Math.round(
    feelLikeCelsiusTemperature
  )}`;

  let forecastMax = document.querySelectorAll(".max-temp");
  forecastMax.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  let forecastMin = document.querySelectorAll(".min-temp");
  forecastMin.forEach(function (item) {
    let currentTemp = item.innerHTML;
    item.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
  });

  fahrenheitLink.addEventListener("click", changeToFahrenheit);
  celsiusLink.removeEventListener("click", changeToCelsius);
}

let celsiusTemperature = null;
let feelLikeCelsiusTemperature = null;

let form = document.querySelector("#search-city");
form.addEventListener("submit", handleSubmit);

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", changeToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", changeToCelsius);

searchCity("Toronto");
