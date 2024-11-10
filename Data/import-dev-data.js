const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('../model/movieModel');

require('dotenv').config({ path: './config.env' });

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log('Database Connected Successfully');
    // console.log(conn);
  })
  .catch((error) => {
    console.log(error);
  });

const movies = JSON.parse(fs.readFileSync('./data/moviesData.json', 'utf-8'));

//   Delete existing movies documents form collection
const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log('Data deleted successfully');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

// Import movies data to mongodb collection
const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log('Data imported successfully');
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

// console.log(process.argv);

if (process.argv[2] === '--import') {
  importMovies();
}
if (process.argv[2] === '--delete') {
  deleteMovies();
}
