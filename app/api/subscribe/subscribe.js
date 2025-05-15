const { Router } = require("express");
const nodemailer = require("nodemailer");

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Weather forecast subscription confirmation",
      text: `Thank you for subscribing to our weather forecast service.
Your confirmation code: ${code}`
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.log("Error sending email:", error);
      return next(ApiError.BadRequest("Failed to send email. Try using another email address."));
    }

    await db.Subscription.create({ email, city, frequency, code });
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