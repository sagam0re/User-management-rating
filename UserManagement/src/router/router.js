const { model } = require('../model/user-profile-model');
const UserController = require('../controller/user-controller');
const jwtMiddleware = require('../middlewares/jwtoken');
const pagination = require('../middlewares/pagination');

const userController = new UserController();

exports.router = function (app) {
  app.post('/signup', userController.signup);
  app.post('/login', userController.login);
  app.put('/update', jwtMiddleware, userController.update);
  app.delete('/delete/:nickName', jwtMiddleware, userController.delete);
  app.get('/users', pagination(model), userController.getUser);
};
