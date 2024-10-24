const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { CustomError, ValidationError, NotFoundError, InternalServerError } = require('./utils/error');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
const passport = require('passport');
require('./config/passport');

// route setup
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiV1Router = require('./routes/apiV1');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1', apiV1Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(new NotFoundError());
});

// error handler
app.use(function(err, req, res, next) {
  // If error is a known type (derived from CustomError)
  if (err instanceof CustomError) {
    // If it's a validation error, include the details of the failed validation
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        details: err.details // Provide additional validation error info
      });
    }

    // Handle other known custom errors
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // For unexpected errors (e.g., programming errors), return a generic 500 error
  if(process.env.NODE_ENV !== 'production') console.error(err.stack); // debug
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

module.exports = app;
