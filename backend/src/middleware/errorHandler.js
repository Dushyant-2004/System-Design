class AppError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, stack: err.stack };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    error = new AppError(`Duplicate field value for: ${field}`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = new AppError('Validation Error', 400, messages);
  }

  // Groq API errors
  if (err.message?.includes('Groq') || err.message?.includes('groq')) {
    error = new AppError('AI service temporarily unavailable. Please try again.', 503);
  }

  const statusCode = error.statusCode || 500;
  const response = {
    success: false,
    status: error.status || 'error',
    message: error.message || 'Internal Server Error',
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  console.error(`[ERROR] ${statusCode} - ${error.message}`, {
    path: req.originalUrl,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });

  res.status(statusCode).json(response);
};

module.exports = { AppError, errorHandler };
