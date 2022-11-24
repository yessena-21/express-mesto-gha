const { FORBID_ERROR } = require('./errors');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBID_ERROR;
  }
}

module.exports = {
  ForbiddenError,
};
