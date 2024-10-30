const express = require('express');
const app = express();
const fs = require('fs');
const userData = JSON.parse(fs.readFileSync('./Data/Data.json'));

app.use(express.json());

// Route Handlers
const GetAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: userData,
  });
};

const GetSingleUsers = (req, res) => {
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

const AddNewUser = (req, res) => {
  let newId = userData.length + 1;
  const newUser = Object.assign({ id: newId }, req.body);
  userData.push(newUser);
  fs.writeFile('./Data/Data.json', JSON.stringify(userData), (err) => {
    res.status(201).json({
      status: 'success',
      newUser: newUser,
    });
  });
};

const UpdateUser = (req, res) => {
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

  fs.writeFile('./Data/Data.json', JSON.stringify(userData), (err) => {
    res.status(200).json({
      status: 'success',
      users: userData,
    });
  });
};

const DeleteUser = (req, res) => {
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
  fs.writeFile('./Data/Data.json', JSON.stringify(userData), (err) => {
    res.status(204).json({
      Users: null,
    });
  });
};

// app.get('/api/user', GetAllUsers);
// app.post('/api/user', AddNewUser);
// app.patch('/api/user/:id', UpdateUser);
// app.delete('/api/user/:id', DeleteUser);

app.route('/api/user').get(GetAllUsers).post(AddNewUser);
app
  .route('/api/user/:id')
  .get(GetSingleUsers)
  .patch(UpdateUser)
  .delete(DeleteUser);

app.listen(8084, () => {
  console.log('server is running on http://localhost:8084');
});
