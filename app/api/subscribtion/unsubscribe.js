const { Router } = require("express");

module.exports = Router({ mergeParams: true }).get("/unsubscribe/:token", async (req, res, next) => {
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

    await db.Subscription.deleteOne({ token });

    return res.json({ message: "Unsubscribed successfully" });
  } catch (e) {
    next(e);
  }
});
