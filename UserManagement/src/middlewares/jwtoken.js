require('dotenv').config();
const jwt = require('jsonwebtoken');
const { model } = require('../model/user-profile-model');

const { JWT_KEY } = process.env;

async function tokenMiddleware(req, res, next) {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    const decoded = jwt.verify(token, JWT_KEY);
    const deletedUser = await model.findOne({
      nickName: decoded.nickName,
      deleted: true,
    });

    if (deletedUser) {
      return res.status(400).send({ message: 'Your profile is deleted!!!' });
    }
    req.userData = decoded;
    next();
  } catch (err) {
    res.status(401).send({ Error: err.message });
  }
}

module.exports = tokenMiddleware;
