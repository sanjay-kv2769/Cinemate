const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required failed!'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required failed!'],
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required failed!'],
  },
  ratings: {
    type: Number,
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release Year is required failed!'],
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  genres: {
    type: [String],
    required: [true, 'Genres is required failed!'],
  },
  directors: {
    type: [String],
    required: [true, 'Directors is required failed!'],
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required failed!'],
  },
  actors: {
    type: [String],
    required: [true, 'Actors is required failed!'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required failed!'],
  },
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
