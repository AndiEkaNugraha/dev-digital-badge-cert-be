var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const fileUpload = require("express-fileupload");

var indexRouter = require("./routes/index");

var app = express();
app.use(cors(), fileUpload());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(bodyParser.json({ limit: "1500mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "1500mb",
    extended: true,
    parameterLimit: 5000000,
  })
);

// Middleware with a timeout
// app.use((req, res, next) => {
//   setTimeout(() => {
//     // This will be executed after the specified timeout
//     next();
//   }, 10000); // 5000 milliseconds (5 seconds) timeout
// });

// app.use(express.timeout('5m'));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use('/users', usersRouter);
app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
