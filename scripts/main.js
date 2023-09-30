const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "06faa0f569dc4db6ada123522231809";
const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { 
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

    } else { //five day forecast card
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
            const { latitude, longitude } = position.coords; 
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






// Function to update weather cards with data
function updateWeatherCards(weatherData) {
  const weatherCards = document.querySelectorAll(".historical-card");


  weatherData.forEach((weatherItem, index) => {
    const card = weatherCards[index];
    card.querySelector("h3").textContent = `(${weatherItem.date})`;
    const imgElement = card.querySelector("img");
    if (imgElement) {
      imgElement.src = weatherItem.day.condition.icon;


    } else {
      console.error("Image element not found in card:", card);
    }
    card.querySelector("h6:nth-of-type(1)").textContent = `Temp: ${weatherItem.day.maxtemp_c} °C`;
    card.querySelector("h6:nth-of-type(2)").textContent = `Wind: ${weatherItem.day.maxwind_kph} KPH`;
    card.querySelector("h6:nth-of-type(3)").textContent = `Humidity: ${weatherItem.day.avghumidity}%`;
  });
}


const getHistoricalWeather = (cityName) => {
  const API_KEY = '06faa0f569dc4db6ada123522231809'; 
  const today = new Date();
  const endDate = today.toISOString().slice(0, 10); 
  today.setDate(today.getDate() - 5); 
  const startDate = today.toISOString().slice(0, 10);
  
  const HISTORICAL_API_URL = `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${cityName}&dt=${startDate}&end_dt=${endDate}`;

  fetch(HISTORICAL_API_URL)
    .then((response) => {
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }
       return response.json();
    })
    .then((data) => {
      const historicalData = data.forecast.forecastday;
      const historicalWeatherDiv = document.querySelector(".historical-weather");
      historicalWeatherDiv.innerHTML = ""; 
      const weatherCardsContainer = document.createElement("div");
      weatherCardsContainer.className = "historical-cards-container";
      historicalWeatherDiv.appendChild(weatherCardsContainer);
      updateWeatherCards(historicalData);
    })
    // .catch((error) => {
    //   console.error('An error occurred while fetching historical weather data:', error);
    //   alert('An error occurred while fetching historical weather data.');
    // });
};

const searchButton2 = document.querySelector("#search-button");
searchButton.addEventListener("click", () => {
  const cityName = document.querySelector("#location-input").value.trim();
  if (cityName === "") return;
  getHistoricalWeather(cityName);
});






const apiKey = 'AIzaSyD0bj2iECF4dD3GesTRoBnVqGfHXwzZcrA'; // Replace with your API key

// Initialize the map
function initMap() {
    const defaultLocation = { lat: 6.9271, lng: 79.8612 };
    const map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 8
    });
    const geocoder = new google.maps.Geocoder();
    
    document.getElementById('search-button').addEventListener('click', function() {
        const locationInput = document.getElementById('location-input').value;
        geocodeAddress(geocoder, map, locationInput);
    });
}

function geocodeAddress(geocoder, map, address) {
    geocoder.geocode({ 'address': address }, function(results, status) {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            map.setCenter(location);
            const marker = new google.maps.Marker({
                map: map,
                position: location
            });
            const cityName = results[0].address_components.find(component => {
                return component.types.includes('locality');
            });
            const infoWindow = new google.maps.InfoWindow({
                content: cityName ? cityName.long_name : 'City not found'
            });
            infoWindow.open(map, marker);
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
