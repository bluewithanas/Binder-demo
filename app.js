var createError = require("http-errors");
var express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const expressValidator = require("express-validator");

var cookieParser = require("cookie-parser");
const passport = require("passport");
const bodyParser = require("body-parser");
var logger = require("morgan");
var path = require("path");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(passport.initialize());

require("./strategies/jsonwtstrategies")(passport);

var Authrouter = require("./routes/auth.routes");
app.use("/auth", Authrouter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const db = require("./setup/mongourl").mongoURL;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("mongo Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
