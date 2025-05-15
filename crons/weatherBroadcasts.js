const { createTransport } = require("../app/helpers/mail")
const getWeather = require("../app/helpers/getWeather");

function getSubject(type, currentHour) {
  return type === "hourly"
    ? `Weather forecast for ${currentHour} o'clock!`
    : `Weather forecast for today!`;
}

function getEmailBody(type, weather) {
  return type === "hourly"
    ? `${weather.description}\nTemperature: ${weather.temperature}°C\nHumidity: ${weather.humidity}%`
    : `${weather.forecastDay.condition.text}\nAverage temperature: ${weather.forecastDay.avgtemp_c}°C\nAverage humidity: ${weather.forecastDay.avghumidity}%`;
}

const broadcastWeather = async (db, type = "hourly") => {
  const transport = createTransport();

  const activeSubscriptions = await db.Subscription.find({ confirmed: true });
  for (let subscription of activeSubscriptions) {
    const { email, city } = subscription;
    try {
      const now = new Date();
      const currentHour = now.getHours();
      const weather = await getWeather(city);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: getSubject(type, currentHour),
        text: getEmailBody(type, weather)
      };

      await transport.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  }
}

const hourlyWeatherBroadcast = (db) => broadcastWeather(db, "hourly");
const dailyWeatherBroadcast = (db) => broadcastWeather(db, "daily");

module.exports = { hourlyWeatherBroadcast, dailyWeatherBroadcast };