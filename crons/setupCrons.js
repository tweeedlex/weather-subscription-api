const {hourlyWeatherBroadcast, dailyWeatherBroadcast} = require("./weatherBroadcasts")
const cron = require("node-cron");

module.exports = (db) => {
  cron.schedule("0 * * * *", () => {
    hourlyWeatherBroadcast(db);
  });
  cron.schedule("0 10 * * *", () => {
    dailyWeatherBroadcast(db);
  });
};
