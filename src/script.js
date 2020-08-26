function currentDate(date) {
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
  let currentHour = date.getHours();
  if (currentHour < 10) {
    currentHour = `0${currentHour}`;
  }
  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }
  let showDate = document.querySelector("#date");
  showDate.innerHTML = `${currentDay}, ${currentMonth} ${presentDate}, ${currentYear} | ${currentHour}:${currentMinutes}`;
}

function showTemperature(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  let feelTemp = Math.round(response.data.main.feels_like);
  document.querySelector(
    "#current-feel-temp"
  ).innerHTML = `Feels like ${feelTemp}`;
  let humidity = Math.round(response.data.main.humidity);
  document.querySelector("#humidity").innerHTML = `Humidity: ${humidity}%`;
  let wind = Math.round(response.data.wind.speed);
  document.querySelector("#wind-speed").innerHTML = `Wind: ${wind}km/h`;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
}

function searchCity(city) {
  let apiKey = "fe9166a2542aaa38d4bef618206979ca";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
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

let date = new Date();
currentDate(date);

let form = document.querySelector("#search-city");
form.addEventListener("submit", handleSubmit);

let locationButton = document.querySelector("#current-location");
locationButton.addEventListener("click", getCurrentLocation);

searchCity("New York");
