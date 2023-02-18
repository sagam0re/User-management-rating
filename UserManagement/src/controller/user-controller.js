const CustomError = require('../errors/error');
const UserService = require('../services/user-service');
const ROLE = require('../constants/roles');
const messages = require('../constants/response-msg');

const userService = new UserService();

class UserController {
  constructor() {}

  signup = async (req, res) => {
    try {
      const { nickName, password, fullName, role } = req.body;

      await userService.register(nickName, password, fullName, role);
      res.send({ message: messages.signupOkMsg });
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).send({ message: err.message });
      }
      res.status(500).send({ message: 'Opss... Something went wrong!' });
    }
  };

  login = async (req, res) => {
    try {
      const nickName = req.body.nickName;
      const password = req.body.password;
      const { token } = await userService.login(nickName, password);
      res.send({ message: messages.loginOkMsg, token: token });
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).send({ message: err.message });
      }
      res.status(500).send({ message: 'Opss... Something went wrong!' });
    }
  };

  update = async (req, res) => {
    try {
      res.header('Last-Modified', new Date());
      const { nickName: nick, role } = req.userData;
      const unModifiedSince = req.headers['if-unmodified-since'];
      const { nickName, password, fullName } = req.body;
      if (
        role === ROLE.ADMIN ||
        (role === ROLE.BASIC && nick === nickName) ||
        (role === ROLE.MODERATOR && nick === nickName)
      ) {
        const updatedUser = await userService.update(
          unModifiedSince,
          nickName,
          password,
          fullName
        );
        return res.send({ message: updatedUser });
      }

      return res.status(401).send({ message: messages.unAuthorized });
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).send({ message: err.message });
      }
      res.status(500).send({ message: 'Opss... Something went wrong!' });
    }
  };
  delete = async (req, res) => {
    try {
      const { nickName: nick, role } = req.userData;
      const { nickName } = req.params;
      if (
        role === ROLE.ADMIN ||
        (role === ROLE.BASIC && nick === nickName) ||
        (role === ROLE.MODERATOR && nick === nickName)
      ) {
        const deletedUser = await userService.delete(nickName, nick);
        return res.send({ deleted: deletedUser });
      } else {
        return res.status(401).send({ message: messages.unAuthorized });
      }
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).send({ message: err.message });
      }
      res.status(500).send({ message: 'Opss... Something went wrong!' });
    }
  };

  getUser = async (req, res) => {
    try {
      const pag = res.paginatedResults;
      res.send(pag);
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).send({ message: err.message });
      }
      res.status(500).send({ message: 'Opss... Something went wrong!' });
    }
  };
}

module.exports = UserController;
