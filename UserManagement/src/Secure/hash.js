const util = require('util');
const crypto = require('crypto');

const hash = util.promisify(crypto.pbkdf2);

async function hashingPass(pass, salt) {
  salt = salt || crypto.randomBytes(10).toString('hex');
  let hashedPass = await hash(pass, salt, 1000, 64, 'sha512');
  hashedPass = hashedPass.toString('hex');
  return {
    hashedPass,
    salt,
  };
}

module.exports = { hashingPass };
