const API_KEY ="922e54470aba716cce3c3570e4d1ff0e";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// dom elements for displaying  weather information in  the weather service window
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("current-location-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");
const forecastDisplay = document.getElementById("forecast-display");
const recentDropdown = document.getElementById("recent-dropdown");
const recentCitiesContainer = document.getElementById("recent-cities");

// Recently searched cities (localStorage)
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];

// Event Listeners
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
    addCityToRecent(city);
  } else {
    alert("Please enter a city name.");
  }
});
locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },