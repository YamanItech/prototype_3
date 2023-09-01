
const apiKey = "717618e588ff5f69b0182c637037a3be";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

let searchBox = document.querySelector(".input-field"); // Search input
const searchBtn = document.querySelector(".sabin button"); // Search button
const weatherIcon = document.querySelector(".icons-image"); // Weather icon
const descriptionElement = document.querySelector(".city-condition1"); // Description element
const errorMessage = document.querySelector(".error-message");

async function handleCitySearch() {
  function capitalizeWords(preStr) {
    return preStr.split(' ').map(word => {
        if (word.length > 0) {
            return word[0].toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    }).join(' ');
  }
  let textInputCity = capitalizeWords(searchBox.value);
  const city = textInputCity.trim();

  if (navigator.onLine) {
    try {
      // Attempt to retrieve cached data from local storage
      const cachedWeatherData = localStorage.getItem(city);
      if (cachedWeatherData) {
        console.log("Data accessed from local storage");
        const data = JSON.parse(cachedWeatherData);
        displayWeatherData(data);
        return; // Stop execution since we have cached data.
      }

      // Fetch weather data from the API
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      if (data.cod === 404) {
        errorMessage.textContent = "The city you entered is not available. Please try again.";
        return;
      }

      // Update weather details on the page
      displayWeatherData(data);

      // Store weather data in local storage
      localStorage.setItem(city, JSON.stringify(data));
      console.log("Data accessed from the internet");

      // Prepare weather data for sending to PHP script
      const weatherData = {
        city: data.name,
        date_on: new Date(),
        temperature: Math.round(data.main.temp),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        weather: data.weather[0].main,
        description: data.weather[0].description,
      };

      // Send weather data to the PHP script using AJAX
      fetch("Connection.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weatherData),
      })
      .then((response) => response.text())
      .catch((error) => console.error("Error in sending data:", error));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  } else {
    // Attempt to retrieve cached data from local storage
    const cachedWeatherData = localStorage.getItem(city);
    if (cachedWeatherData) {
      console.log("Data accessed from local storage");
      const data = JSON.parse(cachedWeatherData);
      displayWeatherData(data);
    } else {
      errorMessage.textContent = "No cached data available for this city.";
    }
  }
}

searchBtn.addEventListener("click", handleCitySearch);

searchBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCitySearch();
  }
});

function displayWeatherData(data) {
  // Update weather details on the page
  document.querySelector(".city-name1").textContent = data.name;
  document.querySelector(".temp").textContent =
    Math.round(data.main.temp) + "°C";
  document.querySelector(".pressure-value-sabin").textContent =
    data.main.pressure + "hPa";
  document.querySelector(".sabin-humidity-value").textContent =
    data.main.humidity + "%";
  document.querySelector(".wind-1").textContent =
    data.wind.speed + " km/h";

  // Get and display weather description
  const weatherDescription = data.weather[0].description;
  descriptionElement.textContent = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

  // Update weather icon based on weather condition using OpenWeatherMap API
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  weatherIcon.src = iconUrl;

  // Format and display the current date
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  document.querySelector(".sabin_date-value").textContent = formattedDate;
}

async function start() {
  // Check if the user is online
  const isOnline = navigator.onLine;
  const city = "Vale of Glamorgan";

  if (navigator.onLine) {
    try {
      // Attempt to retrieve cached data from local storage
      const cachedWeatherData = localStorage.getItem(city);
      if (cachedWeatherData) {
        console.log("Data accessed from local storage");
        const data = JSON.parse(cachedWeatherData);
        displayWeatherData(data);
        return; // Stop execution since we have cached data.
      }

      // Fetch weather data from the API
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
      const data = await response.json();
      if (data.cod === 404) {
        errorMessage.textContent = "The city you entered is not available. Please try again.";
        return;
      }

      // Update weather details on the page
      displayWeatherData(data);

      // Store weather data in local storage
      localStorage.setItem(city, JSON.stringify(data));
      console.log("Data accessed from the internet");

      // Prepare weather data for sending to PHP script
      const weatherData = {
        city: data.name,
        date_on: new Date(),
        temperature: Math.round(data.main.temp),
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        wind_speed: data.wind.speed,
        weather: data.weather[0].main,
        description: data.weather[0].description,
      };

      // Send weather data to the PHP script using AJAX
      fetch("Connection.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weatherData),
      })
      .then((response) => response.text())
      .catch((error) => console.error("Error in sending data:", error));
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  } else {
    // Attempt to retrieve cached data from local storage
    const cachedWeatherData = localStorage.getItem(city);
    if (cachedWeatherData) {
      console.log("Data accessed from local storage");
      const data = JSON.parse(cachedWeatherData);
      displayWeatherData(data);
    } else {
      errorMessage.textContent = "No cached data available for this city.";
    }
  }
}

start();
