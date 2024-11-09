const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const app = require('./app');

mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log('Database Connected Successfully');
    // console.log(conn);
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT;

app.listen(process.env.PORT, () => {
  console.log('server is running on http://localhost:' + PORT);
});
