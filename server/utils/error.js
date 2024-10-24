class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ValidationError extends CustomError {
  constructor(message, details) {
    super(message, 400);
    this.details = details;
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Internal Server Error') {
    super(message, 500);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

module.exports = {
  CustomError,
  ValidationError,
  InternalServerError,
  NotFoundError
}

