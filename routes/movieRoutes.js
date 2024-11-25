const express = require('express');

const {
  GetAllMovies,
  AddNewMovie,
  GetSingleMovies,
  UpdateMovie,
  DeleteMovie,
  getHighestRated,
  MovieStats,
  getMovieByGenre,
  //   checkId,
  //   validateBody,
} = require('../controllers/moviesControllers');
const { protect, restrict } = require('../controllers/authController');
const movieRoutes = express.Router();

// movieRoutes.param('id', checkId);

movieRoutes.route('/highest-rated').get(getHighestRated, GetAllMovies);
movieRoutes.route('/movie-stats').get(MovieStats);
movieRoutes.route('/movies-by-genre/:genre').get(getMovieByGenre);

movieRoutes.route('/').get(protect, GetAllMovies).post(AddNewMovie);
movieRoutes
  .route('/:id')
  .get(protect, GetSingleMovies)
  .patch(UpdateMovie)
  .delete(protect, restrict('admin'), DeleteMovie);

module.exports = movieRoutes;
