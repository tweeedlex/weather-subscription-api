const { Router } = require("express");

module.exports = Router({ mergeParams: true }).get("/user/test", async (req, res, next) => {
	try {
		res.status(200);
	} catch (error) {
		console.error("Error:", error.message);
		next(error);
	}
});
