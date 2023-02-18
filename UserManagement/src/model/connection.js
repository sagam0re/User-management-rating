const mongoose = require('mongoose');

exports.connectingDB = async function (url) {
  await mongoose.connect(url);
};
