const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.config();

const usersRouter = require('./Routes/users.routes');
const requestRouter = require('./Routes/friend.routers');

const app = express();

// Security Middlewares
app.use(helmet()); // Secure headers
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' })); // CORS setup
app.use(cookieParser());
app.use(compression()); 

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use('/fb', apiLimiter);

// Routes
app.use('/fb/users', usersRouter);
app.use('/fb/requests', requestRouter);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    message: "No such route exists",
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Error: ", err.message);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

// Server Listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
