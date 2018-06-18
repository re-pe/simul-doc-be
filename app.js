const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const documentsRouter = require('./routes/documents');
const userProfile = require('./routes/profile');
const userLogin = require('./routes/login');
const userLogout = require('./routes/logout');

const mongoDB = 'mongoDb://localhost/simul-doc';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const app = express();

app.use(session({
  secret: 'vowel either object copper',
  signed: true,
  cookie: { secure: true },
  resave: false,
  saveUninitialized: true,
}));

app.use('*', cors({
  origin: true,
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/documents', documentsRouter);
app.use('/profile', userProfile);
app.use('/login', userLogin);
app.use('/logout', userLogout);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
