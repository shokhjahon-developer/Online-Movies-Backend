require("dotenv/config");

const cors = require("cors");
const cookie = require("cookie-parser");
const fileUpload = require("express-fileupload");
const errorHandler = require("../middlewares/error.handler");

const authRoute = require("../routes/auth.route");
const moviesRoute = require("../routes/movies.route");

const modules = (app, express) => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cors());
  app.use(cookie());
  app.use(fileUpload());

  app.use("/api/auth", authRoute);
  app.use("/api/movies", moviesRoute);
  app.use(errorHandler);
};

module.exports = modules;
