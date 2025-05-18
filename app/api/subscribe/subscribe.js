const { Router } = require("express");
const { createTransport } = require(`${process.cwd()}/app/helpers/mail`);

module.exports = Router({ mergeParams: true }).post("/subscribe", async (req, res, next) => {
  try {
    const { db, ApiError } = req
    const { email, city, frequency } = req.body;
    const isRequestValid = validate(req);
    if (!isRequestValid) {
      return next(ApiError.BadRequest("Invalid input"));
    }

    const existingSubscription = await db.Subscription.findOne({ email });
    if (existingSubscription) {
      return next(ApiError.Conflict("Email already subscribed"));
    }

    const transport = createTransport();

    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Weather forecast subscription confirmation",
      text: `Thank you for subscribing to our weather forecast service.
Your token: ${token}`
    };

    try {
      await transport.sendMail(mailOptions);
    } catch (error) {
      console.log("Error sending email:", error);
      return next(ApiError.BadRequest("Failed to send email. Try using another email address."));
    }

    await db.Subscription.create({ email, city, frequency, token });
    return res.json({ message: "Subscription successful. Confirmation email sent." })
  } catch (e) {
    next(e)
  }
});

const validate = function (req) {
  const { email, city, frequency } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validFrequencies = ["hourly", "daily"];

  return !(!email || !emailRegex.test(email) || !city || !validFrequencies.includes(frequency));
};