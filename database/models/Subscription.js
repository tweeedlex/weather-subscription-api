const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
	email: { type: String, required: true },
	city: { type: String, required: true },
	frequency: { type: String, enum: ["hourly", "daily"], required: true },
	confirmed: { type: Boolean, default: false },
});

module.exports = subscriptionSchema;
