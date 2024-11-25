const AsyncErrorHandler = require('../utils/AsyncErrorHandler');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const CustomError = require('../utils/CustomError');
const util = require('util');
const sendmail = require('../utils/Email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.cookie('jwt', token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const filterReqObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

exports.getAllUsers = AsyncErrorHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

exports.updatePassword = AsyncErrorHandler(async (req, res, next) => {
  //GET CURRENT USER DATA FROM DATABASE
  const user = await User.findById(req.user._id).select('+password');

  //CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
  if (
    !(await user.comparePasswordInDb(req.body.currentPassword, user.password))
  ) {
    return next(
      new CustomError('The current password you provided is wrong', 401)
    );
  }

  //IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();
  //LOGIN USER & SEND JWT
  createSendResponse(user, 200, res);
});

exports.updateProfile = AsyncErrorHandler(async (req, res, next) => {
  //1. CHECK IF REQUEST DATA CONTAIN PASSWORD | CONFIRM PASSWORD
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new CustomError(
        'You cannot update your password using this endpoint',
        400
      )
    );
  }
  //UPDATE USER DETAIL
  const filterObj = filterReqObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterObj, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteProfile = AsyncErrorHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
