const express = require('express');
const app = express();
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const CustomError = require('./utils/CustomError');
const globalErrorHandler = require('./controllers/errorController');

app.use(express.json());
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
app.use('/api/user', userRoutes);
app.use('/api/movie', movieRoutes);
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
