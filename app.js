const API_KEY ="922e54470aba716cce3c3570e4d1ff0e";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("current-location-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");
const forecastDisplay = document.getElementById("forecast-display");
const recentDropdown = document.getElementById("recent-dropdown");
const recentCitiesContainer = document.getElementById("recent-cities");