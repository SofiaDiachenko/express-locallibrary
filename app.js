require('dotenv').config()

const compression = require("compression");
app.use(compression()); // до express.static
const helmet = require("helmet");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
const RateLimit = require("express-rate-limit");

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 хв
  max: 20,
});

app.use(limiter);

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var queriesRouter = require('./routes/queries');
const catalogRouter = require("./routes/catalog"); 
const bookinstanceRouter = require('./routes/bookinstance');

var app = express(); 

const connectDB = require('./db');
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/queries', queriesRouter);
app.use('/catalog', catalogRouter); 
app.use('/catalog/bookinstance', bookinstanceRouter); 
module.exports = app;

