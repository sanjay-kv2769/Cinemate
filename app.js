const express = require('express');
const app = express();
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

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

module.exports = app;
