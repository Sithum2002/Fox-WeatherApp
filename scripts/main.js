const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "06faa0f569dc4db6ada123522231809";
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.date})</h2>
                    <h6>Temperature: ${weatherItem.day.maxtemp_c}°C</h6>
                    <h6>Wind: ${weatherItem.day.maxwind_kph} KPH</h6>
                    <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
                </div>
                <div class="icon">
                    <img src="${weatherItem.day.condition.icon}" alt="weather-icon">
                    <h6>${weatherItem.day.condition.text}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.date})</h3>
                    <img src="${weatherItem.day.condition.icon}" alt="weather-icon">
                    <h6>Temp: ${weatherItem.day.maxtemp_c}°C</h6>
                    <h6>Wind: ${weatherItem.day.maxwind_kph} KPH</h6>
                    <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=6`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {
            // Extract the current weather and forecast data
            const currentWeather = data.current;
            const fiveDaysForecast = data.forecast.forecastday;

            // Clearing previous weather data
            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";
            weatherCardsDiv.innerHTML = "";

            // Creating weather cards and adding them to the DOM
            fiveDaysForecast.forEach((weatherItem, index) => {
                const html = createWeatherCard(cityName, weatherItem, index);
                if (index === 0) {
                    currentWeatherDiv.insertAdjacentHTML("beforeend", html);
                } else {
                    weatherCardsDiv.insertAdjacentHTML("beforeend", html);
                }
            });
        })
        .catch(() => {
            alert("An error occurred while fetching the weather forecast!");
        });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=5`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            if (!data.location) return alert(`No coordinates found for ${cityName}`);
            const { lat, lon, name } = data.location;
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            getWeatherDetails("Your Location", latitude, longitude);
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());





// Initialize the map
const map = L.map('map').setView([0, 0], 13); // Default view at coordinates [0, 0], zoom level 13

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to display a location on the map
function displayLocationOnMap(latitude, longitude) {
    map.setView([latitude, longitude], 13); // Set the view to the specified coordinates and zoom level
    L.marker([latitude, longitude]).addTo(map); // Add a marker at the location
}

// Event listener for the "Search" button
document.getElementById('search-button').addEventListener('click', () => {
    const locationInput = document.getElementById('location-input').value.trim();
    if (locationInput === '') return;

    // You can use a geocoding service to get coordinates for the entered location
    // For simplicity, let's assume a function getCoordinatesFromLocation that returns coordinates
    const { latitude, longitude } = getCoordinatesFromLocation(locationInput);

    // Display the location on the map
    displayLocationOnMap(latitude, longitude);
});

// Function to get coordinates from a location (You can implement this function using a geocoding service)
function getCoordinatesFromLocation(location) {
    // This is a placeholder function, you should use a geocoding service like Nominatim or Mapbox Geocoding API
    // to convert the location input to latitude and longitude.
    // For example, you can make an API request to a geocoding service and parse the response.
    // Replace this with your actual implementation.
    return {
        latitude: 0, // Replace with actual latitude
        longitude: 0, // Replace with actual longitude
    };
}

















// Function to create historical weather cards
const createHistoricalWeatherCard = (weatherItem) => {
    return `
      <div class="historical-card">
        <h3>${weatherItem.date}</h3>
        <img src="${weatherItem.day.condition.icon}" alt="weather-icon">
        <h6>Temp: ${weatherItem.day.maxtemp_c}°C</h6>
        <h6>Wind: ${weatherItem.day.maxwind_kph} KPH</h6>
        <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
      </div>
    `;
  };

  
  // Function to fetch historical weather data
  const getHistoricalWeather = (cityName) => {
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10); // End date is today
    today.setDate(today.getDate() - 5); // Start date is 5 days ago
    const startDate = today.toISOString().slice(0, 10);
  
    const HISTORICAL_API_URL = `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${cityName}&dt=${startDate}&end_dt=${endDate}`;
  
    fetch(HISTORICAL_API_URL)
      .then((response) => response.json())
      .then((data) => {
        const historicalData = data.forecast.forecastday;
  
        // Clear previous historical weather data
        const historicalWeatherDiv = document.querySelector(".historical-weather");
        historicalWeatherDiv.innerHTML = "";
  
        // Create and add historical weather cards to the DOM
        historicalData.forEach((weatherItem) => {
          const html = createHistoricalWeatherCard(weatherItem);
          historicalWeatherDiv.insertAdjacentHTML("beforeend", html);
        });
      })
      .catch(() => {
        alert("An error occurred while fetching historical weather data!");
      });
  };
  
  // Add an event listener to the historical weather button
  const historicalWeatherButton = document.querySelector(".historical-weather-btn");
  historicalWeatherButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    getHistoricalWeather(cityName);
  });
  



