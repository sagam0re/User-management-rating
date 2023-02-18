const pino = require('pino');
const pretty = require('pino-pretty');
require('dotenv').config();

const { PRETTY_LOGGING } = process.env;

class Logger {
  constructor() {
    const config = pretty({
      prettyPrint: PRETTY_LOGGING,
      translateTime: true,
    });
    this.logger = pino(config);
  }
  info(msg) {
    this.logger.info(msg);
  }

  warn(msg) {
    this.logger.warn(msg);
  }
  error(msg) {
    this.logger.error(msg);
  }
}

module.exports = Logger;
