const axios = require("axios");

module.exports = async (city) => {
  const { data: apiResponse } = await axios.get("http://api.weatherapi.com/v1/forecast.json", {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: city,
      day: 1,
      aqi: "no",
      alerts: "no"
    }
  });

  return {
    temperature: apiResponse.current.temp_c,
    humidity: apiResponse.current.humidity,
    description: apiResponse.current.condition.text,
    forecastDay: apiResponse.forecast.forecastday[0].day,
  }
}