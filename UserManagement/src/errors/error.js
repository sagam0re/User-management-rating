class CustomError extends Error {
  constructor(message, code, name) {
    super(message);
    this.code = code;
  }
}

module.exports = CustomError;
