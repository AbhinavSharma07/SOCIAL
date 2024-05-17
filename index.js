var express = require('express');
const bodyParser = require('body-parser')
let cookieParser = require('cookie-parser');

require('dotenv').config()

var usersRouter = require('./Routes/users.routes');
var requestRouter = require('./Routes/friend.routers');
var app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/fb', usersRouter);
app.use('/fb', requestRouter);

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 404).json({
    message: "No such route exists"
  })
});

// // error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: "Error Message"
  })
});

// server running
app.listen(process.env.PORT || 3000, () => {
    console.log("Node server started");
});

module.exports = app;
