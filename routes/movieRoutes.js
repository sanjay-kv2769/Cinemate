const express = require('express');

const {
  GetAllMovies,
  AddNewMovie,
  GetSingleMovies,
  UpdateMovie,
  DeleteMovie,
  //   checkId,
  //   validateBody,
} = require('../controllers/moviesControllers');
const movieRoutes = express.Router();

// movieRoutes.param('id', checkId);

movieRoutes.route('/').get(GetAllMovies).post(AddNewMovie);
movieRoutes
  .route('/:id')
  .get(GetSingleMovies)
  .patch(UpdateMovie)
  .delete(DeleteMovie);

module.exports = movieRoutes;
