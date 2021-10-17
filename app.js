process.on('uncaughtException', console.error)

require('dotenv').config() // dot env loaded

var fs = require('fs')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var moment = require('moment-timezone')

var apiRouter = require('./routes/api');

var app = express();

var PORT = process.env.PORT || 8080
var TIME = moment().tz('Asia/Jakarta').format('DD/MM/YYYY-HH:mm:ss')

var server = app.listen(PORT)
var io = require('socket.io')(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('json spaces', 2)

app.use(cors({ origin: '*' }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    req.io = io
    next()
})

app.use('/api/v1', apiRouter);

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

io.on('connection', socket => {
    console.log(`[${TIME}] SocketIo Connected!`)
})

module.exports = app;
