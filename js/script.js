  const date = new Date();
  let day = date.getDate();
  let year = date.getFullYear();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayOfWeek = daysOfWeek[date.getDay()]; 
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let monthName = monthNames[date.getMonth()];
  let fullDate = `${dayOfWeek},${monthName} ${day}</br>${year}`;
  
  document.getElementById('date').innerHTML = `${fullDate}`;
   const apikey = "8e8c36eefaa15d1c6b25ed4a4d0de73a";// Sets the API key for accessing weather data.
   const apiurl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
   const searchBox = document.querySelector('.search input');// Sets the API URL for fetching weather data and selects the search input element and search button.
   const searchBtn = document.querySelector('.search button');
   // Define default and current city variables
  const defaultCity = "East Hertfordshire District";
  let currentCity = "";
function saveDataToLocalStorage(city, data) {
  try {
    localStorage.setItem(city, JSON.stringify(data));
    console.log(`Data for ${city} saved to local storage`);
  } catch (error) {
    console.error(`Error saving data for ${city} to local storage:`, error);
  }
}
   
   async function weatherCheck(city) {// Defines a function 'weatherCheck' that takes a city parameter to fetch weather data from the API.
     if (!city) {// Displays an alert if no city is provided.
       alert("Please enter a city name");
       return;
       
     }
      
     fetch(apiurl + city + `&appid=${apikey}`)// Fetches weather data for the given city using the API URL and API key.
       .then(response => response.json())
       .then(data => {
         console.log(data);//data to print in console
          // Displays various weather data in the respective HTML elements based on the fetched data.
         document.getElementById('place').innerHTML = data.name;
         document.getElementById('Temperature').innerHTML = Math.round(data.main.temp) + " °C";
         document.getElementById('high-t').innerHTML = Math.round(data.main.temp_max) + "°C";
         document.getElementById('low-t').innerHTML = Math.round(data.main.temp_min) + "°C";
         document.getElementById('Humidity').innerHTML = data.main.humidity + "%";
         document.getElementById('Wind').innerHTML = data.wind.speed + " km/hr";
         document.getElementById('pressure').innerHTML = data.main.pressure + " PA";
         document.getElementById('des').innerHTML=data.weather[0].description;
         const weatherIcon = document.getElementById('icon');
         weatherIcon.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;// Sets the weather icon based on the fetched weather data.
         if (navigator.onLine) {
          saveDataToLocalStorage(city, data);
        }
        fetch("./php/insert.php", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
            body: JSON.stringify(data) 
          }) 
    document.querySelector(".historyButton").addEventListener("click", () => {
      window.location.href = `history.html?city=${city}`;
    });
        
        
       })
       .catch(error => {
         console.error("Error fetching weather data:", error);
         document.getElementById('place').innerHTML = "City Not Found";
         document.getElementById('Temperature').innerHTML = "";
         document.getElementById('high-t').innerHTML = "";
         document.getElementById('low-t').innerHTML = "";
         document.getElementById('Humidity').innerHTML = "";
         document.getElementById('Wind').innerHTML = "";
         document.getElementById('pressure').innerHTML = "";
         document.getElementById('des').innerHTML = "";
         const weatherIcon = document.getElementById('icon');
         weatherIcon.src = "";
       });
   };
  // Function to display weather data from local storage
function displayWeatherData(cityName) {
  const savedData = JSON.parse(localStorage.getItem(cityName));

  if (savedData) {
    console.log(`Data retrieved from local storage for ${cityName}:`, savedData);
    document.getElementById('place').innerHTML = savedData.name;
    document.getElementById('Temperature').innerHTML = Math.round(savedData.main.temp) + " °C";
    document.getElementById('high-t').innerHTML = Math.round(savedData.main.temp_max) + "°C";
    document.getElementById('low-t').innerHTML = Math.round(savedData.main.temp_min) + "°C";
    document.getElementById('Humidity').innerHTML = savedData.main.humidity + "%";
    document.getElementById('Wind').innerHTML = savedData.wind.speed + " km/hr";
    document.getElementById('pressure').innerHTML = savedData.main.pressure + " PA";
    document.getElementById('des').innerHTML = savedData.weather[0].description;
    const weatherIcon = document.getElementById('icon');
    weatherIcon.src = `http://openweathermap.org/img/w/${savedData.weather[0].icon}.png`;
  } else {
    weatherCheck(cityName);
  }
}

// Event listener for the page load
window.addEventListener('load', () => {
  const searchParams = new URLSearchParams(window.location.search);
  currentCity = searchParams.get("city");

  displayWeatherData(defaultCity);

  if (currentCity) {
    displayWeatherData(currentCity);
  }
});

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = searchBox.value;
    displayWeatherData(city);
  }
});

searchBtn.addEventListener("click", () => {
  const city = searchBox.value;
  displayWeatherData(city);
});