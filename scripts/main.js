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


