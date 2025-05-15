const { Router } = require("express");
const getWeather = require("../../helpers/getWeather");

module.exports = Router({ mergeParams: true }).get("/weather", async (req, res, next) => {
  const { ApiError } = req
  const { city } = req.query;

  if (!city) {
    return next(ApiError.BadRequest());
  }

  try {
    const weather = await getWeather(city);
    res.json(weather);
  } catch (e) {
    if (e.status === 400) {
      return next(ApiError.NotFound("City not found"));
    }
    next(e);
  }
});
