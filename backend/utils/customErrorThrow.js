class customError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // This is required for proper stack trace support in V8
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = customError;
