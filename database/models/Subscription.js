const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
	email: { type: String, required: true },
	city: { type: String, required: true },
	frequency: { type: String, enum: ["hourly", "daily"], required: true },
	confirmed: { type: Boolean, default: false },
	code: { type: Number, required: true },
});

subscriptionSchema.methods.toJSON = () => {
	const obj = this.toObject();
	delete obj.code;
	return obj;
}

module.exports = subscriptionSchema;
