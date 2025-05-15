const { Router } = require("express");

module.exports = Router({ mergeParams: true }).get("/confirm/:token", async (req, res, next) => {
  try {
    const { db, ApiError } = req;
    const { token } = req.params;
    if (typeof token !== "string" || token?.length !== 6) {
      return next(ApiError.BadRequest("Invalid token"));
    }

    const subscription = await db.Subscription.findOne({ token });
    if (!subscription) {
      return next(ApiError.NotFound("Token not found"));
    }

    subscription.confirmed = true;
    await subscription.save();

    return res.json({ message: "Subscription confirmed successfully" })
  } catch (e) {
    next(e);
  }
});
