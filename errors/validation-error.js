const { INCORRECT_DATA } = require('./errors');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA;
  }
}

module.exports = {
  ValidationError,
};
