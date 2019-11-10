var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var taskRouter = require('./routes/tasks');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client  = redis.createClient();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  name: 'session.sid',
  secret: '123abc!',
  saveUninitialized: true,
  resave: true,
  store: new FileStore(),
  cookie: {
    secure: false,
    maxAge: 600000
  }
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
