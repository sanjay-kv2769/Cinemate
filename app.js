const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');//deprecated
const xssCleanMiddleware = require('./utils/xssSanitization');
const hpp = require('hpp');

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/errorController');
const userProfileRoutes = require('./routes/userProfileRoutes');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message:
    'We have received too many request from this IP. Please try after one hour',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(sanitize()); //for $ and . (make them empty)
// app.use(xss()); //deprecated
app.use(xssCleanMiddleware); // Cleans HTML, Script inputs
app.use(
  hpp({
    whitelist: [
      // 'duration',
      'ratings',
      'releaseYear',
      'releaseDate',
      'genres',
      'directors',
      'actors',
      'price',
    ],
  })
); //duration=136&duration=139 last value will be taken (if duration is not whitelisted)

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static('./public'));

app.use((req, res, next) => {
  // req.requestedAt = new Date().toISOString();
  req.requestedDate = new Date().toDateString();
  req.requestedTime = new Date().toLocaleTimeString();
  next();
});

// Route Handlers
app.use('/api/movie', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/userProfile', userProfileRoutes);
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on the server!`,
  // });
  // const err = new Error(`Can't find the ${req.originalUrl} on the server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  const err = new CustomError(
    `Can't find the ${req.originalUrl} on the serverrr!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
