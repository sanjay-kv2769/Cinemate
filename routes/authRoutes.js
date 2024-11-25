const express = require('express');
const authRoutes = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} = require('../controllers/authController');

authRoutes.route('/signup').post(signup);
authRoutes.route('/login').post(login);
authRoutes.route('/forgotPassword').post(forgotPassword);
authRoutes.route('/resetPassword/:token').patch(resetPassword);
// authRoutes.route('/updatePassword').patch(protect, updatePassword);

module.exports = authRoutes;
