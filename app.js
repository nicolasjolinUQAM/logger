var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var reqLogger = require('morgan');
var appLogger = require('./applogger');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

class Account {
  claims() {
    return Object.assign({}, {
      accountId: 123,
      email: 'jolin.nicolas@uqam.ca',
      name: 'Nicolas Jolin',
      given_name: 'Nicolas',
      family_name: 'Jolin',
      roles: ['role1,role2'],
      email_verified: true,
      preferred_username: 'whatever',
      sub: 456
    });
  }
}

var claimsArray = [new Account().claims()];

// Application Logger Test
appLogger.info('Hello World !');
appLogger.info('Account: ' + JSON.stringify(claimsArray));
appLogger.debug('Something to check');
appLogger.error('Error: ', new Error('Uncaught Exception'));
appLogger.info('Hello again, World !');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(reqLogger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
