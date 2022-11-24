const { INCORRECT_DATA } = require('./errors');

class CastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA;
  }
}

module.exports = {
  CastError,
};
