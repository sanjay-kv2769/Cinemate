const express = require('express');
// const userController = require('./../controllers/userControllers');

const {
  GetAllUsers,
  AddNewUser,
  GetSingleUsers,
  UpdateUser,
  DeleteUser,
  checkId,
  validateBody,
} = require('../controllers/userControllers');


const userRoutes = express.Router();

userRoutes.param('id', checkId);

userRoutes.route('/').get(GetAllUsers).post(validateBody, AddNewUser);
userRoutes
  .route('/:id')
  .get(GetSingleUsers)
  .patch(UpdateUser)
  .delete(DeleteUser);

module.exports = userRoutes;

// app.get('/api/user', GetAllUsers);
// app.post('/api/user', AddNewUser);
// app.patch('/api/user/:id', UpdateUser);
// app.delete('/api/user/:id', DeleteUser);
