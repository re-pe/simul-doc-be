const createError = require("http-errors");
const express = require("express");
const session = require("express-session");
//const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const documentsRouter = require("./routes/documents");
const userProfile = require("./routes/profile");
const userLogin = require("./routes/login");
const userLogout = require("./routes/logout");

// Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = "mongoDb://localhost/auth-tut";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
// const store = new MongoDBStore({
//   uri: "mongodb://localhost/session_test",
//   databaseName: "session_test",
//   collection: "mySessions"
// });

// Catch errors
// store.on("error", function(error) {
//   assert.ifError(error);
//   assert.ok(false);
// });

const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

//tutorial
app.use(
  session({
    secret: "vowel either object copper",
    signed: true,
    cookie: { secure: true },
    //    store: store,
    resave: false,
    saveUninitialized: true
  })
);

app.use("*", cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));

//tutorial
// serve static files from template
//app.use(express.static(__dirname + '/templateLogReg'));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/documents", documentsRouter);
app.use("/profile", userProfile);
app.use("/login", userLogin);
app.use("/logout", userLogout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
