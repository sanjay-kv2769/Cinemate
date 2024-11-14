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
const movieRoutes = express.Router();

// movieRoutes.param('id', checkId);

movieRoutes.route('/highest-rated').get(getHighestRated, GetAllMovies);
movieRoutes.route('/movie-stats').get(MovieStats);
movieRoutes.route('/movies-by-genre/:genre').get(getMovieByGenre);

movieRoutes.route('/').get(GetAllMovies).post(AddNewMovie);
movieRoutes
  .route('/:id')
  .get(GetSingleMovies)
  .patch(UpdateMovie)
  .delete(DeleteMovie);

module.exports = movieRoutes;
