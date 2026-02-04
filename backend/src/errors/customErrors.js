class CustomAPIError extends Error {
  constructor(message) {
    super(message);
  }
}

class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class DuplicateKeyError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class ValidationError extends CustomAPIError {
  constructor(message, errors) {
    super(message);
    this.statusCode = 400;
    this.errors = errors;
  }
}

module.exports = {
  CustomAPIError,
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
  DuplicateKeyError,
  ValidationError
};