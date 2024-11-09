const userData = require('../Data/Data.json');
const fs = require('fs');

exports.checkId = (req, res, next, value) => {
  let id = value * 1;
  console.log('User ID is ' + id);

  const singleUser = userData.find((element) => element.id === id);

  if (!singleUser) {
    return res.status(404).json({
      message: `the data with ${id} is not found`,
    });
  }
  next();
};

exports.validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.username || !req.body.email) {
    return res.status(400).json({
      status: 'failed',
      message: 'Not a valid user data',
    });
  }
  next();
};

exports.GetAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedDate: req.requestedDate,
    requestedTime: req.requestedTime,
    data: userData,
  });
};

exports.GetSingleUsers = (req, res) => {
  const id = req.params.id * 1;
  const singleUser = userData.find((element) => element.id === id);
  if (!singleUser) {
    return res.status(404).json({
      status: 'fail',
      message: `the data with ${id} is not found`,
    });
  }
  res.status(200).json({
    status: 'success',
    data: singleUser,
  });
};

exports.AddNewUser = (req, res) => {
  let newId = userData.length + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  userData.push(newUser);
  fs.writeFile('././Data/Data.json', JSON.stringify(userData), (err) => {
    res.status(201).json({
      status: 'success',
      newUser: newUser,
    });
  });
};

exports.UpdateUser = (req, res) => {
  const id = req.params.id * 1;
  const userToUpdate = userData.find((element) => element.id === id);
  if (!userToUpdate) {
    return res.status(404).json({
      status: 'fail',
      message: `the data with ${id} is not found`,
    });
  }
  const index = userData.indexOf(userToUpdate);
  Object.assign(userToUpdate, req.body);
  userData[index] = userToUpdate;
  console.log(userData);

  fs.writeFile('././Data/Data.json', JSON.stringify(userData), (err) => {
    res.status(200).json({
      status: 'success',
      users: userData,
    });
  });
};

exports.DeleteUser = (req, res) => {
  const id = req.params.id * 1;
  const userToDelete = userData.find((element) => element.id === id);
  if (!userToDelete) {
    return res.status(404).json({
      status: 'fail',
      message: `the data with ${id} is not found`,
    });
  }
  const index = userData.indexOf(userToDelete);

  userData.splice(index, 1);
  fs.writeFile('././Data/Data.json', JSON.stringify(userData), (err) => {
    res.status(204).json({
      Users: null,
    });
  });
};
