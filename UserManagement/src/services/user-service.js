require('dotenv').config();
const jwt = require('jsonwebtoken');
const { model } = require('../model/user-profile-model');
const { hashingPass } = require('../Secure/hash');
const CustomError = require('../errors/error.js');

const { JWT_KEY } = process.env;

class UserService {
  constructor() {}

  async register(nickName, password, fullName, role) {
    const existedUser = await model.findOne({ nickName });

    if (!nickName || !password || !fullName || !role) {
      throw new CustomError('Please, Fill all the fields', 404);
    }

    if (existedUser) {
      throw new CustomError('Nickname already exists', 400);
    }
    const { hashedPass, salt } = await hashingPass(password);
    const createdUser = await model.create({
      nickName,
      fullName,
      password: hashedPass,
      salt,
      role,
    });
    return createdUser;
  }

  async login(nickName, pass) {
    const userProfile = await model.findOne({ nickName, deleted: false });

    if (!userProfile) {
      throw new CustomError('User does not exist', 403);
    }
    const { salt, password } = userProfile;
    const { hashedPass } = await hashingPass(pass, salt);

    if (hashedPass !== password) {
      throw new CustomError('Wrong password', 404);
    }

    const token = jwt.sign({ nickName, role: userProfile.role }, JWT_KEY, {
      expiresIn: '24h',
    });

    return { userProfile, token };
  }

  async update(unModifiedSince, nick_name, newPass, new_FName) {
    if (!nick_name || !newPass || !new_FName) {
      throw new CustomError('You need to fill all the fields', 400);
    }
    const user = await model.findOne({
      nickName: nick_name,
    });
    if (!user) {
      throw new CustomError('Can not change unique nickname', 400);
    }
    const { salt, password, fullName, nickName, updatedAt, deleted } = user;
    if (deleted) {
      throw new CustomError("Sorry, You can't update deleted profile", 400);
    }

    const { hashedPass } = await hashingPass(newPass, salt);
    if (password === hashedPass && fullName === new_FName) {
      throw new CustomError('Nothing has been changed', 400);
    }

    if (Date.parse(unModifiedSince) <= Date.parse(updatedAt)) {
      await model.updateOne(
        { nickName },
        {
          password: hashedPass,
          fullName: new_FName,
        }
      );
      return 'User has been updated';
    }
    throw new CustomError('Not Modified', 304);
  }

  async delete(nickName) {
    const alreadyDeletedUser = await model.findOne({
      nickName,
      deleted: true,
    });

    if (alreadyDeletedUser) {
      throw new CustomError('User has been deleted already', 403);
    }

    const deletedUser = await model.delete({ nickName });

    if (deletedUser) {
      return await model
        .findOne({ nickName })
        .select(['nickName', 'fullName', '-_id']);
    }
  }
}

module.exports = UserService;
