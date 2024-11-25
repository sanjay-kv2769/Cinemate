const express = require('express');
const { protect } = require('../controllers/authController');
const {
  updatePassword,
  updateProfile,
  deleteProfile,
  getAllUsers,
} = require('../controllers/userProfileController');
const userProfileRoutes = express.Router();

userProfileRoutes.route('/getAllUsers').get(getAllUsers);
userProfileRoutes.route('/updatePassword').patch(protect, updatePassword);
userProfileRoutes.route('/updateProfile').patch(protect, updateProfile);
userProfileRoutes.route('/deleteProfile').delete(protect, deleteProfile);

module.exports = userProfileRoutes;
