<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
          @keyup.enter="searchByCity"
        />
        <button @click="searchByCity" class="search-button" :disabled="loading">
          {{ loading ? '搜索中...' : 'Search' }}
        </button>
        <br>
        <br>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>

    <!--The <main> tag in HTML is used to specify the main content of a document 
    More info about main, check https://www.w3schools.com/tags/tag_main.asp-->  
    <main>
      <!--If there are no data returned, then skip rendering the information-->  
      <div v-if="weatherData">
        <!--Display the weather data attribute returned from API
        Example of API data: https://openweathermap.org/current-->  
        <h2>
            {{ weatherData.name }}, {{ weatherData.sys.country }}
        </h2>
        <div>
          <!--The image source of of the weather icon will be coming from a function called iconUrl
              which will be shared in script later-->  
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <!-- weather[0] means the current weather, the way we need to obtain data depends on how
        the API JSON data looks-->
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
    </main>
  </div>
</template>

<script>
// The info section in 10.1.1 provided detailed information about this package 
import axios from "axios";

const apikey = "d731edd1709da310df38bdfa9f5dda95";

export default {
  name: "WeatherView",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
      loading: false,
      error: null,
    };
  },
  //computed is a property that is used to define a property that 
  //is dependent on other data properties. 
  //If we using a more easy to understand words to understand the concept: 
  //the derived value such as temperature automatically update when the relevant value change.
  computed: {
    //There are multiple way to obtain the data in Celsius format.
    //Since we're using units=metric parameter, temperature is already in Celsius
    //No need to convert from Kelvin
    temperature() {
      return this.weatherData
        ? Math.round(this.weatherData.main.temp)
        : null;
    },
    //Get the current weather icon using the API link
    iconUrl() {
      return this.weatherData
        ? `https://api.openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null;
    },
  },
  //There are two steps involved in this, 
  //step 1: identify current location 
  //step 2: after identify, get the weather data straight based on the current location.
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    //Async in a easy to understand way means the method will run in backend thread, 
    //And it won't occupy the main thread, so the user experience is still smooth
    async fetchCurrentLocationWeather() {
      //The navigator.geolocation object is part of the Web API provided by modern web browsers
      //Please note this function is not belongs to Vue or openweather.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          //API link to obtain the current weather based on the current location browser identified 
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
          //await means wait for the fetchWeatherData method to complete before proceeding
          await this.fetchWeatherData(url);
        });
      }
    },
    async fetchWeatherData(url) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(url);
        //Returned data from API is stored as JSON file in weatherData
        this.weatherData = response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.error = "无法获取天气数据，请检查城市名称是否正确";
        this.weatherData = null;
      } finally {
        this.loading = false;
      }
    },
    async searchByCity() {
      if (this.city.trim()) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}&units=metric`;
        await this.fetchWeatherData(url);
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.header {
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 200px;
}

.search-button {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover {
  background-color: #5a6268;
}

main {
  margin-top: 30px;
}

main h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

main img {
  width: 100px;
  height: 100px;
  margin: 10px 0;
}

main p {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

main span {
  font-size: 1.2rem;
  color: #666;
  text-transform: capitalize;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
}

.search-button:disabled {
  background-color: #6c757d;
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
