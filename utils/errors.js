class API_ERROR extends Error {
  constructor(message) {
    super(message);
    this.name = "API_ERROR";
    this.statusCode = 500;
  }
}

class RESOURCE_NOT_FOUND extends API_ERROR {
  constructor(message) {
    super(message);
    this.name = "RESOURCE_NOT_FOUND";
    this.statusCode = 404;
  }
}

class BAD_REQUEST extends API_ERROR {
  constructor(message) {
    super(message);
    this.name = "BAD_REQUEST";
    this.statusCode = 400;
  }
}
class NON_UNIQUE_SUBMISSION extends BAD_REQUEST {
  constructor(message) {
    super(message);
    this.name = "NON_UNIQUE_SUBMISSION";
    this.statusCode = 409;
  }
}
class FORBIDDEN_REQUEST extends BAD_REQUEST {
  constructor(message) {
    super(message);
    this.name = "FORBIDDEN_REQUEST";
    this.statusCode = 403;
  }
}

class INVALID_LOGIN extends BAD_REQUEST {
  constructor(message) {
    super(message);
    this.name = "INVALID_LOGIN";
    this.statusCode = 401;
  }
}

module.exports = {
  RESOURCE_NOT_FOUND,
  NON_UNIQUE_SUBMISSION,
  BAD_REQUEST,
  API_ERROR,
  INVALID_LOGIN,
  FORBIDDEN_REQUEST,
};
