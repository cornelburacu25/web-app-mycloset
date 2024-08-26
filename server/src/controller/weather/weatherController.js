const axios = require('axios');

const getGeolocation = async (req, res) => {
  try {
    const geoResponse = await axios.get('https://api.ipgeolocation.io/ipgeo', {
      params: {
        apiKey: process.env.GEOLOCATION_API_KEY,
      }
    });

    const { latitude, longitude, city, country_name } = geoResponse.data;

    res.json({
      latitude,
      longitude,
      city,
      country: country_name,
    });
  } catch (error) {
    console.error('Error fetching IP geolocation data:', error);
    res.status(500).json({ error: 'Failed to fetch IP geolocation data' });
  }
};

const getWeatherForecast = async (lat, lon) => {
  const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: {
      lat,
      lon,
      appid: process.env.WEATHER_API_KEY,
      units: 'metric'
    }
  });
  return forecastResponse.data.list.slice(0, 4); // Get first 4 intervals
};

const getWeatherForecastByCity = async (city) => {
  const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
    params: {
      q: city,
      appid: process.env.WEATHER_API_KEY,
      units: 'metric'
    }
  });
  return forecastResponse.data.list.slice(0, 4); // Get first 4 intervals
};

const getWeatherByLocation = async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const forecastData = await getWeatherForecast(lat, lon);

    const weatherConditions = forecastData.map(entry => entry.weather[0].main);
    const temperatures = forecastData.map(entry => entry.main.temp);
    const avgTemperature = (temperatures.reduce((acc, temp) => acc + temp, 0) / temperatures.length).toFixed(2);
    const adverseWeatherCondition = weatherConditions.some(condition => ['Thunderstorm', 'Drizzle', 'Rain', 'Snow'].includes(condition));

    const weatherCondition = adverseWeatherCondition ? "Adverse" : "Normal";

    console.log('Weather conditions:', weatherConditions);

    res.json({ weatherConditions, avgTemperature, weatherCondition });
  } catch (error) {
    console.error('Error fetching location-based weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

const getWeatherByCity = async (req, res) => {
  const { city } = req.query;

  try {
    const forecastData = await getWeatherForecastByCity(city);

    const weatherConditions = forecastData.map(entry => entry.weather[0].main);
    const temperatures = forecastData.map(entry => entry.main.temp);
    const avgTemperature = (temperatures.reduce((acc, temp) => acc + temp, 0) / temperatures.length).toFixed(2);
    const adverseWeatherCondition = weatherConditions.some(condition => ['Thunderstorm', 'Drizzle', 'Rain', 'Snow'].includes(condition));

    const weatherCondition = adverseWeatherCondition ? "Adverse" : "Normal";

    // Visualize weather conditions
    //console.log('Weather conditions:', weatherConditions);

    res.json({ weatherConditions, avgTemperature, weatherCondition });
  } catch (error) {
    console.error('Error fetching city-based weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

module.exports = {
  getWeatherByLocation,
  getWeatherByCity,
  getGeolocation,
};