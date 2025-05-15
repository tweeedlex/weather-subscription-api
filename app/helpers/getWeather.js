const axios = require("axios");

module.exports = async (city) => {
  const { data: apiResponse } = await axios.get("http://api.weatherapi.com/v1/current.json", {
    params: {
      key: process.env.WEATHER_API_KEY,
      q: city,
      aqi: "no"
    }
  });

  return {
    temperature: apiResponse.current.temp_c,
    humidity: apiResponse.current.humidity,
    description: apiResponse.current.condition.text
  }
}