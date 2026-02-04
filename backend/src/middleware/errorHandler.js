const { CustomAPIError, ValidationError, DuplicateKeyError } = require('../errors');
const { JsonWebTokenError } = require('jsonwebtoken');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error object
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Something went wrong, please try again later',
    errors: err.errors || null
  };

  // Handle specific error types
  if (err instanceof ValidationError) {
    customError = {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors
    };
  }

  if (err instanceof DuplicateKeyError) {
    customError = {
      statusCode: err.statusCode,
      message: err.message
    };
  }

  if (err.name === 'ValidationError' && err.errors) {
    // Mongoose validation error
    customError.statusCode = 400;
    customError.message = 'Validation Error';
    customError.errors = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
  }

  if (err.code && err.code === 11000) {
    // MongoDB duplicate key error
    customError = new DuplicateKeyError(
      `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    );
    customError.statusCode = 409;
  }

  if (err.name === 'CastError') {
    // MongoDB CastError (invalid ObjectId)
    customError = new BadRequestError(`No item found with id: ${err.value}`);
  }

  if (err instanceof JsonWebTokenError) {
    customError = new UnauthenticatedError('Invalid token');
  }

  // Return error response
  return res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    errors: customError.errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandlerMiddleware;