const API_KEY = "922e54470aba716cce3c3570e4d1ff0e"; // API key for OpenWeatherMap
const API_URL = "https://api.openweathermap.org/data/2.5/weather"; // URL for current weather
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"; // URL for forecast

// DOM elements for weather display
const searchBtn = document.getElementById("search-btn"); // Search button
const locationBtn = document.getElementById("current-location-btn"); // Location button
const cityInput = document.getElementById("city-input"); // City input field
const weatherDisplay = document.getElementById("weather-display"); // Weather display section
const forecastDisplay = document.getElementById("forecast-display"); // Forecast display section
const recentDropdown = document.getElementById("recent-dropdown"); // Dropdown for recent cities
const recentCitiesContainer = document.getElementById("recent-cities"); // Container for recent cities

// Recently searched cities from localStorage
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || []; // Load recent cities

// Event Listeners
searchBtn.addEventListener("click", () => { // Search button click
  const city = cityInput.value.trim(); // Get city input
  if (city) {
    fetchWeatherByCity(city); // Fetch weather for city
    addCityToRecent(city); // Add city to recent list
  } else {
    alert("Please enter a city name."); // Alert if no city entered
  }
});

locationBtn.addEventListener("click", () => { // Location button click
  if (navigator.geolocation) { // Check if geolocation is supported
    navigator.geolocation.getCurrentPosition(
      (position) => { // Success callback
        const { latitude, longitude } = position.coords; // Get coordinates
        fetchWeatherByCoords(latitude, longitude); // Fetch weather by coordinates
      },
      (error) => { // Error callback
        alert("Unable to retrieve location. Please try again."); // Alert on error
        console.error(error); // Log error
      }
    );
  } else {
    alert("Geolocation is not supported by your browser."); // Alert if geolocation unsupported
  }
});

recentDropdown.addEventListener("change", (event) => { // Recent dropdown change
  const city = event.target.value; // Get selected city
  if (city) fetchWeatherByCity(city); // Fetch weather for selected city
});

// Fetch Weather by City Name
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`${API_URL}?q=${city}&units=metric&appid=${API_KEY}`); // Fetch weather data
    if (!response.ok) throw new Error("City not found"); // Handle error
    const data = await response.json(); // Parse response
    displayWeather(data); // Display current weather
    fetchForecast(data.coord.lat, data.coord.lon); // Fetch forecast
  } catch (error) {
    alert(error.message); // Alert on error
  }
}

// Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`); // Fetch weather data
    if (!response.ok) throw new Error("Unable to fetch weather data"); // Handle error
    const data = await response.json(); // Parse response
    displayWeather(data); // Display current weather
    fetchForecast(lat, lon); // Fetch forecast
  } catch (error) {
    alert(error.message); // Alert on error
  }
}

// Fetch Extended Forecast
async function fetchForecast(lat, lon) {
  try {
    const response = await fetch(`${FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`); // Fetch forecast data
    if (!response.ok) throw new Error("Unable to fetch forecast data"); // Handle error
    const data = await response.json(); // Parse response
    displayForecast(data); // Display forecast
  } catch (error) {
    alert(error.message); // Alert on error
  }
}

// Display Current Weather
function displayWeather(data) {
  weatherDisplay.classList.remove("hidden"); // Show weather display
  document.getElementById("city-name").textContent = data.name; // Set city name
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`; // Display temperature
  document.getElementById("conditions").textContent = data.weather[0].description ; // Show weather conditions
  document.getElementById("humidity").textContent = data.main.humidity; // Display humidity
  document.getElementById("wind-speed").textContent = data.wind.speed; // Show wind speed
  document.getElementById("weather-icon").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // Set weather icon
}

// Display Extended Forecast
function displayForecast(data) {
  const forecastDisplay = document.getElementById("forecast-display"); // Get forecast display element
  forecastDisplay.classList.remove("hidden"); // Show forecast display
  const forecastCards = document.getElementById("forecast-cards"); // Get forecast cards container
  forecastCards.innerHTML = ""; // Clear previous cards

  // Filter forecast data to one entry per day
  const dailyData = data.list.filter((item) => item.dt_txt.includes("12:00:00")); // Filter for daily data

  dailyData.forEach((day) => { // Loop through daily data
    const date = new Date(day.dt_txt).toLocaleDateString("en-GB", { weekday: "short", month: "short", day: "numeric" }); // Format date
    forecastCards.innerHTML += ` // Add forecast card
      <div class="bg-white p-4 rounded-md shadow-md">
        <p class="text-sm font-bold text-black sm:text-base md:text-lg lg:text-xl">
          ${date} // Display date
        </p>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" 
          alt="Weather Icon" 
          class="w-12 h-12 mx-auto sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
        > // Show weather icon

        <p class="text-sm text-black mt-2 sm:text-base md:text-lg lg:text-xl">
          Temp: ${day.main.temp}°C // Display temperature
        </p>

        <p class="text-sm text-black mt-2 sm:text-base md:text-lg lg:text-xl">
          Humidity: ${day.main.humidity}% // Display humidity
        </p>

        <p class="text-sm text-black mt-2 sm:text-base md:text-lg lg:text-xl">
          Wind: ${day.wind.speed} km/h // Display wind speed
        </p>
      </div>
    `;
  });
}

// Add City to Recently Searched
function addCityToRecent(city) {
  if (!recentCities.includes(city)) { // Check if city is new
    recentCities.push(city); // Add city to recent list
    if (recentCities.length > 5) recentCities.shift(); // Limit to 5 cities
    localStorage.setItem("recentCities", JSON.stringify(recentCities)); // Save to localStorage
    updateRecentCities(); // Update recent cities dropdown
  }
}

// Update Recently Searched Dropdown
function updateRecentCities() {
  if (recentCities.length > 0) { // Check if there are recent cities
    recentCitiesContainer.classList.remove("hidden"); // Show recent cities container
    recentDropdown.innerHTML = `<option value="">Select a city</option>`; // Reset dropdown
    recentCities.forEach((city) => { // Loop through recent cities
      recentDropdown.innerHTML += `<option value="${city}">${city}</option>`; // Add city to dropdown
    });
  }
}

// Initialize Recently Searched Cities on Page Load
updateRecentCities(); // Call function to update recent cities