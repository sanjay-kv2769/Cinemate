require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception occurred! Shutting down...');
  process.exit(1);
});

const app = require('./app');

console.log(process.env.NODE_ENV);

mongoose.connect(process.env.MONGO_URL).then((conn) => {
  console.log('Database Connected Successfully');
  // console.log(conn);
});
// .catch((error) => {
//   console.log(error);
// });

const PORT = process.env.PORT;

// app.listen(process.env.PORT, () => {
//   console.log('server is running on http://localhost:' + PORT);
// });
const server = app.listen(process.env.PORT, () => {
  console.log('server is running on http://localhost:' + PORT);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection occurred! Shutting down...');

  server.close(() => {
    process.exit(1);
  });
});

