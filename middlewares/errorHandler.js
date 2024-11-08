const { API_ERROR, INVALID_LOGIN } = require("../utils/errors");

module.exports.handleError = (err, res) => {
  console.error(err);
  return res.status(err.statusCode).send({ message: err.message });
};

module.exports.handleDefaultError = (message, res) =>
  this.handleError(new API_ERROR(message), res);

module.exports.handleAuthError = (res) =>
  this.handleError(new INVALID_LOGIN("Authorization error"), res);

module.exports.errorHandler = (err, req, res, next) => {
  if (err instanceof API_ERROR) {
    return this.handleError(err, res);
  }
  return this.handleDefaultError(err, res);
};
