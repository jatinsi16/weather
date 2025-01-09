
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
        (error) => {
            alert("Unable to retrieve location. Please try again.");
            console.error(error);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    });

recentDropdown.addEventListener("change", (event) => {
    const city = event.target.value; 
    if (city) fetchWeatherByCity(city);
  });
  // Fetch Weather by City Name
async function fetchWeatherByCity(city) {
    try {
      const response = await fetch(`${API_URL}?q=${city}&units=metric&appid=${API_KEY}`);
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
      alert(error.message);
    }
  }
  // Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      if (!response.ok) throw new Error("Unable to fetch weather data");
      const data = await response.json();
      displayWeather(data);
      fetchForecast(lat, lon);
    } catch (error) {
      alert(error.message);
    }
  }
  // Fetch Extended Forecast
async function fetchForecast(lat, lon) {
    try {
      const response = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
      if (!response.ok) throw new Error("Unable to fetch forecast data");
      const data = await response.json();
      displayForecast(data);
    } catch (error) {
      alert(error.message);
    }
  }
  
  // Display Current Weather
function displayWeather(data) {
    weatherDisplay.classList.remove("hidden");
    document.getElementById("city-name").textContent = data.name;
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
    document.getElementById("conditions").textContent = data.weather[0].description;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("wind-speed").textContent = data.wind.speed;
    document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  }
  // Display Extended Forecast
  function displayForecast(data) {
    const forecastDisplay = document.getElementById("forecast-display");
    forecastDisplay.classList.remove("hidden");
    const forecastCards = document.getElementById("forecast-cards");
    forecastCards.innerHTML = ""; // Clear previous cards
  
    // Filter forecast data to one entry per day
    const dailyData = data.list.filter((item) => item.dt_txt.includes("12:00:00"));
  
    dailyData.forEach((day) => {
      const date = new Date(day.dt_txt).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" });
      forecastCards.innerHTML += `
        <div class="bg-white p-4 rounded-md shadow-md">
          <p class="text-sm font-bold text-black">${date}</p>
          <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon" class="w-12 h-12 mx-auto">
          <p class="text-sm text-black mt-2">Temp: ${day.main.temp}°C</p>
          <p class="text-sm text-black mt-2">Humidity: ${day.main.humidity}%</p>
          <p class="text-sm text-black mt-2">Wind: ${day.wind.speed} km/h</p>
        </div>
      `;
    });
  }
  
// Add City to Recently Searched
function addCityToRecent(city) {
  if (!recentCities.includes(city)) {
    recentCities.push(city);
    if (recentCities.length > 5) recentCities.shift(); // Limit to 5 cities
    localStorage.setItem("recentCities", JSON.stringify(recentCities));
    updateRecentCities();
  }
}
// Update Recently Searched Dropdown
function updateRecentCities() {
  if (recentCities.length > 0) {
    recentCitiesContainer.classList.remove("hidden");
    recentDropdown.innerHTML = `<option value="">Select a city</option>`;
    recentCities.forEach((city) => {
      recentDropdown.innerHTML += `<option value="${city}">${city}</option>`;
    });
  }
}

// Initialize Recently Searched Cities on Page Load
updateRecentCities();