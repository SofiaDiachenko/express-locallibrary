require('dotenv').config();

const express = require('express');
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const queriesRouter = require('./routes/queries');
const catalogRouter = require("./routes/catalog"); 
const bookinstanceRouter = require('./routes/bookinstance');

const app = express(); // ✅ спочатку створити app

const connectDB = require('./db');
connectDB();

// Безпека
app.use(compression());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

// Лімітування
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});
app.use(limiter);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Роути
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);
app.use('/catalog', catalogRouter); 
app.use('/catalog/bookinstance', bookinstanceRouter); 

// Обробка 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Обробка помилок
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
