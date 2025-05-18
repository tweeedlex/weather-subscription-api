const express = require("express");
const bodyParser = require("body-parser");
const expressWinston = require("express-winston");
const apiRouter = require("./api/createApiRouter.js")();
const cors = require("cors");
const ApiError = require("./exceptions/api-error.js");
const fileUpload = require("express-fileupload");

module.exports = ({ database, logger, isTest }) =>
  express()
  .use((req, res, next) => {
    res.header("Access-Control-Max-Age", "86400");
    next();
  })
  .use(
    expressWinston.logger({
      winstonInstance: logger,
      msg: "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms",
      meta: false,
    })
  )
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use((req, res, next) => {
    req.base = `${req.protocol}://${req.get("host")}`;
    req.logger = logger;
    req.db = database;
    req.ApiError = ApiError;
    return next();
  })
  .use(
    cors({
      origin: "*",
      credentials: true,
    })
  )
  .use(fileUpload())
  .use("/", express.static("static"))
  .use("/api", apiRouter)
  .use((req, res) => res.sendStatus(404))
  .use((error, req, res, next) => {
    if (!isTest) {
      logger.error(
        `req.method: ${req.method}, req.path: ${req.path}, error: ${error}`
      );
      console.log("error:", error, "error.status:", error.status, "error.message:", error.message);
    }
    if (error?.status) {
      return res.status(error.status).json(error);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  });
