const { Router } = require("express");
const axios = require("axios")

module.exports = Router({ mergeParams: true }).get("/weather", async (req, res, next) => {
  const { ApiError } = req
  const { city } = req.query;

  if (!city) {
    return next(ApiError.BadRequest());
  }

  try {
    console.log("key", process.env.WEATHER_API_KEY)
    const { data: apiResponse } = await axios.get("http://api.weatherapi.com/v1/current.json", {
      params: {
        key: process.env.WEATHER_API_KEY,
        q: city,
        aqi: "no"
      }
    });

    res.json({
      temperature: apiResponse.current.temp_c,
      humidity: apiResponse.current.humidity,
      description: apiResponse.current.condition.text
    });
  } catch (e) {
    if (e.status === 400) {
      return next(ApiError.NotFound("City not found"));
    }
    next(e);
  }
});
