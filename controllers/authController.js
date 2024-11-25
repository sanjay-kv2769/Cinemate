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
exports.signup = AsyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, {
  //   expiresIn: process.env.LOGIN_EXPIRES,
  // });
  const token = signToken(newUser._id);

  createSendResponse(newUser, 201, res);
});

exports.login = AsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new CustomError(
      'Please provide Email ID & Password for login',
      400
    );
    return next(error);
  }

  const user = await User.findOne({ email }).select('password');

  // const isMatch = await user.comparePasswordInDb(password, user.password);
  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError('Incorrect Email or Password', 400);
    return next(error);
  }
  createSendResponse(user, 200, res);
});

exports.protect = AsyncErrorHandler(async (req, res, next) => {
  //------ Read the token  & check if it exist
  const testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith('Bearer')) {
    token = testToken.split(' ')[1];
  }
  if (!token) {
    const error = new CustomError('You are not logged in! ', 401);
    return next(error);
  }
  //------ Validate the token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  //------ If the user exists
  const user = await User.findById(decodedToken.id);

  if (!user) {
    const error = new CustomError(
      'The user with the given token does not exist',
      401
    );
    next(error);
  }
  //------ If the user changed password after the token was issued
  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      'The password has been changed recently. Please login again',
      401
    );
    return next(error);
  }

  //------ Allow user to access route
  req.user = user;
  next();
});

exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role != role) {
      const error = new CustomError(
        'You do not have have permission to perform this action',
        403
      );
      next(error);
    }
    next();
  };
};

// For multiple roles
// exports.restrict = (...role) => {
//   return (req, res, next) => {
//     if (!role.includes(req.user.role)) {
//       const error = new CustomError(
//         'You do not have have permission to perform this action',
//         403
//       );
//       next(error);
//     }
//     next();
//   };
// };

exports.forgotPassword = AsyncErrorHandler(async (req, res, next) => {
  // 1. Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    const error = new CustomError(
      'We could not find the user with given email',
      404
    );
    next(error);
  }

  // 2. Generate a random reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send the token back to the user email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/auth/resetPassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\n This reset password link will be valid only for 10 minutes`;
  try {
    await sendmail({
      email: user.email,
      subject: 'Password change request received',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'password reset link send to the user email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new CustomError(
        'There was an error sending password reset email. Please try again later',
        500
      )
    );
  }
});

exports.resetPassword = AsyncErrorHandler(async (req, res, next) => {
  // 1. The user exists with the given token & token has not expired
  const token = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    const error = new CustomError('Token is invalid or has expired!', 400);
    next(error);
  }
  // 2. Resetting the user password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  user.save();

  createSendResponse(user, 200, res);
});
