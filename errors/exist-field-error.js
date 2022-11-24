const { EXIST_ERROR } = require('./errors');

class ExistFieldError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = EXIST_ERROR;
  }
}

module.exports = {
  ExistFieldError,
};
